import { trackingScenarios } from "./mockData.js";
import { getTrackingDomRefs } from "./domRefs.js";
import { applyTrackingMarkers } from "./markers.js";
import {
  buildEmptyNodeDetailHtml,
  buildFallbackNodeDetail,
  buildNodeDetailHtml,
  getDefaultSelectedNodeId,
  isSelectableElement,
  renderLogs,
} from "./rendering.js";

export function createTrackingController({ root, viewer, trackingCanvas, trackingPanel }) {
  const viewerCanvas = viewer.get("canvas");
  const viewerEventBus = viewer.get("eventBus");
  const elementRegistry = viewer.get("elementRegistry");
  const refs = getTrackingDomRefs(root);

  let currentScenarioKey = "running";
  let activeTrackingNodeId = "";

  const setTab = (tab) => {
    refs.tabs.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.trackingTab === tab);
    });

    refs.panels.forEach((panel) => {
      panel.hidden = panel.dataset.trackingPanel !== tab;
    });
  };

  const clearNodeDetail = () => {
    refs.nodeDetail.innerHTML = buildEmptyNodeDetailHtml();
  };

  const fitCanvas = () => {
    const width = trackingCanvas.clientWidth;
    const height = trackingCanvas.clientHeight;

    if (!width || !height) {
      return;
    }

    viewerCanvas.resized();
    viewerCanvas.zoom("fit-viewport");
  };

  const setActiveNode = (nodeId) => {
    const scenario = trackingScenarios[currentScenarioKey];

    if (!nodeId) {
      if (activeTrackingNodeId) {
        viewerCanvas.removeMarker(activeTrackingNodeId, "tracking-marker-selected");
      }
      activeTrackingNodeId = "";
      clearNodeDetail();
      setTab("log");
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
    refs.nodeDetail.innerHTML = buildNodeDetailHtml(detail);
    setTab("detail");
  };

  const loadScenario = async (scenarioKey) => {
    const scenario = trackingScenarios[scenarioKey];
    currentScenarioKey = scenarioKey;
    activeTrackingNodeId = "";
    clearNodeDetail();

    await viewer.importXML(scenario.xml);

    if (!trackingPanel.hidden) {
      fitCanvas();
    }

    applyTrackingMarkers(viewer, scenario);

    refs.title.textContent = scenario.title;
    refs.document.textContent = scenario.documentLabel;
    refs.trigger.textContent = scenario.triggerLabel;
    refs.state.textContent = scenario.stateLabel;
    refs.state.className = `tracking-state-tag ${scenario.stateClass}`;
    refs.banner.hidden = !scenario.exceptionMessage;
    refs.banner.textContent = scenario.exceptionMessage;
    refs.autoStatus.hidden = !scenario.autoStatus;
    refs.autoStatus.textContent = scenario.autoStatus;
    renderLogs(refs.logList, scenario.logs);

    refs.scenarioButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.scenario === scenarioKey);
    });

    setActiveNode(getDefaultSelectedNodeId(scenario));
  };

  const bindEvents = () => {
    viewerEventBus.on("element.click", ({ element }) => {
      if (!isSelectableElement(element)) {
        return;
      }

      setActiveNode(element.id);
    });

    viewerEventBus.on("canvas.click", () => {
      setActiveNode("");
    });

    refs.scenarioButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        await loadScenario(button.dataset.scenario);
      });
    });

    refs.tabs.forEach((button) => {
      button.addEventListener("click", () => {
        setTab(button.dataset.trackingTab);
      });
    });

    refs.tools.forEach((button) => {
      button.addEventListener("click", async () => {
        const tool = button.dataset.trackingTool;

        if (tool === "fit") {
          fitCanvas();
          return;
        }

        if (tool === "refresh") {
          await loadScenario(currentScenarioKey);
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
  };

  return {
    bindEvents,
    clearNodeDetail,
    fitCanvas,
    getActiveNodeId: () => activeTrackingNodeId,
    loadScenario,
    setActiveNode,
  };
}
