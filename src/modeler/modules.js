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
import i18nModule from "./i18n/index.js";
import studioPaletteModule from "./palette/index.js";
import studioPropertiesModule from "./properties/index.js";
import workflowRulesModule from "./rules/index.js";
import simulationColorsModule from "./simulation-colors/index.js";

export const modelerModules = [
  minimapModule,
  gridModule,
  nativeCopyPasteModule,
  nativeCopyPasteFallbackModule,
  colorPickerModule,
  lintModule,
  tokenSimulationModule,
  simulationSupportModule,
  simulationColorsModule,
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  i18nModule,
  customThemeRendererModule,
  workflowRulesModule,
  studioPropertiesModule,
  studioPaletteModule,
  controlsModule,
];
