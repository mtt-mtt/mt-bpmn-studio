export function createViewController({
  root,
  modelerPanel,
  trackingPanel,
  viewStatus,
  trackingController,
}) {
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

  return {
    bindEvents: () => {
      root.querySelectorAll("[data-view]").forEach((button) => {
        button.addEventListener("click", () => {
          setView(button.dataset.view);
        });
      });
    },
    isTrackingActive: () => !trackingPanel.hidden,
    setView,
  };
}
