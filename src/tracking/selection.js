import {
  buildEmptyNodeDetailHtml,
  buildFallbackNodeDetail,
  buildNodeDetailHtml,
} from "./rendering.js";

export function createTrackingSelection({ viewer, refs, tabs }) {
  const viewerCanvas = viewer.get("canvas");
  const elementRegistry = viewer.get("elementRegistry");
  let activeNodeId = "";

  const clearNodeDetail = () => {
    refs.nodeDetail.innerHTML = buildEmptyNodeDetailHtml();
  };

  const setActiveNode = (nodeId, scenario) => {
    if (!nodeId) {
      if (activeNodeId) {
        viewerCanvas.removeMarker(activeNodeId, "tracking-marker-selected");
      }
      activeNodeId = "";
      clearNodeDetail();
      tabs.setLogTab();
      return;
    }

    if (activeNodeId && activeNodeId !== nodeId) {
      viewerCanvas.removeMarker(activeNodeId, "tracking-marker-selected");
    }

    activeNodeId = nodeId;
    viewerCanvas.addMarker(nodeId, "tracking-marker-selected");

    const element = elementRegistry.get(nodeId);
    if (!element) {
      clearNodeDetail();
      return;
    }

    const detail = scenario.nodeDetails?.[nodeId] || buildFallbackNodeDetail(viewer, scenario, nodeId);
    refs.nodeDetail.innerHTML = buildNodeDetailHtml(detail);
    tabs.setDetailTab();
  };

  return {
    clearNodeDetail,
    getActiveNodeId: () => activeNodeId,
    reset() {
      if (activeNodeId) {
        viewerCanvas.removeMarker(activeNodeId, "tracking-marker-selected");
      }
      activeNodeId = "";
      clearNodeDetail();
    },
    setActiveNode,
  };
}
