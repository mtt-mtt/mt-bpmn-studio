import { createModelerController } from "../modeler/controller.js";
import { createModeler } from "../modeler/createModeler.js";
import { createTrackingController } from "../tracking/controller.js";
import { createViewer } from "../viewer/createViewer.js";
import { appTemplate } from "./template.js";
import { createToolbarController } from "./toolbarController.js";
import { createViewController } from "./viewController.js";

export async function bootstrapApp(root) {
  root.innerHTML = appTemplate;

  const canvas = root.querySelector('[data-role="canvas"]');
  const propertiesPanel = root.querySelector('[data-role="properties-panel"]');
  const trackingCanvas = root.querySelector('[data-role="tracking-canvas"]');
  const engineStatus = root.querySelector('[data-role="engine-status"]');
  const diagramStatus = root.querySelector('[data-role="diagram-status"]');
  const dirtyStatus = root.querySelector('[data-role="dirty-status"]');
  const lintStatus = root.querySelector('[data-role="lint-status"]');
  const simulationStatus = root.querySelector('[data-role="simulation-status"]');
  const viewStatus = root.querySelector('[data-role="view-status"]');
  const fileInput = root.querySelector('[data-role="file-input"]');
  const modelerPanel = root.querySelector('[data-panel="modeler"]');
  const trackingPanel = root.querySelector('[data-panel="tracking"]');

  const modeler = createModeler(canvas, propertiesPanel);
  const viewer = createViewer(trackingCanvas);
  const modelerController = createModelerController({
    modeler,
    fileInput,
    diagramStatus,
    dirtyStatus,
    lintStatus,
    simulationStatus,
  });
  const trackingController = createTrackingController({
    root,
    viewer,
    trackingCanvas,
    trackingPanel,
  });
  const viewController = createViewController({
    root,
    modelerPanel,
    trackingPanel,
    viewStatus,
    trackingController,
  });
  const toolbarController = createToolbarController({
    root,
    modelerController,
    trackingController,
    viewController,
  });

  engineStatus.textContent = "已就绪";

  await modelerController.loadDefaultDiagram();
  await trackingController.loadScenario("running");
  modelerController.setInitialState();
  viewController.setView("modeler");
  modelerController.bindEvents();
  trackingController.bindEvents();
  viewController.bindEvents();
  toolbarController.bindEvents();
}
