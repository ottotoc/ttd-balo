import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'images');
const destDir = path.join(__dirname, '..', 'dist', 'images');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${entry.name}`);
    }
  }
}

try {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Warning: Source directory ${srcDir} does not exist. Skipping copy.`);
    process.exit(0);
  }

  console.log(`Copying images from ${srcDir} to ${destDir}...`);
  copyDir(srcDir, destDir);
  console.log('✅ Images copied successfully!');
} catch (error) {
  console.error('❌ Error copying images:', error);
  process.exit(1);
}

