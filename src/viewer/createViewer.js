import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import customThemeRendererModule from "../modeler/custom-rendering/index.js";

export function createViewer(container) {
  return new BpmnViewer({
    container,
    additionalModules: [
      customThemeRendererModule,
    ],
  });
}
