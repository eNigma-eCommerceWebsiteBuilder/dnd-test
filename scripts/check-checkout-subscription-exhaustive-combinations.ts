import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { runPuckAstParser, type ComponentData } from '../../eNigma-TemplateFrontend/ast-parser-engine';
import { getRouteProfile } from '../../eNigma-TemplateFrontend/ast-parser-route-profiles';

interface ManifestComponent {
  type: string;
  parserEligible?: boolean;
  ast?: {
    slots?: string[];
    sourceJsxNames?: string[];
    sourceImportPaths?: string[];
  };
}

interface SeedNode {
  type: string;
  props: Record<string, unknown>;
}

const route = 'checkout-subscription';
const dndRoot = path.resolve(__dirname, '..');
const templateRoot = path.resolve(dndRoot, '..', 'eNigma-TemplateFrontend');
const manifestPath = path.join(dndRoot, 'lib', 'puck-ast-manifest.json');
const reportPath = path.join(
  dndRoot,
  'data',
  'parser-fixtures',
  'checkout-subscription-exhaustive-page-combinations.json',
);
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'enigma-checkout-subscription-exhaustive-'));

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
  components: ManifestComponent[];
};
const manifestByType = new Map(manifest.components.map((component) => [component.type, component]));

// These are the two source-owned, reorderable page regions in SubscriptionCheckoutClient.
const leftColumnTypes = [
  'SubscriptionCustomerInfoSection',
  'SubscriptionShippingAddressSection',
  'SubscriptionBillingTermsSection',
  'SubscriptionCheckoutErrorCondition',
];
const rightColumnTypes = [
  'SubscriptionCartSummaryPanel',
  'SubscriptionPricingPreviewPanel',
  'SubscriptionSummaryPanel',
  'SubscriptionCheckoutActions',
];

const leftVariants = orderedSubsets(leftColumnTypes);
const rightVariants = orderedSubsets(rightColumnTypes);
const expectedCases = leftVariants.length * rightVariants.length;

try {
  let passed = 0;

  for (const [leftIndex, leftColumn] of leftVariants.entries()) {
    for (const [rightIndex, rightColumn] of rightVariants.entries()) {
      const fixtureId = `left-${leftIndex}-right-${rightIndex}`;
      const caseDirectory = path.join(temporaryRoot, fixtureId);
      const root = createPageTree(leftColumn, rightColumn);
      const inputPath = path.join(caseDirectory, 'fixture.tsx');
      const outputPath = path.join(caseDirectory, `${route}.json`);

      fs.mkdirSync(caseDirectory, { recursive: true });
      fs.writeFileSync(inputPath, renderFixtureSource(root), 'utf8');

      const exitCode = runPuckAstParser({
        inputPath,
        outputPath,
        projectRoot: templateRoot,
        quiet: true,
      });

      if (exitCode !== 0 || !fs.existsSync(outputPath)) {
        const diagnosticsPath = path.join(caseDirectory, '_reports', `${route}.report.json`);
        const diagnostics = fs.existsSync(diagnosticsPath)
          ? fs.readFileSync(diagnosticsPath, 'utf8')
          : 'missing parser diagnostics';
        throw new Error(`${fixtureId}: parser rejected a valid full-page combination.\n${diagnostics}`);
      }

      const output = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as { content: ComponentData[] };
      if (JSON.stringify(topology(output.content as SeedNode[])) !== JSON.stringify(topology([root]))) {
        throw new Error(`${fixtureId}: parsed topology differs from the full-page source tree.`);
      }

      passed++;
      if (passed % 500 === 0) console.log(`Verified ${passed} / ${expectedCases} full-page combinations.`);
    }
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    route,
    fixedHierarchy: [
      'SubscriptionCheckoutPageState',
      'SubscriptionCheckoutPageLayout',
      'SubscriptionCheckoutClientLayout',
      'SubscriptionCheckoutHeader',
      'SubscriptionCheckoutSteps',
    ],
    variations: {
      leftColumn: {
        components: leftColumnTypes,
        orderedDistinctSubsets: leftVariants.length,
      },
      rightColumn: {
        components: rightColumnTypes,
        orderedDistinctSubsets: rightVariants.length,
      },
    },
    totalCombinations: expectedCases,
    passed,
  }, null, 2), 'utf8');

  console.log(`Checkout-subscription exhaustive full-page combinations passed: ${passed} / ${expectedCases}.`);
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

