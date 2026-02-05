/**
 * Biome-specific name patterns for AsyncWar provinces
 * 
 * Each biome has multiple naming patterns to provide variety
 */

// Base name components - evocative, varied
const nameRoots = {
  mystical: ['Shadow', 'Whisper', 'Echo', 'Veil', 'Mist', 'Dusk', 'Dawn', 'Twilight', 'Ember', 'Frost'],
  natural: ['Oak', 'Elm', 'Ash', 'Birch', 'Willow', 'Thorn', 'Briar', 'Fern', 'Moss', 'Lichen'],
  color: ['Black', 'White', 'Grey', 'Silver', 'Golden', 'Crimson', 'Azure', 'Emerald', 'Amber', 'Ivory'],
  animal: ['Raven', 'Wolf', 'Stag', 'Bear', 'Hawk', 'Fox', 'Owl', 'Serpent', 'Boar', 'Lynx'],
  terrain: ['Stone', 'Iron', 'Storm', 'Thunder', 'Wind', 'River', 'Lake', 'Brook', 'Crag', 'Hollow'],
  mood: ['Silent', 'Wandering', 'Lost', 'Ancient', 'Forgotten', 'Hidden', 'Watchful', 'Lonely', 'Wild', 'Sleeping']
};

// Combine root categories for each biome
const biomeRoots = {
  forest: [...nameRoots.mystical, ...nameRoots.natural, ...nameRoots.color, ...nameRoots.animal],
  grassland: [...nameRoots.natural, ...nameRoots.color, ...nameRoots.terrain, ...nameRoots.mood],
  plains: [...nameRoots.color, ...nameRoots.terrain, ...nameRoots.mood, ...nameRoots.animal],
  hills: [...nameRoots.terrain, ...nameRoots.color, ...nameRoots.animal, ...nameRoots.mood],
  swamp: [...nameRoots.mystical, ...nameRoots.mood, ...nameRoots.color],
  mountain: [...nameRoots.terrain, ...nameRoots.color, ...nameRoots.animal],
  desert: [...nameRoots.color, ...nameRoots.mood, ...nameRoots.terrain]
};

// Suffix patterns by biome - the key naming variety
const biomeSuffixes = {
  forest: [
    // "X Forest" patterns
    { pattern: 'suffix', value: ' Forest' },
    { pattern: 'suffix', value: ' Woods' },
    { pattern: 'suffix', value: ' Grove' },
    // "Xwood/Xweald" patterns  
    { pattern: 'compound', value: 'wood' },
    { pattern: 'compound', value: 'weald' },
    { pattern: 'compound', value: 'holt' },
    // "Forest of X" patterns
    { pattern: 'prefix', value: 'Forest of ' },
    { pattern: 'prefix', value: 'Woods of ' },
    // Misc forest
    { pattern: 'suffix', value: ' Thicket' },
    { pattern: 'suffix', value: ' Copse' },
    { pattern: 'compound', value: 'shade' }
  ],
  grassland: [
    { pattern: 'suffix', value: ' Meadow' },
    { pattern: 'suffix', value: ' Fields' },
    { pattern: 'suffix', value: ' Green' },
    { pattern: 'suffix', value: ' Lea' },
    { pattern: 'compound', value: 'vale' },
    { pattern: 'compound', value: 'dale' },
    { pattern: 'compound', value: 'field' },
    { pattern: 'prefix', value: 'Meadows of ' },
    { pattern: 'suffix', value: ' Pastures' },
    { pattern: 'suffix', value: ' Glades' }
  ],
  plains: [
    { pattern: 'suffix', value: ' Plains' },
    { pattern: 'suffix', value: ' Steppes' },
    { pattern: 'suffix', value: ' Flats' },
    { pattern: 'suffix', value: ' Expanse' },
    { pattern: 'compound', value: 'reach' },
    { pattern: 'compound', value: 'march' },
    { pattern: 'compound', value: 'moor' },
    { pattern: 'prefix', value: 'Plains of ' },
    { pattern: 'suffix', value: ' Prairie' },
    { pattern: 'suffix', value: ' Barrens' }
  ],
  hills: [
    { pattern: 'suffix', value: ' Hills' },
    { pattern: 'suffix', value: ' Highlands' },
    { pattern: 'suffix', value: ' Downs' },
    { pattern: 'suffix', value: ' Ridge' },
    { pattern: 'compound', value: 'fell' },
    { pattern: 'compound', value: 'tor' },
    { pattern: 'compound', value: 'crest' },
    { pattern: 'prefix', value: 'Hills of ' },
    { pattern: 'suffix', value: ' Heights' },
    { pattern: 'suffix', value: ' Knolls' }
  ],
  swamp: [
    { pattern: 'suffix', value: ' Marsh' },
    { pattern: 'suffix', value: ' Swamp' },
    { pattern: 'suffix', value: ' Bog' },
    { pattern: 'suffix', value: ' Fen' },
    { pattern: 'compound', value: 'mire' },
    { pattern: 'compound', value: 'mere' },
    { pattern: 'compound', value: 'slough' },
    { pattern: 'prefix', value: 'Marshes of ' },
    { pattern: 'suffix', value: ' Wetlands' },
    { pattern: 'suffix', value: ' Morass' }
  ],
  mountain: [
    { pattern: 'suffix', value: ' Mountains' },
    { pattern: 'suffix', value: ' Peaks' },
    { pattern: 'suffix', value: ' Range' },
    { pattern: 'suffix', value: ' Spires' },
    { pattern: 'compound', value: 'mount' },
    { pattern: 'compound', value: 'peak' },
    { pattern: 'compound', value: 'crag' },
    { pattern: 'prefix', value: 'Mountains of ' }
  ],
  desert: [
    { pattern: 'suffix', value: ' Desert' },
    { pattern: 'suffix', value: ' Wastes' },
    { pattern: 'suffix', value: ' Sands' },
    { pattern: 'suffix', value: ' Dunes' },
    { pattern: 'compound', value: 'waste' },
    { pattern: 'prefix', value: 'Desert of ' },
    { pattern: 'suffix', value: ' Barrens' }
  ]
};

