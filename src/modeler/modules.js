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

function when(enabled, modules) {
  return enabled ? modules : [];
}

const canvasSupportModules = [
  ...when(modelerFeatures.minimap, [minimapModule]),
  ...when(modelerFeatures.grid, [gridModule]),
];

const productivityModules = [
  ...when(modelerFeatures.nativeCopyPaste, [
    nativeCopyPasteModule,
    nativeCopyPasteFallbackModule,
  ]),
  ...when(modelerFeatures.colorPicker, [colorPickerModule]),
  ...when(modelerFeatures.lint, [lintModule]),
  ...when(modelerFeatures.simulation, [
    tokenSimulationModule,
    simulationSupportModule,
    simulationColorsModule,
  ]),
];

const propertiesPanelModules = [
  ...when(modelerFeatures.propertiesPanel, [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
  ]),
  ...when(modelerFeatures.studioProperties, [studioPropertiesModule]),
];

const studioExtensionModules = [
  ...when(modelerFeatures.i18n, [i18nModule]),
  ...when(modelerFeatures.customRendering, [customThemeRendererModule]),
  ...when(modelerFeatures.workflowRules, [workflowRulesModule]),
  ...when(modelerFeatures.studioPalette, [studioPaletteModule]),
  ...when(modelerFeatures.canvasControls, [controlsModule]),
];

export const modelerModules = [
  ...canvasSupportModules,
  ...productivityModules,
  ...propertiesPanelModules,
  ...studioExtensionModules,
];
