import { downloadFile } from "../app/downloadFile.js";
import { disposeAll, listen, onEmitter } from "../app/lifecycle.js";
import { createDefaultDiagram } from "./defaultDiagram.js";
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

  const loadDiagram = async (xml, label) => {
    try {
      await modeler.importXML(xml);
      modeler.get("canvas").zoom("fit-viewport");
      status.markDiagramLoaded(label);
    } catch (error) {
      status.markDiagramLoadFailed();
      console.error("Failed to load diagram", error);
    }
  };

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
      await loadDiagram(xml, `已导入：${file.name}`);
      fileInput.value = "";
    };

    disposers.push(
      onEmitter(modeler, "commandStack.changed", handleCommandStackChanged),
      onEmitter(eventBus, "tokenSimulation.toggleMode", handleTokenSimulationToggle),
      listen(fileInput, "change", handleFileChange),
    );

    return () => disposeAll(disposers);
  };

  const loadDefaultDiagram = () => loadDiagram(createDefaultDiagram(), "默认空白流程");

  return {
    bindEvents,
    fitCanvas: () => modeler.get("canvas").zoom("fit-viewport"),
    loadDefaultDiagram,
    openFilePicker: () => fileInput.click(),
    redo: () => modeler.get("commandStack").redo(),
    saveSvg: async () => {
      const { svg } = await modeler.saveSVG();
      downloadFile(svg, "workflow.svg", "image/svg+xml;charset=utf-8");
    },
    saveXml: async () => {
      const { xml } = await modeler.saveXML({ format: true });
      downloadFile(xml, "workflow.bpmn", "application/xml;charset=utf-8");
      status.markSaved();
    },
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
