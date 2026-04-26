import { disposeAll, listen } from "./lifecycle.js";

export function createToolbarController({
  root,
  modelerController,
  trackingController,
  viewController,
}) {
  const bindAction = (action, handler) => {
    const target = root.querySelector(`[data-action="${action}"]`);
    return target ? listen(target, "click", handler) : null;
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

  const actionHandlers = {
    new: async () => {
      await modelerController.loadDefaultDiagram();
    },
    open: () => {
      modelerController.openFilePicker();
    },
    fit: fitActiveCanvas,
    "toggle-lint": () => {
      modelerController.toggleLint();
    },
    "toggle-simulation": () => {
      modelerController.toggleSimulation();
    },
    undo: () => {
      modelerController.undo();
    },
    redo: () => {
      modelerController.redo();
    },
    "save-xml": async () => {
      await modelerController.saveXml();
    },
    "save-svg": async () => {
      await modelerController.saveSvg();
    },
  };

  return {
    bindEvents: () => {
      const disposers = Object.entries(actionHandlers).map(([action, handler]) =>
        bindAction(action, handler),
      );

      return () => disposeAll(disposers);
    },
  };
}
