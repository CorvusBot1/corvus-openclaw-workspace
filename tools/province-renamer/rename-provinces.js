/**
 * Province Renamer for AsyncWar
 * 
 * Analyzes provinces by biome, finds ACTUALLY CONNECTED regions,
 * and generates evocative names with directional prefixes
 * for provinces that share borders within the same biome.
 */

const fs = require('fs');
const path = require('path');
const { generateName, getDirectionalPrefix } = require('./biome-names');

// Configuration
const ASYNCWAR_PATH = process.env.ASYNCWAR_PATH || '/root/.openclaw/workspace/asyncwar';

/**
 * Load terrain data from asyncwar repo
 */
function loadTerrainData() {
  const terrainPath = path.join(ASYNCWAR_PATH, 'data/map/terrain.index.json');
  return JSON.parse(fs.readFileSync(terrainPath, 'utf8'));
}

/**
 * Load full map data to get biome info per tile
 */
function loadMapData() {
  const mapDir = path.join(ASYNCWAR_PATH, 'map');
  const files = fs.readdirSync(mapDir).filter(f => f.startsWith('asyncwar-map-') && f.endsWith('.json'));
  if (files.length === 0) throw new Error('No map file found');
  const mapPath = path.join(mapDir, files[0]);
  return JSON.parse(fs.readFileSync(mapPath, 'utf8'));
}

/**
 * Get the 6 adjacent hex coordinates for a given hex
 * Using axial coordinates (q, r)
 */
function getAdjacentHexes(q, r) {
  return [
    { q: q + 1, r: r },     // East
    { q: q - 1, r: r },     // West
    { q: q, r: r + 1 },     // Southeast
    { q: q, r: r - 1 },     // Northwest
    { q: q + 1, r: r - 1 }, // Northeast
    { q: q - 1, r: r + 1 }  // Southwest
  ];
}

/**
 * Parse a tile key like "5,10" into {q, r}
 */
function parseKey(key) {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
}

/**
 * Build adjacency map between provinces
 * Returns a map of provinceId -> Set of adjacent provinceIds
 */
function buildProvinceAdjacency(provinces) {
  // Build a map of tileKey -> provinceId
  const tileToProvince = new Map();
  provinces.forEach(p => {
    p.tileKeys.forEach(key => {
      tileToProvince.set(key, p.id);
    });
  });
  
  // For each province, find which other provinces it borders
  const adjacency = new Map();
  
  provinces.forEach(p => {
    const neighbors = new Set();
    
    p.tileKeys.forEach(key => {
      const { q, r } = parseKey(key);
      const adjacent = getAdjacentHexes(q, r);
      
      adjacent.forEach(adj => {
        const adjKey = `${adj.q},${adj.r}`;
        const adjProvince = tileToProvince.get(adjKey);
        
        if (adjProvince && adjProvince !== p.id) {
          neighbors.add(adjProvince);
        }
      });
    });
    
    adjacency.set(p.id, neighbors);
  });
  
  return adjacency;
}

/**
 * Group provinces by biome
 */
function groupByBiome(provinces) {
  const groups = {};
  provinces.forEach(p => {
    const biome = p.dominantBiome;
    if (!groups[biome]) groups[biome] = [];
    groups[biome].push(p);
  });
  return groups;
}

/**
 * Find connected regions of same-biome provinces
 * Uses flood fill on the adjacency graph, only connecting same-biome provinces
 */
function findConnectedBiomeRegions(provinces, adjacency) {
  const regions = [];
  const visited = new Set();
  
  // Create a map of id -> province for quick lookup
  const provinceMap = new Map();
  provinces.forEach(p => provinceMap.set(p.id, p));
  
  provinces.forEach(startProvince => {
    if (visited.has(startProvince.id)) return;
    
    // BFS to find all connected provinces of the same biome
    const region = [];
    const queue = [startProvince];
    visited.add(startProvince.id);
    
    while (queue.length > 0) {
      const current = queue.shift();
      region.push(current);
      
      // Check all adjacent provinces
      const neighbors = adjacency.get(current.id) || new Set();
      neighbors.forEach(neighborId => {
        if (visited.has(neighborId)) return;
        
        const neighbor = provinceMap.get(neighborId);
        if (!neighbor) return;
        
        // Only connect if same biome
        if (neighbor.dominantBiome === startProvince.dominantBiome) {
          visited.add(neighborId);
          queue.push(neighbor);
        }
      });
    }
    
    regions.push(region);
  });
  
  return regions;
}

/**
 * Generate names for a region of connected provinces
 */
