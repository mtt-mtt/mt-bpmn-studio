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

  return {
    bindEvents: () => {
      const disposers = [];

      disposers.push(bindAction("new", async () => {
        await modelerController.loadDefaultDiagram();
      }));

      disposers.push(bindAction("open", () => {
        modelerController.openFilePicker();
      }));

      disposers.push(bindAction("fit", fitActiveCanvas));

      disposers.push(bindAction("toggle-lint", () => {
        modelerController.toggleLint();
      }));

      disposers.push(bindAction("toggle-simulation", () => {
        modelerController.toggleSimulation();
      }));

      disposers.push(bindAction("undo", () => {
        modelerController.undo();
      }));

      disposers.push(bindAction("redo", () => {
        modelerController.redo();
      }));

      disposers.push(bindAction("save-xml", async () => {
        await modelerController.saveXml();
      }));

      disposers.push(bindAction("save-svg", async () => {
        await modelerController.saveSvg();
      }));

      return () => disposeAll(disposers);
    },
  };
}
