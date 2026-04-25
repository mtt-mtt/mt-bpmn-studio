import { is } from "bpmn-js/lib/util/ModelUtil";

const OVERLAY_TYPE = "experiment-marker";

function marker(label, tone = "neutral") {
  const badge = document.createElement("div");
  badge.className = `experiment-badge is-${tone}`;
  badge.textContent = label;
  return badge;
}

function getMarkerConfig(element) {
  if (is(element, "bpmn:UserTask")) {
    return { label: "审批", tone: "approval" };
  }

  if (is(element, "bpmn:ServiceTask")) {
    return { label: "自动", tone: "service" };
  }

  if (is(element, "bpmn:Gateway")) {
    return { label: "条件", tone: "gateway" };
  }

  if (is(element, "bpmn:StartEvent")) {
    return { label: "开始", tone: "event" };
  }

  if (is(element, "bpmn:EndEvent")) {
    return { label: "结束", tone: "event" };
  }

  return null;
}

export default function ExperimentOverlays(eventBus, elementRegistry, overlays) {
  function refresh() {
    overlays.remove({ type: OVERLAY_TYPE });

    elementRegistry.forEach((element) => {
      if (element.labelTarget || element.waypoints) {
        return;
      }

      const config = getMarkerConfig(element);
      if (!config) {
        return;
      }

      overlays.add(element, OVERLAY_TYPE, {
        position: {
          top: -10,
          right: -10,
        },
        scale: {
          min: 0.8,
          max: 1.2,
        },
        html: marker(config.label, config.tone),
      });
    });
  }

  eventBus.on(["import.done", "commandStack.changed", "element.changed"], 250, () => {
    window.requestAnimationFrame(refresh);
  });

  this.refresh = refresh;
}

ExperimentOverlays.$inject = ["eventBus", "elementRegistry", "overlays"];
