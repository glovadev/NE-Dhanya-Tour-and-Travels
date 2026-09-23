const fs = require('fs');
const path = require('path');

const SEED_FILE = path.join(__dirname, '..', 'src', 'data', 'seedData.ts');
const MAP_FILE = path.join(__dirname, 'image-map.json');

function updateSeedData() {
  if (!fs.existsSync(MAP_FILE)) {
    console.error("image-map.json not found!");
    process.exit(1);
  }

  const map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
  let content = fs.readFileSync(SEED_FILE, 'utf-8');

  console.log(`Loaded ${Object.keys(map).length} mapping entries.`);
  let replaceCount = 0;

  // Sort keys by length descending so longer paths match first
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const cloudUrl = map[key];
    if (!cloudUrl || key === cloudUrl) continue;

    // Search for quoted occurrences: "key" or 'key'
    const doubleQuoted = `"${key}"`;
    const singleQuoted = `'${key}'`;

    if (content.includes(doubleQuoted)) {
      content = content.split(doubleQuoted).join(`"${cloudUrl}"`);
      replaceCount++;
    }
    if (content.includes(singleQuoted)) {
      content = content.split(singleQuoted).join(`"${cloudUrl}"`);
      replaceCount++;
    }
  }

  fs.writeFileSync(SEED_FILE, content, 'utf-8');
  console.log(`Updated seedData.ts with ${replaceCount} Cloudinary replacements!`);
}

updateSeedData();
