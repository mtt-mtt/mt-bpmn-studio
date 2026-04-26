import BpmnModeler from "bpmn-js/lib/Modeler";
import { bpmnlintConfig } from "../lint/bpmnlint.config.js";
import { modelerModules } from "./modules.js";

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
    additionalModules: modelerModules,
  });
}
