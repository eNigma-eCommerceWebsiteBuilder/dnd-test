import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const parserRoot = path.resolve('scripts', 'templatefrontend-parser');
const parserFiles = readdirSync(parserRoot, { recursive: true })
  .filter((entry): entry is string => typeof entry === 'string' && entry.endsWith('.ts'));
const forbiddenReferences = [
  'enigma-components',
  'data/seeds',
  'lib/puck-components',
  'dnd-test/components',
  'dnd-test/app',
];

const violations: string[] = [];
for (const relativePath of parserFiles) {
  const filePath = path.join(parserRoot, relativePath);
  const source = readFileSync(filePath, 'utf8').replaceAll('\\', '/');
  for (const forbiddenReference of forbiddenReferences) {
    if (source.includes(forbiddenReference)) {
      violations.push(`${path.join('scripts/templatefrontend-parser', relativePath)} references ${forbiddenReference}`);
    }
  }
}

const launcher = readFileSync(path.resolve('scripts', 'run-parser-to-dnd-test.ps1'), 'utf8').replaceAll('\\', '/');
for (const requiredReference of ['puck/generated/site-manifest.json', 'data/puck/seeds', 'data/puck/reports']) {
  if (!launcher.includes(requiredReference)) {
    violations.push(`scripts/run-parser-to-dnd-test.ps1 must reference target ${requiredReference}`);
  }
}

if (violations.length > 0) {
  throw new Error(`Parser boundary violations:\n- ${violations.join('\n- ')}`);
}

console.log(`Parser boundary is clean across ${parserFiles.length} parser source files.`);
