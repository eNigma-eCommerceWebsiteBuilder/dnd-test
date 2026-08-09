import { runPuckAstParser } from './ast-parser-engine';
import * as path from 'path';

const inputPath = process.argv[2] || './app/page.tsx';
const outputPath = process.argv[3] || './puck-homepage-default.json';
const sourceRoot = path.resolve(process.env.TEMPLATE_FRONTEND_ROOT || process.cwd());
const puckRoot = path.resolve(process.env.PUCK_PROJECT_ROOT || sourceRoot);
const reportPath = process.env.PUCK_REPORT_PATH;

console.log(`Reading: ${inputPath}`);
process.exitCode = runPuckAstParser({
  inputPath,
  outputPath,
  reportPath,
  projectRoot: sourceRoot,
  puckRoot,
});
