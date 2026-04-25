import { getLanguage, setLanguage } from "../i18n/translations.js";

const ICONS = {
  hand: '<svg viewBox="0 0 24 24"><path d="M8 11V6a2 2 0 1 1 4 0v5"/><path d="M12 11V5a2 2 0 1 1 4 0v7"/><path d="M16 12V8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-1a8 8 0 0 1-8-8v-3a2 2 0 1 1 4 0v2"/><path d="M8 11v2"/></svg>',
  lasso: '<svg viewBox="0 0 24 24" stroke-dasharray="2 2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
  space: '<svg viewBox="0 0 24 24"><path d="M8 3v18M16 3v18M4 12h4m-2-2 2 2-2 2M20 12h-4m2-2-2 2 2 2"/></svg>',
  connect: '<svg viewBox="0 0 24 24"><circle cx="6" cy="7" r="3"/><circle cx="18" cy="17" r="3"/><path d="M8.5 8.8C12 10 12 14 15.5 15.2"/><path d="M14.8 12.4l1.1 2.8-3 .4"/></svg>',
  zoomIn: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  zoomOut: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  fit: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>',
  reset: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
  minimap: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="6" y="8" width="5" height="4" rx="1"/><path d="M14 9h4M14 13h4M7 16h10"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  undo: '<svg viewBox="0 0 24 24"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>',
  redo: '<svg viewBox="0 0 24 24"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>',
  close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

function button(icon, title, onClick, className = "") {
  const control = document.createElement("button");
  control.type = "button";
  control.innerHTML = icon;
  control.title = title;
  control.className = `experiment-toolbar-btn ${className}`.trim();
  control.setAttribute("aria-label", title);
  control.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event, control);
  });
  return control;
}

const TOOLBAR_LABELS = {
  hand: { zh: "\u6293\u624b\u5de5\u5177", en: "Hand tool" },
  lasso: { zh: "\u6846\u9009\u5de5\u5177", en: "Lasso tool" },
  space: { zh: "\u62c9\u4f38\u7a7a\u95f4\u5de5\u5177", en: "Create/remove space tool" },
  connect: { zh: "\u5168\u5c40\u8fde\u7ebf\u5de5\u5177", en: "Global connect tool" },
  zoomIn: { zh: "\u653e\u5927", en: "Zoom in" },
  zoomOut: { zh: "\u7f29\u5c0f", en: "Zoom out" },
  fit: { zh: "\u9002\u914d\u753b\u5e03", en: "Fit viewport" },
  reset: { zh: "\u5237\u65b0\u6807\u8bb0", en: "Refresh markers" },
  minimapOpen: { zh: "\u6253\u5f00\u5c0f\u5730\u56fe", en: "Open minimap" },
  minimapClose: { zh: "\u5173\u95ed\u5c0f\u5730\u56fe", en: "Close minimap" },
  simulation: { zh: "\u5207\u6362 Token Simulation", en: "Toggle Token Simulation" },
  languageToEnglish: { zh: "\u5207\u6362\u5230\u82f1\u6587", en: "Switch to English" },
  languageToChinese: { zh: "\u5207\u6362\u5230\u4e2d\u6587", en: "Switch to Chinese" },
  undo: { zh: "\u64a4\u9500", en: "Undo" },
  redo: { zh: "\u91cd\u505a", en: "Redo" },
};

function label(key) {
  return TOOLBAR_LABELS[key][getLanguage()];
}

function setButtonLabel(control, key) {
  const title = label(key);
  control.title = title;
  control.setAttribute("aria-label", title);
}

function toolbarButton(icon, labelKey, onClick, className = "") {
  const control = button(icon, label(labelKey), onClick, className);
  control.dataset.labelKey = labelKey;
  return control;
}

function refreshToolbarLabels(controls) {
  controls.querySelectorAll("[data-label-key]").forEach((control) => {
    setButtonLabel(control, control.dataset.labelKey);
  });
}

function divider() {
  const element = document.createElement("span");
  element.className = "experiment-canvas-controls-divider";
  return element;
}

