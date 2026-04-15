const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const STATE_PATH = path.join(__dirname, 'state.json');

async function extractPosts(page) {
  // Wait for content to load
  await page.waitForTimeout(3000);

  // Extract post data from the page
  const posts = await page.evaluate(() => {
    const results = [];
    
    // Facebook renders posts in various containers. We look for text content
    // that appears after the profile header section.
    const body = document.body.innerText;
    
    // Split by common post patterns - posts typically show relative timestamps
    // like "3d", "1h", "Just now", "Yesterday", etc.
    const timePatterns = /\n(\d+[dhms]|\d+ (?:hours?|minutes?|days?|weeks?|months?|years?) ago|Just now|Yesterday)\n\s*·\s*\n/g;
    
    let matches = [];
    let match;
    while ((match = timePatterns.exec(body)) !== null) {
      matches.push({ index: match.index, time: match[1].trim() });
    }
    
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i].time.length;
      const end = matches[i + 1] ? matches[i + 1].index : start + 500;
      const content = body.substring(start, end).trim();
      
      // Clean up and take first meaningful chunk
      const lines = content.split('\n').filter(l => l.trim()).slice(0, 5);
      const text = lines.join(' ').substring(0, 300);
      
      if (text.length > 10) {
        results.push({
          time: matches[i].time,
          text: text
        });
      }
    }
    
    return results;
  });

  return posts;
}

async function checkProfile(browser, profile) {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    await page.goto(profile.url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Also grab raw text for fingerprinting
    const rawText = await page.evaluate(() => document.body.innerText);
    const posts = await extractPosts(page);

    return { posts, rawText };
  } finally {
    await context.close();
  }
}

function generateFingerprint(posts) {
  // Create a fingerprint from the first few posts' text content
  return posts.map(p => p.text.substring(0, 100)).join('|||');
}

async function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const profile of config.profiles) {
      const key = profile.url;
      const { posts, rawText } = await checkProfile(browser, profile);
      const fingerprint = generateFingerprint(posts);
      const previousFingerprint = state.profiles[key]?.fingerprint;

      if (!previousFingerprint) {
        // First run — store baseline
        console.log(JSON.stringify({
          type: 'baseline',
          profile: profile.name,
          url: profile.url,
          postCount: posts.length,
          posts: posts
        }));
      } else if (fingerprint !== previousFingerprint) {
        // Something changed — figure out what's new
        const previousTexts = state.profiles[key]?.posts?.map(p => p.text.substring(0, 100)) || [];
        const newPosts = posts.filter(p => !previousTexts.includes(p.text.substring(0, 100)));

        if (newPosts.length > 0) {
          console.log(JSON.stringify({
            type: 'new_posts',
            profile: profile.name,
            url: profile.url,
            newPosts: newPosts
          }));
          results.push({ profile: profile.name, url: profile.url, newPosts });
        } else {
          console.log(JSON.stringify({
            type: 'changed',
            profile: profile.name,
            message: 'Posts changed but no clearly new posts detected'
          }));
        }
      } else {
        console.log(JSON.stringify({
          type: 'no_change',
          profile: profile.name
        }));
      }

      // Update state
      state.profiles[key] = {
        fingerprint,
        posts,
        lastChecked: new Date().toISOString()
      };
    }

    // Append to run log
    if (!state.runLog) state.runLog = [];
    const runEntry = {
      time: new Date().toISOString(),
      hasNewPosts: results.length > 0,
      newPosts: results.length > 0 ? results : undefined
    };
    state.runLog.push(runEntry);

    // Keep only last 24 entries (24 hours of hourly runs)
    if (state.runLog.length > 24) {
      state.runLog = state.runLog.slice(-24);
    }

    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } finally {
    await browser.close();
  }

  // Output for the cron agent
  if (results.length > 0) {
    // NEW POSTS — immediate alert
    console.log('\n---ALERT---');
    for (const r of results) {
      console.log(`NEW POSTS detected:`);
      for (const p of r.newPosts) {
        console.log(`  [${p.time}] ${p.text}`);
      }
    }
  } else {
    // No new posts — output run log summary for periodic digest
    const log = state.runLog || [];
    console.log('\n---NO_CHANGE---');
    console.log(`Run log (${log.length} entries):`);
    for (const entry of log) {
      const status = entry.hasNewPosts ? 'NEW POSTS' : 'no update';
      console.log(`  ${entry.time} — ${status}`);
    }
  }
}

main().catch(err => {
  console.error('Monitor error:', err.message);
  process.exit(1);
});
