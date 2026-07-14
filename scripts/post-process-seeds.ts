import * as fs from 'fs';
import * as path from 'path';

const seedDir = path.resolve('./data/seeds');
const componentsDir = path.resolve('./components');

// Map: puckComponentName → { defaults, seedData }
const componentDataMap: Record<string, { defaults?: Record<string, unknown>; seedData?: Record<string, unknown> }> = {};

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (!content.includes('puckComponentName')) continue;

        const mod = require(fullPath);
        if (mod.puckComponentName) {
          componentDataMap[mod.puckComponentName] = {
            defaults: mod.puckDefaults,
            seedData: mod.puckSeedData,
          };
        }
      } catch {
        // Skip files that can't be required
      }
    }
  }
}

walkDir(componentsDir);
console.log(`Loaded data for ${Object.keys(componentDataMap).length} components: ${Object.keys(componentDataMap).join(', ')}`);

const seedFiles = fs.readdirSync(seedDir).filter(f => f.endsWith('.json'));
let totalMerged = 0;

for (const file of seedFiles) {
  const filePath = path.join(seedDir, file);
  const seed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let mergeCount = 0;
  let removedCount = 0;
  const originalLength = (seed.content || []).length;

  // Filter: keep only sections whose type matches a known puckComponentName
  // This removes out-of-scope components (filters, toggles, skeletons, etc.)
  // that the AST parser correctly found but have no Puck config
  seed.content = (seed.content || []).filter((section: { type: string; props: Record<string, unknown> }) => {
    const compData = componentDataMap[section.type];
    if (!compData) {
      removedCount++;
      return false;
    }

    // Merge puckSeedData (non-editable placeholder props, highest priority)
    if (compData.seedData) {
      for (const [key, value] of Object.entries(compData.seedData)) {
        if (!(key in section.props)) {
          section.props[key] = value;
          mergeCount++;
        }
      }
    }

    // Merge puckDefaults (editable props with sensible defaults)
    if (compData.defaults) {
      for (const [key, value] of Object.entries(compData.defaults)) {
        if (!(key in section.props)) {
          section.props[key] = value;
          mergeCount++;
        }
      }
    }

    return true;
  });

  const changed = mergeCount > 0 || removedCount > 0;
  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
    totalMerged += mergeCount;
    const parts: string[] = [];
    if (mergeCount > 0) parts.push(`merged ${mergeCount} props`);
    if (removedCount > 0) parts.push(`removed ${removedCount}/${originalLength} out-of-scope sections`);
    console.log(`  ${file}: ${parts.join(', ')}`);
  } else {
    console.log(`  ${file}: no changes`);
  }
}

console.log(`Done. Total props merged: ${totalMerged}`);
