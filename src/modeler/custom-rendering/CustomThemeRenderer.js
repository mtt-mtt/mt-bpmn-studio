import inherits from "inherits-browser";
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import { is } from "bpmn-js/lib/util/ModelUtil";
import { attr as svgAttr } from "tiny-svg";

const HIGH_PRIORITY = 1500;

const COLORS = {
  border: "#6b7280",
  panel: "#ffffff",
  primary: "#714b67",
  success: "#017e84",
  warning: "#d9831f",
  connection: "#111827",
  muted: "#cbd5e1",
};

function hasColorOverride(element) {
  const di = element?.di;
  const get = di?.get?.bind(di);

  return Boolean(
    di?.fill
      || di?.stroke
      || di?.backgroundColor
      || di?.borderColor
      || di?.["bioc:fill"]
      || di?.["bioc:stroke"]
      || get?.("color:background-color")
      || get?.("color:border-color")
      || get?.("bioc:fill")
      || get?.("bioc:stroke")
  );
}

function getPrimaryVisual(parentGfx) {
  return parentGfx.querySelector("rect, circle, polygon, path");
}

function stylePrimaryVisual(parentGfx, shape) {
  if (hasColorOverride(shape)) {
    return;
  }

  const primary = getPrimaryVisual(parentGfx);
  if (!primary) {
    return;
  }

  if (is(shape, "bpmn:Task")) {
    svgAttr(primary, {
      fill: COLORS.panel,
      stroke: COLORS.border,
      "stroke-width": 2,
      rx: 4,
      ry: 4,
    });
    return;
  }

  if (is(shape, "bpmn:Gateway")) {
    svgAttr(primary, {
      fill: COLORS.panel,
      stroke: COLORS.border,
      "stroke-width": 2,
    });
    return;
  }

  if (is(shape, "bpmn:StartEvent")) {
    svgAttr(primary, {
      fill: COLORS.panel,
      stroke: COLORS.success,
      "stroke-width": 2,
    });
    return;
  }

  if (is(shape, "bpmn:EndEvent")) {
    svgAttr(primary, {
      fill: COLORS.panel,
      stroke: COLORS.border,
      "stroke-width": 3,
    });
    return;
  }

  if (is(shape, "bpmn:Event")) {
    svgAttr(primary, {
      fill: COLORS.panel,
      stroke: COLORS.border,
      "stroke-width": 2,
    });
  }
}

export default function CustomThemeRenderer(eventBus, bpmnRenderer) {
  BaseRenderer.call(this, eventBus, HIGH_PRIORITY);
  this.bpmnRenderer = bpmnRenderer;
}

inherits(CustomThemeRenderer, BaseRenderer);

CustomThemeRenderer.$inject = ["eventBus", "bpmnRenderer"];

CustomThemeRenderer.prototype.canRender = function(element) {
  return !element.labelTarget && (
    is(element, "bpmn:Task")
      || is(element, "bpmn:Gateway")
      || is(element, "bpmn:Event")
      || is(element, "bpmn:SequenceFlow")
  );
};

CustomThemeRenderer.prototype.drawShape = function(parentGfx, shape) {
  const renderedShape = this.bpmnRenderer.drawShape(parentGfx, shape);
  stylePrimaryVisual(parentGfx, shape);
  return renderedShape;
};

CustomThemeRenderer.prototype.drawConnection = function(parentGfx, connection) {
  if (hasColorOverride(connection)) {
    return this.bpmnRenderer.drawConnection(parentGfx, connection);
  }

  return this.bpmnRenderer.drawConnection(parentGfx, connection, {
    stroke: COLORS.connection,
    "stroke-width": 2,
  });
};

CustomThemeRenderer.prototype.getShapePath = function(shape) {
  return this.bpmnRenderer.getShapePath(shape);
};

CustomThemeRenderer.prototype.getConnectionPath = function(connection) {
  return this.bpmnRenderer.getConnectionPath(connection);
};
