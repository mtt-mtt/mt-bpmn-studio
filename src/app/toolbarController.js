export function createToolbarController({
  root,
  modelerController,
  trackingController,
  viewController,
}) {
  const bindAction = (action, handler) => {
    root.querySelector(`[data-action="${action}"]`)?.addEventListener("click", handler);
  };

  const fitActiveCanvas = () => {
    if (viewController.isTrackingActive()) {
      trackingController.fitCanvas();
      if (trackingController.getActiveNodeId()) {
        trackingController.setActiveNode(trackingController.getActiveNodeId());
      }
      return;
    }

    modelerController.fitCanvas();
  };

  return {
    bindEvents: () => {
      bindAction("new", async () => {
        await modelerController.loadDefaultDiagram();
      });

      bindAction("open", () => {
        modelerController.openFilePicker();
      });

      bindAction("fit", fitActiveCanvas);

      bindAction("toggle-lint", () => {
        modelerController.toggleLint();
      });

      bindAction("toggle-simulation", () => {
        modelerController.toggleSimulation();
      });

      bindAction("undo", () => {
        modelerController.undo();
      });

      bindAction("redo", () => {
        modelerController.redo();
      });

      bindAction("save-xml", async () => {
        await modelerController.saveXml();
      });

      bindAction("save-svg", async () => {
        await modelerController.saveSvg();
      });
    },
  };
}
