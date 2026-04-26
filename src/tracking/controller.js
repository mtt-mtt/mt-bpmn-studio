import { trackingScenarios } from "./mockData.js";
import {
  buildEmptyNodeDetailHtml,
  buildFallbackNodeDetail,
  buildNodeDetailHtml,
  getDefaultSelectedNodeId,
  isSelectableElement,
  renderLogs,
} from "./rendering.js";

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

export function createTrackingController({ root, viewer, trackingCanvas, trackingPanel }) {
  const viewerCanvas = viewer.get("canvas");
  const viewerEventBus = viewer.get("eventBus");
  const elementRegistry = viewer.get("elementRegistry");
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

  let currentScenarioKey = "running";
  let activeTrackingNodeId = "";

  const setTab = (tab) => {
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
    trackingNodeDetail.innerHTML = buildNodeDetailHtml(detail);
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

    root.querySelectorAll("[data-scenario]").forEach((button) => {
      button.addEventListener("click", async () => {
        await loadScenario(button.dataset.scenario);
      });
    });

    trackingTabs.forEach((button) => {
      button.addEventListener("click", () => {
        setTab(button.dataset.trackingTab);
      });
    });

    root.querySelectorAll("[data-tracking-tool]").forEach((button) => {
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
