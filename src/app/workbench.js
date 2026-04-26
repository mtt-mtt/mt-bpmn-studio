import { createModelerController } from "../modeler/controller.js";
import { createModeler } from "../modeler/createModeler.js";
import { createTrackingController } from "../tracking/controller.js";
import { createViewer } from "../viewer/createViewer.js";
import { createToolbarController } from "./toolbarController.js";
import { createViewController } from "./viewController.js";

export function createWorkbench({ root, refs }) {
  const modeler = createModeler(refs.canvas, refs.propertiesPanel);
  const viewer = createViewer(refs.trackingCanvas);
  const modelerController = createModelerController({
    modeler,
    fileInput: refs.fileInput,
    diagramStatus: refs.diagramStatus,
    dirtyStatus: refs.dirtyStatus,
    lintStatus: refs.lintStatus,
    simulationStatus: refs.simulationStatus,
  });
  const trackingController = createTrackingController({
    root,
    viewer,
    trackingCanvas: refs.trackingCanvas,
    trackingPanel: refs.trackingPanel,
  });
  const viewController = createViewController({
    root,
    modelerPanel: refs.modelerPanel,
    trackingPanel: refs.trackingPanel,
    viewStatus: refs.viewStatus,
    trackingController,
  });
  const toolbarController = createToolbarController({
    root,
    modelerController,
    trackingController,
    viewController,
  });

  return {
    async start() {
      refs.engineStatus.textContent = "已就绪";

      await modelerController.loadDefaultDiagram();
      await trackingController.loadScenario("running");
      modelerController.setInitialState();
      viewController.setView("modeler");
      modelerController.bindEvents();
      trackingController.bindEvents();
      viewController.bindEvents();
      toolbarController.bindEvents();
    },
  };
}
