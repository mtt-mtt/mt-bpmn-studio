export function getDomRefs(root) {
  return {
    canvas: root.querySelector('[data-role="canvas"]'),
    diagramStatus: root.querySelector('[data-role="diagram-status"]'),
    dirtyStatus: root.querySelector('[data-role="dirty-status"]'),
    engineStatus: root.querySelector('[data-role="engine-status"]'),
    fileInput: root.querySelector('[data-role="file-input"]'),
    lintStatus: root.querySelector('[data-role="lint-status"]'),
    modelerPanel: root.querySelector('[data-panel="modeler"]'),
    propertiesPanel: root.querySelector('[data-role="properties-panel"]'),
    simulationStatus: root.querySelector('[data-role="simulation-status"]'),
    trackingCanvas: root.querySelector('[data-role="tracking-canvas"]'),
    trackingPanel: root.querySelector('[data-panel="tracking"]'),
    viewStatus: root.querySelector('[data-role="view-status"]'),
  };
}
