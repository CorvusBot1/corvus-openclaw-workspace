/**
 * Province Renamer for AsyncWar
 * 
 * Analyzes provinces by biome, finds related regions,
 * and generates evocative names with directional prefixes
 * for provinces that share the same biome region.
 */

const fs = require('fs');
const path = require('path');
const { generateName, getDirectionalPrefix, hexDistance } = require('./biome-names');

// Configuration
const ASYNCWAR_PATH = process.env.ASYNCWAR_PATH || '/root/.openclaw/workspace/asyncwar';
const REGION_DISTANCE_THRESHOLD = 15; // Max hex distance to consider provinces "related"

/**
 * Load terrain data from asyncwar repo
 */
function loadTerrainData() {
  const terrainPath = path.join(ASYNCWAR_PATH, 'data/map/terrain.index.json');
  return JSON.parse(fs.readFileSync(terrainPath, 'utf8'));
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
 * Find clusters of nearby provinces with the same biome
 * Uses simple distance-based clustering
 */
function findBiomeRegions(provinces, threshold = REGION_DISTANCE_THRESHOLD) {
  const regions = [];
  const assigned = new Set();
  
  provinces.forEach(p => {
    if (assigned.has(p.id)) return;
    
    // Start a new region with this province
    const region = [p];
    assigned.add(p.id);
    
    // Find all nearby provinces of same biome
    provinces.forEach(other => {
      if (assigned.has(other.id)) return;
      if (other.dominantBiome !== p.dominantBiome) return;
      
      // Check if close to any province in the region
      const isNearby = region.some(rp => hexDistance(rp, other) <= threshold);
      if (isNearby) {
        region.push(other);
        assigned.add(other.id);
      }
    });
    
    regions.push(region);
  });
  
  return regions;
}

/**
 * Generate names for a region of related provinces
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
      // Try alternative directions
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
  
  console.log(`Found ${terrain.provinces.length} provinces\n`);
  
  // Group by biome
  const biomeGroups = groupByBiome(terrain.provinces);
  
  const usedNames = new Set();
  const renames = [];
  
  // Process each biome
  Object.entries(biomeGroups).forEach(([biome, provinces]) => {
    console.log(`\n=== ${biome.toUpperCase()} (${provinces.length} provinces) ===`);
    
    // Find related regions
    const regions = findBiomeRegions(provinces);
    
    regions.forEach((region, idx) => {
      const regionNames = nameRegion(region, usedNames);
      
      if (region.length > 1) {
        console.log(`\n  Region ${idx + 1} (${region.length} provinces):`);
      }
      
      regionNames.forEach(({ province, newName }) => {
        console.log(`    ${province.id}: "${province.name}" → "${newName}"`);
        renames.push({
          id: province.id,
          oldName: province.name,
          newName: newName,
          biome: biome,
          center: province.centerHex
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
    renames: renames
  };
  
  renames.forEach(r => {
    if (!report.byBiome[r.biome]) report.byBiome[r.biome] = 0;
    report.byBiome[r.biome]++;
  });
  
  return report;
}

// Run if called directly
if (require.main === module) {
  const { renames, terrain } = renameAllProvinces();
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total renames: ${renames.length}`);
  
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