function languageButton(eventBus, controls) {
  const control = document.createElement("button");
  control.type = "button";
  control.className = "experiment-toolbar-btn experiment-language-btn";

  const update = () => {
    const language = getLanguage();
    control.textContent = language === "zh" ? "\u4e2d" : "EN";
    setButtonLabel(control, language === "zh" ? "languageToEnglish" : "languageToChinese");
  };

  control.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    setLanguage(getLanguage() === "zh" ? "en" : "zh");
    update();
    refreshToolbarLabels(controls);
    eventBus.fire("i18n.changed");
  });

  update();

  return control;
}

function minimapButton(eventBus, minimap) {
  const control = toolbarButton(ICONS.minimap, "minimapOpen", () => {
    minimap.toggle();
    update();
  });

  const update = () => {
    const isOpen = minimap.isOpen();
    control.classList.toggle("is-active", isOpen);
    control.dataset.labelKey = isOpen ? "minimapClose" : "minimapOpen";
    setButtonLabel(control, control.dataset.labelKey);
  };

  eventBus.on("minimap.toggle", update);
  update();

  return control;
}

function toolButton(control, tool) {
  control.dataset.tool = tool;
  return control;
}

function updateToolButtons(controls, toolManager) {
  controls.querySelectorAll(".experiment-toolbar-btn.is-tool").forEach((buttonElement) => {
    buttonElement.classList.toggle("is-active", toolManager.isActive(buttonElement.dataset.tool));
  });
}

function bindToolStateSync(eventBus, controls, toolManager) {
  const sync = () => {
    window.requestAnimationFrame(() => updateToolButtons(controls, toolManager));
  };

  eventBus.on([
    "tool-manager.update",
    "drag.cleanup",
    "element.dblclick",
    "selection.changed",
    "directEditing.activate",
    "directEditing.complete",
    "directEditing.cancel",
  ], sync);

  sync();
}

function globalConnectButton(globalConnect) {
  const control = toolbarButton(ICONS.connect, "connect", (event) => {
    if (globalConnect.isActive()) {
      globalConnect.toggle();
    } else {
      globalConnect.start(event, true);
    }
  }, "is-tool");

  return toolButton(control, "global-connect");
}

export default function CanvasControls(
  canvas,
  commandStack,
  eventBus,
  minimap,
  simulationSupport,
  toolManager,
  handTool,
  lassoTool,
  spaceTool,
  globalConnect,
) {
  const container = canvas.getContainer();
  const controls = document.createElement("div");
  controls.className = "experiment-canvas-controls";

  controls.append(
    toolButton(toolbarButton(ICONS.hand, "hand", (event) => {
      handTool.activateHand(event);
    }, "is-tool"), "hand"),
    toolButton(toolbarButton(ICONS.lasso, "lasso", (event) => {
      lassoTool.activateSelection(event);
    }, "is-tool"), "lasso"),
    toolButton(toolbarButton(ICONS.space, "space", (event) => {
      spaceTool.activateSelection(event);
    }, "is-tool"), "space"),
    globalConnectButton(globalConnect),
    divider(),
    toolbarButton(ICONS.zoomIn, "zoomIn", () => canvas.zoom(Math.min(canvas.zoom() + 0.15, 4))),
    toolbarButton(ICONS.zoomOut, "zoomOut", () => canvas.zoom(Math.max(canvas.zoom() - 0.15, 0.25))),
    toolbarButton(ICONS.fit, "fit", () => canvas.zoom("fit-viewport")),
    toolbarButton(ICONS.reset, "reset", () => {
      eventBus.fire("element.changed", { element: canvas.getRootElement() });
    }),
    minimapButton(eventBus, minimap),
    divider(),
    toolbarButton(ICONS.play, "simulation", () => simulationSupport.toggleSimulation()),
    languageButton(eventBus, controls),
    divider(),
    toolbarButton(ICONS.undo, "undo", () => commandStack.undo()),
    toolbarButton(ICONS.redo, "redo", () => commandStack.redo()),
  );

  container.appendChild(controls);
  bindToolStateSync(eventBus, controls, toolManager);
}

CanvasControls.$inject = [
  "canvas",
  "commandStack",
  "eventBus",
  "minimap",
  "simulationSupport",
  "toolManager",
  "handTool",
  "lassoTool",
  "spaceTool",
  "globalConnect",
];
