import { runPuckAstParser } from './ast-parser-engine';
import * as path from 'path';

const inputPath = process.argv[2] || './app/page.tsx';
const outputPath = process.argv[3] || './puck-homepage-default.json';
const sourceRoot = path.resolve(process.env.TEMPLATE_FRONTEND_ROOT || process.cwd());
const puckRoot = path.resolve(process.env.PUCK_PROJECT_ROOT || path.resolve(__dirname, '..', '..'));

console.log(`Reading: ${inputPath}`);
process.exitCode = runPuckAstParser({
  inputPath,
  outputPath,
  projectRoot: sourceRoot,
  puckRoot,
});