// Directional prefixes for related provinces
const directions = {
  north: 'Northern ',
  south: 'Southern ',
  east: 'Eastern ',
  west: 'Western ',
  upper: 'Upper ',
  lower: 'Lower ',
  inner: 'Inner ',
  outer: 'Outer ',
  greater: 'Greater ',
  lesser: 'Lesser '
};

/**
 * Generate a province name for a given biome
 */
function generateName(biome, usedNames = new Set()) {
  const normalizedBiome = biome.toLowerCase();
  const roots = biomeRoots[normalizedBiome] || biomeRoots.plains;
  const suffixes = biomeSuffixes[normalizedBiome] || biomeSuffixes.plains;
  
  let attempts = 0;
  while (attempts < 100) {
    const root = roots[Math.floor(Math.random() * roots.length)];
    const suffixObj = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    let name;
    switch (suffixObj.pattern) {
      case 'prefix':
        name = suffixObj.value + root;
        break;
      case 'suffix':
        name = root + suffixObj.value;
        break;
      case 'compound':
        name = root + suffixObj.value;
        // Capitalize first letter
        name = name.charAt(0).toUpperCase() + name.slice(1);
        break;
    }
    
    if (!usedNames.has(name)) {
      return name;
    }
    attempts++;
  }
  
  // Fallback: add number
  return `${roots[0]} Region ${usedNames.size + 1}`;
}

/**
 * Get directional prefix based on relative position
 */
function getDirectionalPrefix(province, otherProvinces) {
  if (otherProvinces.length === 0) return '';
  
  // Calculate average center of other provinces
  const avgQ = otherProvinces.reduce((sum, p) => sum + p.centerHex.q, 0) / otherProvinces.length;
  const avgR = otherProvinces.reduce((sum, p) => sum + p.centerHex.r, 0) / otherProvinces.length;
  
  const dq = province.centerHex.q - avgQ;
  const dr = province.centerHex.r - avgR;
  
  // Determine primary direction
  // In hex coordinates: +q is generally east, +r is generally south
  if (Math.abs(dq) > Math.abs(dr)) {
    return dq > 0 ? directions.east : directions.west;
  } else {
    return dr > 0 ? directions.south : directions.north;
  }
}

/**
 * Calculate hex distance between two provinces
 */
function hexDistance(p1, p2) {
  const dq = Math.abs(p1.centerHex.q - p2.centerHex.q);
  const dr = Math.abs(p1.centerHex.r - p2.centerHex.r);
  return Math.max(dq, dr, Math.abs(dq - dr));
}

module.exports = {
  generateName,
  getDirectionalPrefix,
  hexDistance,
  biomeRoots,
  biomeSuffixes,
  directions
};
