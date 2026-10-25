/**
 * watch-html.js - Auto-compiles public/index.html whenever any component is edited
 * Usage: node scripts/watch-html.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPONENTS_DIR = path.resolve(__dirname, '../public/components');
const TEMPLATE_FILE = path.resolve(__dirname, '../index.template.html');
const BUILD_SCRIPT = path.resolve(__dirname, 'build-html.js');

function runBuild() {
  try {
    execSync(`node "${BUILD_SCRIPT}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Build error:', err);
  }
}

console.log('👀 Watching public/components/ (recursive) and index.template.html for changes...');
runBuild();

let debounceTimer = null;
function onChange(eventType, filename) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`[Change detected: ${filename || 'file'}] Recompiling index.html...`);
    runBuild();
  }, 100);
}

if (fs.existsSync(COMPONENTS_DIR)) {
  fs.watch(COMPONENTS_DIR, { recursive: true }, onChange);
}

if (fs.existsSync(TEMPLATE_FILE)) {
  fs.watch(TEMPLATE_FILE, onChange);
}
