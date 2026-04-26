import { createModeler } from "../modeler/createModeler.js";
import { createDefaultDiagram } from "../modeler/defaultDiagram.js";
import { trackingScenarios } from "../tracking/mockData.js";
import {
  buildEmptyNodeDetailHtml,
  buildFallbackNodeDetail,
  buildNodeDetailHtml,
  getDefaultSelectedNodeId,
  isSelectableElement,
  renderLogs,
} from "../tracking/rendering.js";
import { createViewer } from "../viewer/createViewer.js";
import { downloadFile } from "./downloadFile.js";
import { appTemplate } from "./template.js";

function applyViewerMarkers(viewer, scenario) {
  const canvas = viewer.get("canvas");
  Object.entries({
    "tracking-marker-completed": scenario.markers.completed || [],
    "tracking-marker-current": scenario.markers.current || [],
    "tracking-marker-pending": scenario.markers.pending || [],
    "tracking-marker-error": scenario.markers.error || [],
  }).forEach(([markerClass, ids]) => {
    ids.forEach((id) => canvas.addMarker(id, markerClass));
  });
}

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
  const trackingTitle = root.querySelector('[data-role="tracking-title"]');
  const trackingDocument = root.querySelector('[data-role="tracking-document"]');
  const trackingTrigger = root.querySelector('[data-role="tracking-trigger"]');
  const trackingState = root.querySelector('[data-role="tracking-state"]');
  const trackingBanner = root.querySelector('[data-role="tracking-banner"]');
  const trackingAutoStatus = root.querySelector('[data-role="tracking-auto-status"]');
  const trackingNodeDetail = root.querySelector('[data-role="tracking-node-detail"]');
  const trackingLogList = root.querySelector('[data-role="tracking-log-list"]');
  const trackingTabs = [...root.querySelectorAll("[data-tracking-tab]")];
  const trackingPanels = [...root.querySelectorAll("[data-tracking-panel]")];

  const modeler = createModeler(canvas, propertiesPanel);
  const viewer = createViewer(trackingCanvas);
  const linting = modeler.get("linting");
  const simulationSupport = modeler.get("simulationSupport");
  const eventBus = modeler.get("eventBus");
  const viewerCanvas = viewer.get("canvas");
  const viewerEventBus = viewer.get("eventBus");
  const elementRegistry = viewer.get("elementRegistry");

  let currentScenarioKey = "running";
  let activeTrackingNodeId = "";

  engineStatus.textContent = "已就绪";

  const setTrackingTab = (tab) => {
    trackingTabs.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.trackingTab === tab);
    });

    trackingPanels.forEach((panel) => {
      panel.hidden = panel.dataset.trackingPanel !== tab;
    });
  };

  const clearNodeDetail = () => {
    trackingNodeDetail.innerHTML = buildEmptyNodeDetailHtml();
  };

  const setDirtyState = (isDirty) => {
    dirtyStatus.textContent = isDirty ? "有未导出修改" : "无";
  };

  const setLintState = () => {
    lintStatus.textContent = linting.isActive() ? "推荐规则已开启" : "已关闭";
  };

  const setSimulationState = (active) => {
    simulationStatus.textContent = active ? "Token Simulation 已开启" : "已关闭";
  };

  const fitTrackingCanvas = () => {
    const width = trackingCanvas.clientWidth;
    const height = trackingCanvas.clientHeight;

    if (!width || !height) {
      return;
    }

    viewerCanvas.resized();
    viewerCanvas.zoom("fit-viewport");
  };

  const setActiveTrackingNode = (nodeId) => {
    const scenario = trackingScenarios[currentScenarioKey];

    if (!nodeId) {
      if (activeTrackingNodeId) {
        viewerCanvas.removeMarker(activeTrackingNodeId, "tracking-marker-selected");
      }
      activeTrackingNodeId = "";
      clearNodeDetail();
      setTrackingTab("log");
      return;
    }

    if (activeTrackingNodeId && activeTrackingNodeId !== nodeId) {
      viewerCanvas.removeMarker(activeTrackingNodeId, "tracking-marker-selected");
    }

    activeTrackingNodeId = nodeId;
    viewerCanvas.addMarker(nodeId, "tracking-marker-selected");

    const element = elementRegistry.get(nodeId);
    if (!element) {
      clearNodeDetail();
      return;
    }

    const detail = scenario.nodeDetails?.[nodeId] || buildFallbackNodeDetail(viewer, scenario, nodeId);
    trackingNodeDetail.innerHTML = buildNodeDetailHtml(detail);
    setTrackingTab("detail");
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
        fitTrackingCanvas();
        if (activeTrackingNodeId) {
          setActiveTrackingNode(activeTrackingNodeId);
        }
      });
    } else {
      clearNodeDetail();
    }
  };

  const loadTrackingScenario = async (scenarioKey) => {
    const scenario = trackingScenarios[scenarioKey];
    currentScenarioKey = scenarioKey;
    activeTrackingNodeId = "";
    clearNodeDetail();

    await viewer.importXML(scenario.xml);

    if (!trackingPanel.hidden) {
      fitTrackingCanvas();
    }

    applyViewerMarkers(viewer, scenario);

    trackingTitle.textContent = scenario.title;
    trackingDocument.textContent = scenario.documentLabel;
    trackingTrigger.textContent = scenario.triggerLabel;
    trackingState.textContent = scenario.stateLabel;
    trackingState.className = `tracking-state-tag ${scenario.stateClass}`;
    trackingBanner.hidden = !scenario.exceptionMessage;
    trackingBanner.textContent = scenario.exceptionMessage;
    trackingAutoStatus.hidden = !scenario.autoStatus;
    trackingAutoStatus.textContent = scenario.autoStatus;
    renderLogs(trackingLogList, scenario.logs);

    root.querySelectorAll("[data-scenario]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.scenario === scenarioKey);
    });

    setActiveTrackingNode(getDefaultSelectedNodeId(scenario));
  };

  modeler.on("commandStack.changed", () => {
    setDirtyState(true);
  });

  eventBus.on("tokenSimulation.toggleMode", (event) => {
    setSimulationState(Boolean(event.active));
  });

  viewerEventBus.on("element.click", ({ element }) => {
    if (!isSelectableElement(element)) {
      return;
    }

    setActiveTrackingNode(element.id);
  });

  viewerEventBus.on("canvas.click", () => {
    setActiveTrackingNode("");
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
  await loadTrackingScenario(currentScenarioKey);
  setLintState();
  setSimulationState(false);
  setView("modeler");

  root.querySelector('[data-action="new"]').addEventListener("click", async () => {
    await loadDiagram(createDefaultDiagram(), "默认空白流程");
  });

  root.querySelector('[data-action="open"]').addEventListener("click", () => {
    fileInput.click();
  });

  root.querySelector('[data-action="fit"]').addEventListener("click", () => {
    if (!trackingPanel.hidden) {
      fitTrackingCanvas();
      if (activeTrackingNodeId) {
        setActiveTrackingNode(activeTrackingNodeId);
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

  root.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", async () => {
      await loadTrackingScenario(button.dataset.scenario);
    });
  });

  trackingTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setTrackingTab(button.dataset.trackingTab);
    });
  });

  root.querySelectorAll("[data-tracking-tool]").forEach((button) => {
    button.addEventListener("click", async () => {
      const tool = button.dataset.trackingTool;

      if (tool === "fit") {
        fitTrackingCanvas();
        return;
      }

      if (tool === "refresh") {
        await loadTrackingScenario(currentScenarioKey);
        return;
      }

      const currentZoom = viewerCanvas.zoom();
      if (tool === "zoom-in") {
        viewerCanvas.zoom(Math.min(currentZoom + 0.15, 2.5));
      }
      if (tool === "zoom-out") {
        viewerCanvas.zoom(Math.max(currentZoom - 0.15, 0.25));
      }
    });
  });
}
