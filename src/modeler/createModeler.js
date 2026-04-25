import BpmnModeler from "bpmn-js/lib/Modeler";
import minimapModule from "diagram-js-minimap";
import gridModule from "diagram-js-grid";
import nativeCopyPasteModule from "bpmn-js-native-copy-paste";
import colorPickerModule from "bpmn-js-color-picker";
import lintModule from "bpmn-js-bpmnlint/dist/index.esm.js";
import tokenSimulationModule from "bpmn-js-token-simulation";
import simulationSupportModule from "bpmn-js-token-simulation/lib/simulation-support";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from "bpmn-js-properties-panel/dist/index.esm.js";
import { bpmnlintConfig } from "../lint/bpmnlint.config.js";
import commentsModule from "./comments/index.js";
import controlsModule from "./controls/index.js";
import customThemeRendererModule from "./custom-rendering/index.js";
import i18nModule from "./i18n/index.js";
import odooPropertiesModule from "./properties/index.js";
import odooPaletteModule from "./palette/index.js";
import workflowRulesModule from "./rules/index.js";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-color-picker/colors/color-picker.css";
import "diagram-js-minimap/assets/diagram-js-minimap.css";
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";

export function createModeler(container, propertiesParent) {
  return new BpmnModeler({
    container,
    propertiesPanel: {
      parent: propertiesParent,
    },
    linting: {
      active: true,
      bpmnlint: bpmnlintConfig,
    },
    additionalModules: [
      minimapModule,
      gridModule,
      nativeCopyPasteModule,
      colorPickerModule,
      lintModule,
      tokenSimulationModule,
      simulationSupportModule,
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      i18nModule,
      customThemeRendererModule,
      commentsModule,
      workflowRulesModule,
      odooPropertiesModule,
      odooPaletteModule,
      controlsModule,
    ],
  });
}
