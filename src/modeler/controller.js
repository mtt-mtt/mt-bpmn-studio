import { disposeAll, listen, onEmitter } from "../app/lifecycle.js";
import { createModelerDiagramActions } from "./diagramActions.js";
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

  const bindEvents = () => {
    const disposers = [];

    const handleCommandStackChanged = () => {
      status.markDirty();
    };

    const handleTokenSimulationToggle = (event) => {
      status.setSimulationState(Boolean(event.active));
    };

    const handleFileChange = async (event) => {
      const [file] = event.target.files || [];
      if (!file) {
        return;
      }

      const xml = await file.text();
      await diagramActions.loadDiagram(xml, `已导入：${file.name}`);
      fileInput.value = "";
    };

    disposers.push(
      onEmitter(modeler, "commandStack.changed", handleCommandStackChanged),
      onEmitter(eventBus, "tokenSimulation.toggleMode", handleTokenSimulationToggle),
      listen(fileInput, "change", handleFileChange),
    );

    return () => disposeAll(disposers);
  };

  return {
    bindEvents,
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
