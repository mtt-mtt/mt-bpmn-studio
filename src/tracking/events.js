import { disposeAll, listen, onEmitter } from "../app/lifecycle.js";
import { isSelectableElement } from "./rendering.js";

export function bindTrackingEvents({
  currentScenarioKey,
  fitCanvas,
  loadScenario,
  refs,
  selection,
  setTab,
  trackingScenarios,
  viewerCanvas,
  viewerEventBus,
}) {
  const disposers = [];

  const handleElementClick = ({ element }) => {
    if (!isSelectableElement(element)) {
      return;
    }

    selection.setActiveNode(element.id, trackingScenarios[currentScenarioKey()]);
  };

  const handleCanvasClick = () => {
    selection.setActiveNode("", trackingScenarios[currentScenarioKey()]);
  };

  disposers.push(
    onEmitter(viewerEventBus, "element.click", handleElementClick),
    onEmitter(viewerEventBus, "canvas.click", handleCanvasClick),
  );

  refs.scenarioButtons.forEach((button) => {
    disposers.push(listen(button, "click", async () => {
      await loadScenario(button.dataset.scenario);
    }));
  });

  refs.tabs.forEach((button) => {
    disposers.push(listen(button, "click", () => {
      setTab(button.dataset.trackingTab);
    }));
  });

  refs.tools.forEach((button) => {
    disposers.push(listen(button, "click", async () => {
      const tool = button.dataset.trackingTool;

      if (tool === "fit") {
        fitCanvas();
        return;
      }

      if (tool === "refresh") {
        await loadScenario(currentScenarioKey());
        return;
      }

      const currentZoom = viewerCanvas.zoom();
      if (tool === "zoom-in") {
        viewerCanvas.zoom(Math.min(currentZoom + 0.15, 2.5));
      }
      if (tool === "zoom-out") {
        viewerCanvas.zoom(Math.max(currentZoom - 0.15, 0.25));
      }
    }));
  });

  return () => disposeAll(disposers);
}
