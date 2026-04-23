import BpmnViewer from "bpmn-js/lib/NavigatedViewer";

export function createViewer(container) {
  return new BpmnViewer({
    container,
  });
}