function createPageTree(leftColumn: string[], rightColumn: string[]): SeedNode {
  return node('SubscriptionCheckoutPageState', {
    content: [node('SubscriptionCheckoutPageLayout', {
      content: [node('SubscriptionCheckoutClientLayout', {
        header: [node('SubscriptionCheckoutHeader')],
        steps: [node('SubscriptionCheckoutSteps')],
        leftColumn: leftColumn.map((type) => node(type)),
        rightColumn: rightColumn.map((type) => node(type)),
      })],
    })],
  });
}

function node(type: string, props: Record<string, SeedNode[]> = {}): SeedNode {
  const allSlots = declaredSlots(type);
  return {
    type,
    props: Object.fromEntries(allSlots.map((slot) => [slot, props[slot] || []])),
  };
}

function renderFixtureSource(root: SeedNode): string {
  const aliases = new Map<string, string>();
  const profile = getRouteProfile(route);
  const delegatePaths = new Set((profile?.delegates || []).map((delegate) => delegate.sourceImportPath));
  const imports = [...collectTypes([root])].sort().map((type, index) => {
    const component = requiredComponent(type);
    const sourceName = chooseSourceName(component);
    const importPath = component.ast!.sourceImportPaths!.find((candidate) => !delegatePaths.has(candidate))
      || component.ast!.sourceImportPaths![0];
    const alias = `FixtureComponent${index}`;
    aliases.set(type, alias);
    return `import { ${sourceName} as ${alias} } from ${JSON.stringify(importPath)};`;
  });

  return `${imports.join('\n')}\nexport default function ParserFixture() { return (${renderNode(root, aliases)}); }\n`;
}

function renderNode(current: SeedNode, aliases: Map<string, string>): string {
  const alias = aliases.get(current.type);
  if (!alias) throw new Error(`No fixture alias exists for ${current.type}.`);
  const attributes = declaredSlots(current.type).map((slot) => {
    const children = componentChildren(current.props[slot]);
    return `${slot}={<>${children.map((child) => renderNode(child, aliases)).join('')}</>}`;
  });
  return `<${alias}${attributes.length ? ` ${attributes.join(' ')}` : ''} />`;
}

function orderedSubsets(types: string[]): string[][] {
  const variants: string[][] = [[]];
  for (let length = 1; length <= types.length; length++) {
    appendPermutations(types, length, [], variants);
  }
  return variants;
}

function appendPermutations(types: string[], length: number, current: string[], output: string[][]) {
  if (current.length === length) {
    output.push(current);
    return;
  }
  for (const type of types) {
    if (current.includes(type)) continue;
    appendPermutations(types, length, [...current, type], output);
  }
}

function topology(nodes: SeedNode[]): unknown[] {
  return nodes.map((current) => ({
    type: current.type,
    slots: Object.fromEntries(declaredSlots(current.type).map((slot) => [
      slot,
      topology(componentChildren(current.props[slot])),
    ])),
  }));
}

function collectTypes(nodes: SeedNode[]): Set<string> {
  const types = new Set<string>();
  for (const current of nodes) {
    types.add(current.type);
    for (const slot of declaredSlots(current.type)) {
      for (const type of collectTypes(componentChildren(current.props[slot]))) types.add(type);
    }
  }
  return types;
}

function componentChildren(value: unknown): SeedNode[] {
  return Array.isArray(value)
    ? value.filter((item): item is SeedNode => Boolean(item && typeof item === 'object' && typeof item.type === 'string'))
    : [];
}

function declaredSlots(type: string): string[] {
  return requiredComponent(type).ast?.slots || [];
}

function requiredComponent(type: string): ManifestComponent {
  const component = manifestByType.get(type);
  if (!component?.parserEligible) throw new Error(`${type} is not parser-eligible.`);
  return component;
}

function chooseSourceName(component: ManifestComponent): string {
  const sourceNames = component.ast?.sourceJsxNames || [];
  const exact = sourceNames.find((name) => name === component.type);
  const usable = exact || sourceNames.find((name) => /^[A-Z_$][A-Za-z0-9_$]*$/.test(name));
  if (!usable) throw new Error(`${component.type} has no importable source JSX name.`);
  return usable;
}