function nameRegion(region, usedNames) {
  if (region.length === 0) return [];
  
  const biome = region[0].dominantBiome;
  const baseName = generateName(biome, usedNames);
  usedNames.add(baseName);
  
  if (region.length === 1) {
    // Single province - just use the base name
    return [{ province: region[0], newName: baseName }];
  }
  
  // Multiple provinces - add directional prefixes
  const results = [];
  
  // Sort by position to get consistent naming
  const sorted = [...region].sort((a, b) => {
    // Primary sort by r (north-south), secondary by q (west-east)
    if (a.centerHex.r !== b.centerHex.r) return a.centerHex.r - b.centerHex.r;
    return a.centerHex.q - b.centerHex.q;
  });
  
  sorted.forEach(p => {
    const others = sorted.filter(o => o.id !== p.id);
    const prefix = getDirectionalPrefix(p, others);
    const fullName = prefix + baseName;
    
    // Make sure the full name is unique
    if (usedNames.has(fullName)) {
      // Try alternative - generate a new name
      const altName = generateName(biome, usedNames);
      usedNames.add(altName);
      results.push({ province: p, newName: altName });
    } else {
      usedNames.add(fullName);
      results.push({ province: p, newName: fullName });
    }
  });
  
  return results;
}

/**
 * Main function - analyze and rename all provinces
 */
function renameAllProvinces() {
  console.log('Loading terrain data...');
  const terrain = loadTerrainData();
  
  console.log(`Found ${terrain.provinces.length} provinces`);
  
  // Build adjacency graph
  console.log('Building adjacency graph...');
  const adjacency = buildProvinceAdjacency(terrain.provinces);
  
  // Debug: show some adjacency info
  let totalConnections = 0;
  adjacency.forEach((neighbors, id) => {
    totalConnections += neighbors.size;
  });
  console.log(`Total province-to-province connections: ${totalConnections / 2}`);
  
  // Group by biome first for reporting
  const biomeGroups = groupByBiome(terrain.provinces);
  
  const usedNames = new Set();
  const renames = [];
  
  // Process each biome
  Object.entries(biomeGroups).forEach(([biome, provinces]) => {
    console.log(`\n=== ${biome.toUpperCase()} (${provinces.length} provinces) ===`);
    
    // Find actually connected regions within this biome
    const regions = findConnectedBiomeRegions(provinces, adjacency);
    
    // Sort regions by size (largest first) for better naming
    regions.sort((a, b) => b.length - a.length);
    
    regions.forEach((region, idx) => {
      const regionNames = nameRegion(region, usedNames);
      
      if (region.length > 1) {
        console.log(`\n  Connected Region (${region.length} provinces):`);
      }
      
      regionNames.forEach(({ province, newName }) => {
        const marker = region.length > 1 ? '  ' : '';
        console.log(`  ${marker}${province.id}: "${province.name}" → "${newName}"`);
        renames.push({
          id: province.id,
          oldName: province.name,
          newName: newName,
          biome: biome,
          center: province.centerHex,
          regionSize: region.length
        });
      });
    });
  });
  
  return { renames, terrain };
}

/**
 * Apply renames to terrain.index.json
 */
function applyRenames(renames, terrain, outputPath) {
  // Create a map of id -> new name
  const renameMap = {};
  renames.forEach(r => { renameMap[r.id] = r.newName; });
  
  // Update province names
  terrain.provinces.forEach(p => {
    if (renameMap[p.id]) {
      p.name = renameMap[p.id];
    }
  });
  
  // Write updated terrain
  fs.writeFileSync(outputPath, JSON.stringify(terrain, null, 2));
  console.log(`\nWrote updated terrain to: ${outputPath}`);
}

/**
 * Generate a summary report
 */
function generateReport(renames) {
  const report = {
    timestamp: new Date().toISOString(),
    totalProvinces: renames.length,
    byBiome: {},
    connectedRegions: { single: 0, multi: 0 },
    renames: renames
  };
  
  renames.forEach(r => {
    if (!report.byBiome[r.biome]) report.byBiome[r.biome] = 0;
    report.byBiome[r.biome]++;
    
    if (r.regionSize === 1) report.connectedRegions.single++;
    else report.connectedRegions.multi++;
  });
  
  return report;
}

// Run if called directly
if (require.main === module) {
  const { renames, terrain } = renameAllProvinces();
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total renames: ${renames.length}`);
  
  const multiRegion = renames.filter(r => r.regionSize > 1).length;
  const singleRegion = renames.filter(r => r.regionSize === 1).length;
  console.log(`In connected regions: ${multiRegion}`);
  console.log(`Standalone: ${singleRegion}`);
  
  // Generate report
  const report = generateReport(renames);
  const reportPath = path.join(__dirname, 'rename-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report saved to: ${reportPath}`);
  
  // Ask about applying changes
  if (process.argv.includes('--apply')) {
    const outputPath = path.join(ASYNCWAR_PATH, 'data/map/terrain.index.json');
    applyRenames(renames, terrain, outputPath);
  } else {
    console.log('\nRun with --apply to update terrain.index.json');
  }
}

module.exports = { renameAllProvinces, applyRenames, generateReport };
