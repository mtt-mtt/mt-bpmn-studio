import { disposeAll, listen, onEmitter } from "../app/lifecycle.js";

export function bindModelerEvents({
  diagramActions,
  eventBus,
  fileInput,
  modeler,
  status,
}) {
  const disposers = [];

  const handleCommandStackChanged = () => {
    status.markDirty();
  };

  const handleTokenSimulationToggle = (event) => {
    status.setSimulationState(Boolean(event.active));
  };

  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const xml = await file.text();
    await diagramActions.loadDiagram(xml, `已导入：${file.name}`);
    fileInput.value = "";
  };

  disposers.push(
    onEmitter(modeler, "commandStack.changed", handleCommandStackChanged),
    onEmitter(eventBus, "tokenSimulation.toggleMode", handleTokenSimulationToggle),
    listen(fileInput, "change", handleFileChange),
  );

  return () => disposeAll(disposers);
}
