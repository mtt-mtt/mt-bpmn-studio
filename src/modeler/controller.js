import { createModelerDiagramActions } from "./diagramActions.js";
import { bindModelerEvents } from "./events.js";
import { createModelerStatus } from "./status.js";

export function createModelerController({
  modeler,
  fileInput,
  diagramStatus,
  dirtyStatus,
  lintStatus,
  simulationStatus,
}) {
  const linting = modeler.get("linting");
  const simulationSupport = modeler.get("simulationSupport");
  const eventBus = modeler.get("eventBus");
  const status = createModelerStatus({
    diagramStatus,
    dirtyStatus,
    lintStatus,
    simulationStatus,
    linting,
  });
  const diagramActions = createModelerDiagramActions({ modeler, status });

  return {
    bindEvents: () => bindModelerEvents({
      diagramActions,
      eventBus,
      fileInput,
      modeler,
      status,
    }),
    fitCanvas: diagramActions.fitCanvas,
    loadDefaultDiagram: diagramActions.loadDefaultDiagram,
    openFilePicker: () => fileInput.click(),
    redo: () => modeler.get("commandStack").redo(),
    saveSvg: diagramActions.saveSvg,
    saveXml: diagramActions.saveXml,
    setInitialState: status.setInitialState,
    toggleLint: () => {
      linting.toggle();
      status.syncLintState();
    },
    toggleSimulation: () => {
      simulationSupport.toggleSimulation();
    },
    undo: () => modeler.get("commandStack").undo(),
  };
}
