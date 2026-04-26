const TRACKING_MARKER_MAP = {
  "tracking-marker-completed": "completed",
  "tracking-marker-current": "current",
  "tracking-marker-pending": "pending",
  "tracking-marker-error": "error",
};

export function applyTrackingMarkers(viewer, scenario) {
  const canvas = viewer.get("canvas");

  Object.entries(TRACKING_MARKER_MAP).forEach(([markerClass, markerKey]) => {
    (scenario.markers[markerKey] || []).forEach((id) => {
      canvas.addMarker(id, markerClass);
    });
  });
}
