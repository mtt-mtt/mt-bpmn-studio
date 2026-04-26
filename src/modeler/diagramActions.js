import { downloadFile } from "../app/downloadFile.js";
import { createDefaultDiagram } from "./defaultDiagram.js";

export function createModelerDiagramActions({ modeler, status }) {
  const canvas = modeler.get("canvas");

  const fitCanvas = () => {
    canvas.zoom("fit-viewport");
  };

  const loadDiagram = async (xml, label) => {
    try {
      await modeler.importXML(xml);
      fitCanvas();
      status.markDiagramLoaded(label);
    } catch (error) {
      status.markDiagramLoadFailed();
      console.error("Failed to load diagram", error);
    }
  };

  return {
    fitCanvas,
    loadDefaultDiagram: () => loadDiagram(createDefaultDiagram(), "默认空白流程"),
    loadDiagram,
    saveSvg: async () => {
      const { svg } = await modeler.saveSVG();
      downloadFile(svg, "workflow.svg", "image/svg+xml;charset=utf-8");
    },
    saveXml: async () => {
      const { xml } = await modeler.saveXML({ format: true });
      downloadFile(xml, "workflow.bpmn", "application/xml;charset=utf-8");
      status.markSaved();
    },
  };
}
