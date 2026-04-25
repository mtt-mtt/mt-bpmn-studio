import { getDi, isAny } from "bpmn-js/lib/util/ModelUtil";
import { TOGGLE_MODE_EVENT } from "bpmn-js-token-simulation/lib/util/EventHelper";

const ID = "preserve-di-colors";
const PRIORITY = 2000;
const PRIORITY_AFTER_ORIGINAL_SAVE = 40000;

function getColor(di, keys) {
  for (const key of keys) {
    const value = di?.get?.(key) || di?.[key];

    if (value) {
      return value;
    }
  }
}

function getElementColors(element) {
  const di = getDi(element);

  if (!di || !isAny(di, ["bpmndi:BPMNEdge", "bpmndi:BPMNShape"])) {
    return undefined;
  }

  const colors = {
    fill: getColor(di, ["background-color", "color:background-color", "bioc:fill", "fill"]),
    stroke: getColor(di, ["border-color", "color:border-color", "bioc:stroke", "stroke"]),
  };

  return colors.fill || colors.stroke ? colors : undefined;
}

export default function PreserveElementColors(eventBus, elementRegistry, elementColors) {
  eventBus.on(TOGGLE_MODE_EVENT, PRIORITY_AFTER_ORIGINAL_SAVE, ({ active }) => {
    if (!active) {
      return;
    }

    elementRegistry.forEach((element) => {
      const colors = getElementColors(element);

      if (colors) {
        elementColors.add(element, ID, colors, PRIORITY);
      }
    });
  });
}

PreserveElementColors.$inject = ["eventBus", "elementRegistry", "elementColors"];
