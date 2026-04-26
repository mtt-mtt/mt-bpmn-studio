import { createModeler } from "../modeler/createModeler.js";
import { createDefaultDiagram } from "../modeler/defaultDiagram.js";
import { createTrackingController } from "../tracking/controller.js";
import { createViewer } from "../viewer/createViewer.js";
import { downloadFile } from "./downloadFile.js";
import { appTemplate } from "./template.js";

export async function bootstrapApp(root) {
  root.innerHTML = appTemplate;

  const canvas = root.querySelector('[data-role="canvas"]');
  const propertiesPanel = root.querySelector('[data-role="properties-panel"]');
  const trackingCanvas = root.querySelector('[data-role="tracking-canvas"]');
  const engineStatus = root.querySelector('[data-role="engine-status"]');
  const diagramStatus = root.querySelector('[data-role="diagram-status"]');
  const dirtyStatus = root.querySelector('[data-role="dirty-status"]');
  const lintStatus = root.querySelector('[data-role="lint-status"]');
  const simulationStatus = root.querySelector('[data-role="simulation-status"]');
  const viewStatus = root.querySelector('[data-role="view-status"]');
  const fileInput = root.querySelector('[data-role="file-input"]');
  const modelerPanel = root.querySelector('[data-panel="modeler"]');
  const trackingPanel = root.querySelector('[data-panel="tracking"]');

  const modeler = createModeler(canvas, propertiesPanel);
  const viewer = createViewer(trackingCanvas);
  const trackingController = createTrackingController({
    root,
    viewer,
    trackingCanvas,
    trackingPanel,
  });
  const linting = modeler.get("linting");
  const simulationSupport = modeler.get("simulationSupport");
  const eventBus = modeler.get("eventBus");

  engineStatus.textContent = "已就绪";

  const setDirtyState = (isDirty) => {
    dirtyStatus.textContent = isDirty ? "有未导出修改" : "无";
  };

  const setLintState = () => {
    lintStatus.textContent = linting.isActive() ? "推荐规则已开启" : "已关闭";
  };

  const setSimulationState = (active) => {
    simulationStatus.textContent = active ? "Token Simulation 已开启" : "已关闭";
  };

  const setView = (view) => {
    const isTracking = view === "tracking";
    modelerPanel.hidden = isTracking;
    trackingPanel.hidden = !isTracking;
    viewStatus.textContent = isTracking ? "追踪模式" : "建模模式";

    root.querySelectorAll("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });

    if (isTracking) {
      requestAnimationFrame(() => {
        trackingController.fitCanvas();
        if (trackingController.getActiveNodeId()) {
          trackingController.setActiveNode(trackingController.getActiveNodeId());
        }
      });
    } else {
      trackingController.clearNodeDetail();
    }
  };

  modeler.on("commandStack.changed", () => {
    setDirtyState(true);
  });

  eventBus.on("tokenSimulation.toggleMode", (event) => {
    setSimulationState(Boolean(event.active));
  });

  async function loadDiagram(xml, label) {
    try {
      await modeler.importXML(xml);
      modeler.get("canvas").zoom("fit-viewport");
      diagramStatus.textContent = label;
      setDirtyState(false);
    } catch (error) {
      diagramStatus.textContent = "加载失败";
      console.error("Failed to load diagram", error);
    }
  }

  await loadDiagram(createDefaultDiagram(), "默认空白流程");
  await trackingController.loadScenario("running");
  setLintState();
  setSimulationState(false);
  setView("modeler");
  trackingController.bindEvents();

  root.querySelector('[data-action="new"]').addEventListener("click", async () => {
    await loadDiagram(createDefaultDiagram(), "默认空白流程");
  });

  root.querySelector('[data-action="open"]').addEventListener("click", () => {
    fileInput.click();
  });

  root.querySelector('[data-action="fit"]').addEventListener("click", () => {
    if (!trackingPanel.hidden) {
      trackingController.fitCanvas();
      if (trackingController.getActiveNodeId()) {
        trackingController.setActiveNode(trackingController.getActiveNodeId());
      }
      return;
    }

    modeler.get("canvas").zoom("fit-viewport");
  });

  root.querySelector('[data-action="toggle-lint"]').addEventListener("click", () => {
    linting.toggle();
    setLintState();
  });

  root.querySelector('[data-action="toggle-simulation"]').addEventListener("click", () => {
    simulationSupport.toggleSimulation();
  });

  root.querySelector('[data-action="undo"]').addEventListener("click", () => {
    modeler.get("commandStack").undo();
  });

  root.querySelector('[data-action="redo"]').addEventListener("click", () => {
    modeler.get("commandStack").redo();
  });

  root.querySelector('[data-action="save-xml"]').addEventListener("click", async () => {
    const { xml } = await modeler.saveXML({ format: true });
    downloadFile(xml, "workflow.bpmn", "application/xml;charset=utf-8");
    setDirtyState(false);
  });

  root.querySelector('[data-action="save-svg"]').addEventListener("click", async () => {
    const { svg } = await modeler.saveSVG();
    downloadFile(svg, "workflow.svg", "image/svg+xml;charset=utf-8");
  });

  fileInput.addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const xml = await file.text();
    await loadDiagram(xml, `已导入：${file.name}`);
    fileInput.value = "";
  });

  root.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
    });
  });

}
