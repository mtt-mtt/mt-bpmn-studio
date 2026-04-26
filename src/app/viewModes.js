export const VIEW_MODES = {
  MODELER: "modeler",
  TRACKING: "tracking",
};

export const VIEW_STATUS_LABELS = {
  [VIEW_MODES.MODELER]: "建模模式",
  [VIEW_MODES.TRACKING]: "追踪模式",
};

export function isTrackingView(view) {
  return view === VIEW_MODES.TRACKING;
}
