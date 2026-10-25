/**
 * build-html.js - Statically builds index.html from modular components with recursive include support
 * Usage: node scripts/build-html.js
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const COMPONENTS_DIR = path.join(PUBLIC_DIR, 'components');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'index.template.html');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'index.html');
const STANDALONE_FILE = path.join(PUBLIC_DIR, 'index.standalone.html');

function resolveIncludes(content, baseDir, depth = 0) {
  if (depth > 10) {
    console.error('⚠️ Maximum include depth exceeded.');
    return content;
  }

  const includeRegex = /<!--\s*INCLUDE:\s*([a-zA-Z0-9_\-\.\/]+)\s*-->/g;
  return content.replace(includeRegex, (match, filePath) => {
    const fullPath = path.resolve(baseDir, filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`${'  '.repeat(depth + 1)}✓ Injected ${filePath}`);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      return resolveIncludes(fileContent, COMPONENTS_DIR, depth + 1);
    } else {
      console.warn(`  ⚠️ Warning: Component not found: ${fullPath}`);
      return match;
    }
  });
}

function buildHtml() {
  console.log('🚀 Building index.html from modular components...');

  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error('Template file not found:', TEMPLATE_FILE);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
  const compiled = resolveIncludes(template, COMPONENTS_DIR);

  fs.writeFileSync(OUTPUT_FILE, compiled, 'utf8');
  fs.writeFileSync(STANDALONE_FILE, compiled, 'utf8');
  console.log(`✓ Compiled ${OUTPUT_FILE} (${compiled.length} bytes)`);
  console.log(`✓ Saved backup ${STANDALONE_FILE}`);
}

buildHtml();
