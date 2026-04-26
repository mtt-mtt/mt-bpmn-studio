import BpmnModeler from "bpmn-js/lib/Modeler";
import { bpmnlintConfig } from "../lint/bpmnlint.config.js";
import "./assets.js";
import { modelerModules } from "./modules.js";

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
