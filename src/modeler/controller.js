import { downloadFile } from "../app/downloadFile.js";
import { disposeAll, listen, onEmitter } from "../app/lifecycle.js";
import { createDefaultDiagram } from "./defaultDiagram.js";

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

  const setDirtyState = (isDirty) => {
    dirtyStatus.textContent = isDirty ? "有未导出修改" : "无";
  };

  const setLintState = () => {
    lintStatus.textContent = linting.isActive() ? "推荐规则已开启" : "已关闭";
  };

  const setSimulationState = (active) => {
    simulationStatus.textContent = active ? "Token Simulation 已开启" : "已关闭";
  };

  const loadDiagram = async (xml, label) => {
    try {
      await modeler.importXML(xml);
      modeler.get("canvas").zoom("fit-viewport");
      diagramStatus.textContent = label;
      setDirtyState(false);
    } catch (error) {
      diagramStatus.textContent = "加载失败";
      console.error("Failed to load diagram", error);
    }
  };

  const bindEvents = () => {
    const disposers = [];

    const handleCommandStackChanged = () => {
      setDirtyState(true);
    };

    const handleTokenSimulationToggle = (event) => {
      setSimulationState(Boolean(event.active));
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
      setDirtyState(false);
    },
    setInitialState: () => {
      setLintState();
      setSimulationState(false);
    },
    toggleLint: () => {
      linting.toggle();
      setLintState();
    },
    toggleSimulation: () => {
      simulationSupport.toggleSimulation();
    },
    undo: () => modeler.get("commandStack").undo(),
  };
}
