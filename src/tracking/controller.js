import { trackingScenarios } from "./mockData.js";
import { getTrackingDomRefs } from "./domRefs.js";
import { bindTrackingEvents } from "./events.js";
import { applyTrackingMarkers } from "./markers.js";
import { getDefaultSelectedNodeId } from "./rendering.js";
import { renderTrackingScenario } from "./scenarioView.js";
import { createTrackingSelection } from "./selection.js";
import { createTrackingTabs } from "./tabs.js";

export function createTrackingController({ root, viewer, trackingCanvas, trackingPanel }) {
  const viewerCanvas = viewer.get("canvas");
  const viewerEventBus = viewer.get("eventBus");
  const refs = getTrackingDomRefs(root);

  let currentScenarioKey = "running";

  const tabs = createTrackingTabs(refs);
  const selection = createTrackingSelection({ viewer, refs, tabs });

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
      tabs,
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
