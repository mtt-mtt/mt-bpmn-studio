import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from "bpmn-js-properties-panel/dist/index.esm.js";
import colorPickerModule from "bpmn-js-color-picker";
import lintModule from "bpmn-js-bpmnlint/dist/index.esm.js";
import nativeCopyPasteModule from "bpmn-js-native-copy-paste";
import tokenSimulationModule from "bpmn-js-token-simulation";
import simulationSupportModule from "bpmn-js-token-simulation/lib/simulation-support";
import gridModule from "diagram-js-grid";
import minimapModule from "diagram-js-minimap";
import controlsModule from "./controls/index.js";
import nativeCopyPasteFallbackModule from "./copy-paste/index.js";
import customThemeRendererModule from "./custom-rendering/index.js";
import { modelerFeatures } from "./features.js";
import i18nModule from "./i18n/index.js";
import studioPaletteModule from "./palette/index.js";
import studioPropertiesModule from "./properties/index.js";
import workflowRulesModule from "./rules/index.js";
import simulationColorsModule from "./simulation-colors/index.js";

function moduleEntry(feature, modules) {
  return {
    feature,
    modules,
  };
}

export const modelerModuleGroups = [
  {
    id: "canvas-support",
    entries: [
      moduleEntry("minimap", [minimapModule]),
      moduleEntry("grid", [gridModule]),
    ],
  },
  {
    id: "productivity-plugins",
    entries: [
      moduleEntry("nativeCopyPaste", [
        nativeCopyPasteModule,
        nativeCopyPasteFallbackModule,
      ]),
      moduleEntry("colorPicker", [colorPickerModule]),
      moduleEntry("lint", [lintModule]),
      moduleEntry("simulation", [
        tokenSimulationModule,
        simulationSupportModule,
        simulationColorsModule,
      ]),
    ],
  },
  {
    id: "properties-panel",
    entries: [
      moduleEntry("propertiesPanel", [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ]),
      moduleEntry("studioProperties", [studioPropertiesModule]),
    ],
  },
  {
    id: "studio-extensions",
    entries: [
      moduleEntry("i18n", [i18nModule]),
      moduleEntry("customRendering", [customThemeRendererModule]),
      moduleEntry("workflowRules", [workflowRulesModule]),
      moduleEntry("studioPalette", [studioPaletteModule]),
      moduleEntry("canvasControls", [controlsModule]),
    ],
  },
];

export const modelerModules = modelerModuleGroups.flatMap((group) =>
  group.entries.flatMap((entry) =>
    modelerFeatures[entry.feature] ? entry.modules : [],
  ),
);
