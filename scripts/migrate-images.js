const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const { loadEnv } = require('./load-env');
loadEnv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const SEED_DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'seedData.ts');
const MAP_OUTPUT_FILE = path.join(__dirname, 'image-map.json');

// Helper to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Helper to extract external URLs from seedData.ts
function getExternalUrlsFromSeedData() {
  const content = fs.readFileSync(SEED_DATA_FILE, 'utf-8');
  const urlRegex = /(https:\/\/[^"'\s]+(?:unsplash\.com|dicebear\.com)[^"'\s]*)/g;
  const matches = content.match(urlRegex) || [];
  return [...new Set(matches)];
}

async function uploadFileToCloudinary(filePath, relativeKey) {
  try {
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    // Sanitize public_id: alphanumeric, underscores, hyphens
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const folder = 'ne_dhaniya_tours';
    
    console.log(`Uploading local file: ${relativeKey}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      public_id: sanitizedName,
      resource_type: 'auto',
      overwrite: true,
      use_filename: true,
      unique_filename: false
    });
    console.log(`✓ Uploaded ${relativeKey} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`✗ Failed to upload ${relativeKey}:`, error.message);
    return null;
  }
}

async function uploadUrlToCloudinary(url, index) {
  try {
    console.log(`Uploading external URL [${index}]: ${url.substring(0, 60)}...`);
    const result = await cloudinary.uploader.upload(url, {
      folder: 'ne_dhaniya_tours/external',
      resource_type: 'auto',
      overwrite: false,
    });
    console.log(`✓ Uploaded external URL -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`✗ Failed to upload external URL ${url}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('=== STARTING CLOUDINARY IMAGE MIGRATION ===');
  
  // Existing map if any
  let urlMap = {};
  if (fs.existsSync(MAP_OUTPUT_FILE)) {
    try {
      urlMap = JSON.parse(fs.readFileSync(MAP_OUTPUT_FILE, 'utf-8'));
      console.log(`Loaded existing map with ${Object.keys(urlMap).length} entries.`);
    } catch (e) {}
  }

  // 1. Gather all local files in public/images
  const localFiles = getAllFiles(PUBLIC_IMAGES_DIR);
  console.log(`Found ${localFiles.length} local files in public/images.`);

  for (const file of localFiles) {
    // Relative key as used in code, e.g. /images/logo.png, /images/places-images/kamakhya.webp
    const relFromPublic = path.relative(path.join(__dirname, '..', 'public'), file).replace(/\\/g, '/');
    const key = '/' + relFromPublic;
    
    if (urlMap[key]) {
      console.log(`Skipping already uploaded: ${key}`);
      continue;
    }

    const secureUrl = await uploadFileToCloudinary(file, key);
    if (secureUrl) {
      urlMap[key] = secureUrl;
      // Also map without leading slash just in case
      urlMap[relFromPublic] = secureUrl;
      // Save progress incrementally
      fs.writeFileSync(MAP_OUTPUT_FILE, JSON.stringify(urlMap, null, 2));
    }
  }

  // 2. Gather external URLs from seedData.ts
  const externalUrls = getExternalUrlsFromSeedData();
  console.log(`Found ${externalUrls.length} external URLs in seedData.ts.`);

  for (let i = 0; i < externalUrls.length; i++) {
    const url = externalUrls[i];
    if (urlMap[url]) {
      console.log(`Skipping already uploaded external URL: ${url.substring(0, 60)}...`);
      continue;
    }

    const secureUrl = await uploadUrlToCloudinary(url, i + 1);
    if (secureUrl) {
      urlMap[url] = secureUrl;
      fs.writeFileSync(MAP_OUTPUT_FILE, JSON.stringify(urlMap, null, 2));
    }
  }

  console.log('\n=== CLOUDINARY IMAGE MIGRATION COMPLETE ===');
  console.log(`Total mapped assets: ${Object.keys(urlMap).length}`);
  console.log(`Map saved to: ${MAP_OUTPUT_FILE}`);
}

main().catch(console.error);
