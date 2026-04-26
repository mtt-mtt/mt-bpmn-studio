import { disposeAll, listen } from "./lifecycle.js";
import { VIEW_STATUS_LABELS, isTrackingView } from "./viewModes.js";

export function createViewController({
  root,
  modelerPanel,
  trackingPanel,
  viewStatus,
  trackingController,
}) {
  const setView = (view) => {
    const isTracking = isTrackingView(view);
    modelerPanel.hidden = isTracking;
    trackingPanel.hidden = !isTracking;
    viewStatus.textContent = VIEW_STATUS_LABELS[view] || VIEW_STATUS_LABELS.modeler;

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

  return {
    bindEvents: () => {
      const disposers = [];

      root.querySelectorAll("[data-view]").forEach((button) => {
        disposers.push(listen(button, "click", () => {
          setView(button.dataset.view);
        }));
      });

      return () => disposeAll(disposers);
    },
    isTrackingActive: () => !trackingPanel.hidden,
    setView,
  };
}
