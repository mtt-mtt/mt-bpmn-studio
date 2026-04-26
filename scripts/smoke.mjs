import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "src/main.js",
  "src/app/bootstrap.js",
  "src/app/workbench.js",
  "src/modeler/createModeler.js",
  "src/modeler/features.js",
  "src/modeler/modules.js",
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

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    throw new Error(`Missing package script: ${script}`);
  }
}

console.log("Smoke structure check passed.");
