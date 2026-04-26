import { trackingScenarios } from "./mockData.js";
import { getTrackingDomRefs } from "./domRefs.js";
import { bindTrackingEvents } from "./events.js";
import { applyTrackingMarkers } from "./markers.js";
import { getDefaultSelectedNodeId } from "./rendering.js";
import { renderTrackingScenario } from "./scenarioView.js";
import { createTrackingSelection } from "./selection.js";

export function createTrackingController({ root, viewer, trackingCanvas, trackingPanel }) {
  const viewerCanvas = viewer.get("canvas");
  const viewerEventBus = viewer.get("eventBus");
  const refs = getTrackingDomRefs(root);

  let currentScenarioKey = "running";

  const setTab = (tab) => {
    refs.tabs.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.trackingTab === tab);
    });

    refs.panels.forEach((panel) => {
      panel.hidden = panel.dataset.trackingPanel !== tab;
    });
  };

  const selection = createTrackingSelection({ viewer, refs, setTab });

  const fitCanvas = () => {
    const width = trackingCanvas.clientWidth;
    const height = trackingCanvas.clientHeight;

    if (!width || !height) {
      return;
    }

    viewerCanvas.resized();
    viewerCanvas.zoom("fit-viewport");
  };

  const loadScenario = async (scenarioKey) => {
    const scenario = trackingScenarios[scenarioKey];
    currentScenarioKey = scenarioKey;
    selection.reset();

    await viewer.importXML(scenario.xml);

    if (!trackingPanel.hidden) {
      fitCanvas();
    }

    applyTrackingMarkers(viewer, scenario);
    renderTrackingScenario(refs, scenario, scenarioKey);
    selection.setActiveNode(getDefaultSelectedNodeId(scenario), scenario);
  };

  return {
    bindEvents: () => bindTrackingEvents({
      currentScenarioKey: () => currentScenarioKey,
      fitCanvas,
      loadScenario,
      refs,
      selection,
      setTab,
      trackingScenarios,
      viewerCanvas,
      viewerEventBus,
    }),
    clearNodeDetail: selection.clearNodeDetail,
    fitCanvas,
    getActiveNodeId: selection.getActiveNodeId,
    loadScenario,
    setActiveNode: (nodeId) => {
      selection.setActiveNode(nodeId, trackingScenarios[currentScenarioKey]);
    },
  };
}
