import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "src/main.js",
  "src/app/bootstrap.js",
  "src/app/lifecycle.js",
  "src/app/template.js",
  "src/app/templates/modelerPanelTemplate.js",
  "src/app/templates/sidebarTemplate.js",
  "src/app/templates/trackingPanelTemplate.js",
  "src/app/templates/workspaceHeaderTemplate.js",
  "src/app/toolbarController.js",
  "src/app/viewController.js",
  "src/app/viewModes.js",
  "src/app/workbench.js",
  "src/modeler/createModeler.js",
  "src/modeler/features.js",
  "src/modeler/modules.js",
  "src/modeler/palette/paletteEntries.js",
  "src/modeler/status.js",
  "src/modeler/i18n/locales/index.js",
  "src/modeler/i18n/locales/zh.js",
  "src/modeler/i18n/toolbarLabels.js",
  "src/modeler/i18n/translations.js",
  "src/tracking/controller.js",
  "src/tracking/events.js",
  "src/tracking/scenarioView.js",
  "src/tracking/selection.js",
  "src/tracking/tabs.js",
  "src/tracking/mockData.js",
  "src/tracking/scenarios/runningScenario.js",
  "src/tracking/scenarios/exceptionScenario.js",
  "src/styles/app.css",
  "src/styles/bpmn-studio-theme.css",
  "samples/approval-demo.bpmn",
];

for (const file of requiredFiles) {
  await access(file);
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const requiredScripts = ["dev", "build", "preview", "smoke"];
const requiredDependencies = [
  "bpmn-js",
  "bpmn-js-bpmnlint",
  "bpmn-js-color-picker",
  "bpmn-js-native-copy-paste",
  "bpmn-js-properties-panel",
  "bpmn-js-token-simulation",
  "diagram-js-grid",
  "diagram-js-minimap",
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`Missing package script: ${script}`);
  }
}

for (const dependency of requiredDependencies) {
  if (!packageJson.dependencies?.[dependency]) {
    throw new Error(`Missing package dependency: ${dependency}`);
  }
}

console.log("Smoke structure check passed.");
