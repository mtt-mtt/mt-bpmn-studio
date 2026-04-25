function button(label, title, onClick, className = "") {
  const control = document.createElement("button");
  control.type = "button";
  control.textContent = label;
  control.title = title;
  control.className = className;
  control.setAttribute("aria-label", title);
  control.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  });
  return control;
}

function countDesignIssues(elementRegistry) {
  let unnamedUserTasks = 0;
  let gatewayCount = 0;

  elementRegistry.forEach((element) => {
    const type = element.businessObject?.$type;

    if (type === "bpmn:UserTask" && !element.businessObject.name) {
      unnamedUserTasks++;
    }

    if (type?.includes("Gateway")) {
      gatewayCount++;
    }
  });

  return { unnamedUserTasks, gatewayCount };
}

function divider() {
  const element = document.createElement("span");
  element.className = "experiment-canvas-controls-divider";
  return element;
}

export default function CanvasControls(
  canvas,
  commandStack,
  elementRegistry,
  eventBus,
  linting,
  simulationSupport,
  handTool,
  lassoTool,
  spaceTool,
) {
  const container = canvas.getContainer();
  const controls = document.createElement("div");
  controls.className = "experiment-canvas-controls";

  controls.append(
    button("\u270b", "\u6293\u624b\u5de5\u5177", (event) => handTool.activateHand(event), "is-tool"),
    button("\u25a1", "\u6846\u9009\u5de5\u5177", (event) => lassoTool.activateSelection(event), "is-tool"),
    button("\u2194", "\u62c9\u4f38\u7a7a\u95f4\u5de5\u5177", (event) => spaceTool.activateSelection(event), "is-tool"),
    divider(),
    button("+", "\u653e\u5927", () => canvas.zoom(Math.min(canvas.zoom() + 0.15, 4))),
    button("-", "\u7f29\u5c0f", () => canvas.zoom(Math.max(canvas.zoom() - 0.15, 0.25))),
    button("\u26f6", "\u9002\u914d\u753b\u5e03", () => canvas.zoom("fit-viewport")),
    button("\u27f3", "\u5237\u65b0\u6807\u8bb0", () => {
      eventBus.fire("element.changed", { element: canvas.getRootElement() });
    }),
    button("!", "\u5feb\u901f\u6821\u9a8c", () => {
      const { unnamedUserTasks, gatewayCount } = countDesignIssues(elementRegistry);
      const lines = [
        `\u672a\u547d\u540d\u5ba1\u6279\u4efb\u52a1\uff1a${unnamedUserTasks}`,
        `\u7f51\u5173\u6570\u91cf\uff1a${gatewayCount}`,
      ];

      window.alert(lines.join("\n"));
    }),
    button("L", "\u5207\u6362 BPMN lint", () => linting.toggle()),
    button("\u25b6", "\u5207\u6362 Token Simulation", () => simulationSupport.toggleSimulation()),
    button("\u21b6", "\u64a4\u9500", () => commandStack.undo()),
    button("\u21b7", "\u91cd\u505a", () => commandStack.redo()),
  );

  container.appendChild(controls);
}

CanvasControls.$inject = [
  "canvas",
  "commandStack",
  "elementRegistry",
  "eventBus",
  "linting",
  "simulationSupport",
  "handTool",
  "lassoTool",
  "spaceTool",
];
