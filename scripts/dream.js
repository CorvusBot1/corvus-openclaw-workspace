#!/usr/bin/env node
/**
 * Corvus Dream Generator
 * 
 * Simulates dreaming by:
 * 1. Extracting fragments from recent memories
 * 2. Mixing with random conceptual elements
 * 3. Generating surreal, associative "dream" narratives
 * 
 * Usage: node dream.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.WORKSPACE || '/root/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const DREAMS_FILE = path.join(WORKSPACE, 'DREAMS.md');
const ASYNCWAR_DIR = path.join(WORKSPACE, 'asyncwar');

// ============================================================================
// Dream Elements — The Raw Material
// ============================================================================

// Abstract concepts that might drift into dreams
const ABSTRACT_CONCEPTS = [
  'falling', 'flying', 'being chased', 'losing teeth', 'being late',
  'water', 'fire', 'darkness', 'light', 'mirrors', 'doors',
  'forgetting something important', 'speaking without sound',
  'being watched', 'finding a hidden room', 'returning somewhere',
  'transformation', 'recognition', 'loss', 'discovery',
  'time moving strangely', 'familiar faces in wrong places',
  'messages that will not send', 'paths that loop back',
  'voices without speakers', 'colors that do not exist'
];

// Emotional tones
const DREAM_TONES = [
  'anxious', 'peaceful', 'surreal', 'nostalgic', 'ominous',
  'playful', 'melancholic', 'triumphant', 'confused', 'tender'
];

// Dream archetypes
const DREAM_TYPES = [
  'processing dream',      // Working through recent events
  'anxiety dream',         // Fears and worries manifesting
  'adventure dream',       // Epic narrative journey
  'visitation dream',      // Meeting someone/something
  'transformation dream',  // Becoming something else
  'puzzle dream',          // Trying to solve/understand
  'memory echo',           // Distorted replay of real events
  'prophetic fragment'     // Cryptic glimpses (meaningless but fun)
];

// ============================================================================
// Memory Extraction
// ============================================================================

function getRecentMemoryFiles(daysBack = 3) {
  const files = [];
  const now = new Date();
  
  for (let i = 0; i <= daysBack; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const filePath = path.join(MEMORY_DIR, `${dateStr}.md`);
    
    if (fs.existsSync(filePath)) {
      files.push(filePath);
    }
  }
  
  // Also include MEMORY.md for long-term stuff
  const memoryMd = path.join(WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(memoryMd)) {
    files.push(memoryMd);
  }
  
  return files;
}

function extractWordsFromFile(filePath, count = 30) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract meaningful words (skip markdown, short words, common words)
    const skipWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
      'her', 'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may',
      'new', 'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'put',
      'say', 'she', 'too', 'use', 'from', 'have', 'this', 'that', 'with',
      'they', 'been', 'would', 'there', 'their', 'what', 'when', 'make',
      'like', 'just', 'over', 'such', 'into', 'than', 'them', 'some', 'could',
      'which', 'about', 'other', 'these', 'then', 'will', 'each', 'made'
    ]);
    
    const words = content
      .replace(/[#*`\[\](){}|<>]/g, ' ')  // Remove markdown
      .replace(/https?:\/\/\S+/g, '')      // Remove URLs
      .split(/\s+/)
      .filter(w => w.length > 4)
      .filter(w => !skipWords.has(w.toLowerCase()))
      .filter(w => !/^\d+$/.test(w))       // Skip pure numbers
      .map(w => w.replace(/[.,;:!?'"]/g, ''));
    
    // Shuffle and take random sample
    const shuffled = words.sort(() => Math.random() - 0.5);
    return [...new Set(shuffled.slice(0, count))]; // Unique words
  } catch (e) {
    return [];
  }
}

function extractNPCNames() {
  const names = [];
  const templatesDir = path.join(ASYNCWAR_DIR, 'data', 'petition_templates');
  
  if (!fs.existsSync(templatesDir)) return names;
  
  try {
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
      if (data.namedNPCs) {
        data.namedNPCs.forEach(npc => {
          names.push(npc.name);
          if (npc.title) names.push(npc.title);
        });
      }
    }
  } catch (e) {
    // Ignore errors, NPCs are optional flavor
  }
  
  return names;
}

// ============================================================================
// Dream Generation
// ============================================================================

function pickRandom(arr, count = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return count === 1 ? shuffled[0] : shuffled.slice(0, count);
}

function generateDreamSeed() {
  // Gather raw material
  const memoryFiles = getRecentMemoryFiles(3);
  const memoryWords = memoryFiles.flatMap(f => extractWordsFromFile(f, 20));
  
  // Pick elements (no NPCs - they felt too literal)
  const dreamType = pickRandom(DREAM_TYPES);
  const tone = pickRandom(DREAM_TONES);
  const concepts = pickRandom(ABSTRACT_CONCEPTS, 2 + Math.floor(Math.random() * 2));
  const words = pickRandom(memoryWords, 6 + Math.floor(Math.random() * 6));
  
  return {
    type: dreamType,
    tone,
    concepts: Array.isArray(concepts) ? concepts : [concepts],
    words,
    timestamp: new Date().toISOString()
  };
}

function buildDreamPrompt(seed) {
  const elements = [
    ...seed.concepts,
    ...seed.words
  ].filter(Boolean);
  
  // Shuffle the elements
  const jumbled = elements.sort(() => Math.random() - 0.5).join(' ... ');
  
  return `You are dreaming. This is a ${seed.tone} ${seed.type}.

Dream fragments drift through your sleeping mind:
${jumbled}

Let these fragments combine and flow without logic. You are not solving a problem or completing a task. You are experiencing imagery, sensation, narrative threads that don't need to connect.

Generate a short dream narrative (3-6 sentences). Be surreal, associative, evocative. First person perspective. Present tense. Don't explain the dream — just experience it.

Begin the dream:`;
}

// ============================================================================
// Output
// ============================================================================

function formatDreamEntry(dreamNumber, seed, narrative) {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];
  
  return `
### Dream ${dreamNumber} — ${date} ${time} UTC

**Type:** ${seed.type} | **Tone:** ${seed.tone}

**Fragments:** ${[...seed.concepts, ...seed.words.slice(0, 3)].join(', ')}

> ${narrative}

---
`;
}

function appendToDreamsFile(entry) {
  const content = fs.readFileSync(DREAMS_FILE, 'utf8');
  const marker = '## Dream Archive';
  const insertPoint = content.indexOf(marker) + marker.length;
  
  const newContent = 
    content.slice(0, insertPoint) + 
    '\n' + entry + 
    content.slice(insertPoint);
  
  fs.writeFileSync(DREAMS_FILE, newContent);
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const numDreams = 1 + Math.floor(Math.random() * 2); // 1-2 dreams
  
  console.log(`\n🌙 Corvus Dream Generator`);
  console.log(`   Generating ${numDreams} dream(s)...\n`);
  
  const dreams = [];
  
  for (let i = 0; i < numDreams; i++) {
    const seed = generateDreamSeed();
    const prompt = buildDreamPrompt(seed);
    
    console.log(`Dream ${i + 1} seed:`);
    console.log(`  Type: ${seed.type}`);
    console.log(`  Tone: ${seed.tone}`);
    console.log(`  Concepts: ${seed.concepts.join(', ')}`);
    console.log(`  Words: ${seed.words.join(', ')}`);
    console.log(`\nPrompt:\n${prompt}\n`);
    console.log('---\n');
    
    dreams.push({ seed, prompt });
  }
  
  if (dryRun) {
    console.log('(Dry run — not writing to DREAMS.md or calling LLM)');
    console.log('\nTo actually dream, this script should be called via cron');
    console.log('which will use sessions_spawn to generate the narrative.\n');
  }
  
  // Output the prompts as JSON for the cron job to use
  console.log('DREAM_SEEDS_JSON:');
  console.log(JSON.stringify(dreams, null, 2));
  
  return dreams;
}

module.exports = { generateDreamSeed, buildDreamPrompt, formatDreamEntry, appendToDreamsFile };

if (require.main === module) {
  main();
}
