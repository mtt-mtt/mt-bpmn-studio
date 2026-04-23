import { createModeler } from "../modeler/createModeler.js";
import { createDefaultDiagram } from "../modeler/defaultDiagram.js";
import { trackingScenarios } from "../tracking/mockData.js";
import { createViewer } from "../viewer/createViewer.js";

const appTemplate = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-kicker">bpmnPJ</div>
        <h1>BPMN 能力实验场</h1>
        <p>左侧保留建模能力，右侧用于验证运行态追踪。追踪模式下点击节点，会直接在流程图上方弹出节点详情气泡。</p>
      </div>

      <section class="panel">
        <h2>当前阶段</h2>
        <ul class="phase-list">
          <li class="is-active">P0 项目初始化</li>
          <li class="is-active">P1 最小 Modeler</li>
          <li class="is-active">P2 基础插件混装</li>
          <li class="is-active">P3 标准属性面板</li>
          <li class="is-active">P4 BPMN 校验</li>
          <li class="is-active">P5 模拟与追踪原型</li>
        </ul>
      </section>

      <section class="panel">
        <h2>工具栏</h2>
        <div class="tool-grid">
          <button type="button" data-action="new">新建空白图</button>
          <button type="button" data-action="open">导入 BPMN</button>
          <button type="button" data-action="fit">适配画布</button>
          <button type="button" data-action="toggle-lint">切换校验</button>
          <button type="button" data-action="toggle-simulation">切换模拟</button>
          <button type="button" data-action="undo">撤销</button>
          <button type="button" data-action="redo">重做</button>
          <button type="button" data-action="save-xml">导出 XML</button>
          <button type="button" data-action="save-svg">导出 SVG</button>
        </div>
        <input class="hidden-input" type="file" accept=".bpmn,.xml" data-role="file-input" />
      </section>

      <section class="panel">
        <h2>状态</h2>
        <dl class="status-list">
          <div>
            <dt>引擎</dt>
            <dd data-role="engine-status">初始化中</dd>
          </div>
          <div>
            <dt>图形</dt>
            <dd data-role="diagram-status">未加载</dd>
          </div>
          <div>
            <dt>变更</dt>
            <dd data-role="dirty-status">无</dd>
          </div>
          <div>
            <dt>校验</dt>
            <dd data-role="lint-status">未启用</dd>
          </div>
          <div>
            <dt>模拟</dt>
            <dd data-role="simulation-status">未启用</dd>
          </div>
          <div>
            <dt>视图</dt>
            <dd data-role="view-status">建模模式</dd>
          </div>
        </dl>
      </section>
    </aside>

    <main class="workspace">
      <header class="workspace-header">
        <div>
          <div class="workspace-kicker">Workbench</div>
          <h2>BPMN 建模 / 追踪双模式</h2>
        </div>
        <div class="workspace-actions">
          <div class="workspace-view-switch">
            <button type="button" class="is-active" data-view="modeler">建模模式</button>
            <button type="button" data-view="tracking">追踪模式</button>
          </div>
          <div class="workspace-tags">
            <span>bpmn-js</span>
            <span>properties panel</span>
            <span>lint</span>
            <span>simulation</span>
            <span>tracking</span>
          </div>
        </div>
      </header>

      <section class="canvas-card canvas-card-split" data-panel="modeler">
        <div class="canvas-host" data-role="canvas"></div>
        <aside class="properties-host" data-role="properties-panel">
          <div class="properties-placeholder">
            <div class="properties-kicker">Properties</div>
            <h3>标准属性面板</h3>
            <p>选中开始事件、任务、网关或连接线后，在这里查看和编辑标准 BPMN 属性。</p>
          </div>
        </aside>
      </section>

      <section class="tracking-card" data-panel="tracking" hidden>
        <div class="tracking-header">
          <div>
            <div class="workspace-kicker">Tracking</div>
            <h3 data-role="tracking-title">流程追踪工作台</h3>
            <div class="tracking-meta">
              <span>单据：</span>
              <strong data-role="tracking-document">-</strong>
              <span class="tracking-dot-sep">·</span>
              <span>触发来源：</span>
              <strong data-role="tracking-trigger">-</strong>
            </div>
          </div>
          <div class="tracking-header-actions">
            <div class="tracking-scenarios">
              <button type="button" class="is-active" data-scenario="running">进行中</button>
              <button type="button" data-scenario="exception">系统异常</button>
            </div>
            <span class="tracking-state-tag" data-role="tracking-state">-</span>
          </div>
        </div>

        <div class="tracking-body">
          <div class="tracking-canvas-wrap">
            <div class="tracking-banner" data-role="tracking-banner" hidden></div>
            <div class="tracking-canvas-host" data-role="tracking-canvas"></div>
          </div>
          <aside class="tracking-timeline">
            <div class="tracking-timeline-header">
              <h4>审批轨迹</h4>
              <div class="tracking-auto-status" data-role="tracking-auto-status" hidden></div>
            </div>
            <div class="tracking-log-list" data-role="tracking-log-list"></div>
          </aside>
        </div>
      </section>
    </main>
  </div>
`;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function renderLogs(container, logs) {
  container.innerHTML = logs.map((log) => `
    <article class="tracking-log-item">
      <div class="tracking-log-dot" data-type="${escapeHtml(log.type)}"></div>
      <div class="tracking-log-card">
        <div class="tracking-log-top">
          <strong>${escapeHtml(log.actor)}</strong>
          <span>${escapeHtml(log.time)}</span>
        </div>
        <div class="tracking-log-title" data-type="${escapeHtml(log.type)}">${escapeHtml(log.title)}</div>
        <div class="tracking-log-message">${escapeHtml(log.message)}</div>
      </div>
    </article>
  `).join("");
}

function buildNodeOverlayHtml(detail) {
  const definitionItems = (detail.definitionRows || [])
    .slice(0, 3)
    .map((row) => `
      <div class="tracking-node-pop-row">
        <span>${escapeHtml(row.label)}</span>
        <strong>${escapeHtml(row.value)}</strong>
      </div>
    `)
    .join("");

  const eventItems = (detail.events || [])
    .slice(0, 2)
    .map((event) => `
      <div class="tracking-node-pop-event">
        <div class="tracking-node-pop-event-top">
          <strong>${escapeHtml(event.title)}</strong>
          <span>${escapeHtml(event.time)}</span>
        </div>
        <div class="tracking-node-pop-event-meta">${escapeHtml(event.actor)}</div>
        <div class="tracking-node-pop-event-message">${escapeHtml(event.message)}</div>
      </div>
    `)
    .join("");

  return `
    <article class="tracking-node-pop">
      <div class="tracking-node-pop-arrow"></div>
      <div class="tracking-node-pop-head">
        <div>
          <div class="tracking-node-pop-kicker">${escapeHtml(detail.nodeTypeLabel)}</div>
          <h5>${escapeHtml(detail.nodeName)}</h5>
        </div>
        <span class="tracking-node-state ${escapeHtml(detail.runtimeStateClass || "")}">${escapeHtml(detail.runtimeStateLabel)}</span>
      </div>
      <div class="tracking-node-pop-meta">
        <div class="tracking-node-pop-row">
          <span>处理人</span>
          <strong>${escapeHtml(detail.ownerLabel || "-")}</strong>
        </div>
        <div class="tracking-node-pop-row">
          <span>激活时间</span>
          <strong>${escapeHtml(detail.activatedAt || "-")}</strong>
        </div>
      </div>
      ${definitionItems ? `<div class="tracking-node-pop-section">${definitionItems}</div>` : ""}
      ${eventItems ? `<div class="tracking-node-pop-section tracking-node-pop-section-events">${eventItems}</div>` : ""}
    </article>
  `;
}

function applyViewerMarkers(viewer, scenario) {
  const canvas = viewer.get("canvas");
  Object.entries({
    "tracking-marker-completed": scenario.markers.completed || [],
    "tracking-marker-current": scenario.markers.current || [],
    "tracking-marker-pending": scenario.markers.pending || [],
    "tracking-marker-error": scenario.markers.error || [],
  }).forEach(([markerClass, ids]) => {
    ids.forEach((id) => canvas.addMarker(id, markerClass));
  });
}

function getElementTypeLabel(element) {
  const type = element?.businessObject?.$type || element?.type || "";
  const shortType = type.split(":").pop();

  const labels = {
    StartEvent: "开始事件",
    EndEvent: "结束事件",
    UserTask: "人工审批",
    ServiceTask: "自动任务",
    ExclusiveGateway: "排他网关",
    ParallelGateway: "并行网关",
    SequenceFlow: "连线",
  };

  return labels[shortType] || shortType || "流程节点";
}

function buildFallbackNodeDetail(viewer, scenario, nodeId) {
  const element = viewer.get("elementRegistry").get(nodeId);
  const nodeName = element?.businessObject?.name || nodeId;

  return {
    nodeId,
    nodeName,
    nodeTypeLabel: getElementTypeLabel(element),
    runtimeStateLabel: "未配置详情",
    runtimeStateClass: "is-muted",
    ownerLabel: "-",
    activatedAt: "-",
    completedAt: "-",
    definitionRows: [
      { label: "来源场景", value: scenario.title },
      { label: "说明", value: "当前节点还没有配置专门的 mock 详情数据" },
    ],
    events: [],
  };
}

function getDefaultSelectedNodeId(scenario) {
  return scenario.defaultNodeId
    || scenario.markers.error?.[0]
    || scenario.markers.current?.[0]
    || scenario.markers.completed?.at(-1)
    || Object.keys(scenario.nodeDetails || {})[0]
    || "";
}

function isSelectableElement(element) {
  if (!element) {
    return false;
  }

  if (element.type === "label" || element.waypoints) {
    return false;
  }

  const businessObjectType = element.businessObject?.$type;
  return businessObjectType !== "bpmn:Process";
}

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
  const trackingTitle = root.querySelector('[data-role="tracking-title"]');
  const trackingDocument = root.querySelector('[data-role="tracking-document"]');
  const trackingTrigger = root.querySelector('[data-role="tracking-trigger"]');
  const trackingState = root.querySelector('[data-role="tracking-state"]');
  const trackingBanner = root.querySelector('[data-role="tracking-banner"]');
  const trackingAutoStatus = root.querySelector('[data-role="tracking-auto-status"]');
  const trackingLogList = root.querySelector('[data-role="tracking-log-list"]');

  const modeler = createModeler(canvas, propertiesPanel);
  const viewer = createViewer(trackingCanvas);
  const linting = modeler.get("linting");
  const simulationSupport = modeler.get("simulationSupport");
  const eventBus = modeler.get("eventBus");
  const viewerCanvas = viewer.get("canvas");
  const viewerEventBus = viewer.get("eventBus");
  const viewerOverlays = viewer.get("overlays");
  const elementRegistry = viewer.get("elementRegistry");

  let currentScenarioKey = "running";
  let activeTrackingNodeId = "";
  let activeOverlayId = null;

  engineStatus.textContent = "已就绪";

  const clearNodeOverlay = () => {
    if (activeOverlayId !== null) {
      viewerOverlays.remove(activeOverlayId);
      activeOverlayId = null;
    }
  };

  const setDirtyState = (isDirty) => {
    dirtyStatus.textContent = isDirty ? "有未导出修改" : "无";
  };

  const setLintState = () => {
    lintStatus.textContent = linting.isActive() ? "推荐规则已开启" : "已关闭";
  };

  const setSimulationState = (active) => {
    simulationStatus.textContent = active ? "Token Simulation 已开启" : "已关闭";
  };

  const fitTrackingCanvas = () => {
    const width = trackingCanvas.clientWidth;
    const height = trackingCanvas.clientHeight;

    if (!width || !height) {
      return;
    }

    viewerCanvas.resized();
    viewerCanvas.zoom("fit-viewport");
  };

  const setActiveTrackingNode = (nodeId) => {
    const scenario = trackingScenarios[currentScenarioKey];

    clearNodeOverlay();

    if (!nodeId) {
      if (activeTrackingNodeId) {
        viewerCanvas.removeMarker(activeTrackingNodeId, "tracking-marker-selected");
      }
      activeTrackingNodeId = "";
      return;
    }

    if (activeTrackingNodeId && activeTrackingNodeId !== nodeId) {
      viewerCanvas.removeMarker(activeTrackingNodeId, "tracking-marker-selected");
    }

    activeTrackingNodeId = nodeId;
    viewerCanvas.addMarker(nodeId, "tracking-marker-selected");

    const element = elementRegistry.get(nodeId);
    if (!element) {
      return;
    }

    const detail = scenario.nodeDetails?.[nodeId] || buildFallbackNodeDetail(viewer, scenario, nodeId);
    const html = document.createElement("div");
    html.className = "tracking-node-pop-shell";
    html.innerHTML = buildNodeOverlayHtml(detail);

    activeOverlayId = viewerOverlays.add(nodeId, {
      position: {
        left: Math.round((element.width || 0) / 2),
        top: -184,
      },
      html,
    });
  };

  const setView = (view) => {
    const isTracking = view === "tracking";
    modelerPanel.hidden = isTracking;
    trackingPanel.hidden = !isTracking;
    viewStatus.textContent = isTracking ? "追踪模式" : "建模模式";

    root.querySelectorAll("[data-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });

    if (isTracking) {
      requestAnimationFrame(() => {
        fitTrackingCanvas();
        if (activeTrackingNodeId) {
          setActiveTrackingNode(activeTrackingNodeId);
        }
      });
    } else {
      clearNodeOverlay();
    }
  };

  const loadTrackingScenario = async (scenarioKey) => {
    const scenario = trackingScenarios[scenarioKey];
    currentScenarioKey = scenarioKey;
    activeTrackingNodeId = "";
    clearNodeOverlay();

    await viewer.importXML(scenario.xml);

    if (!trackingPanel.hidden) {
      fitTrackingCanvas();
    }

    applyViewerMarkers(viewer, scenario);

    trackingTitle.textContent = scenario.title;
    trackingDocument.textContent = scenario.documentLabel;
    trackingTrigger.textContent = scenario.triggerLabel;
    trackingState.textContent = scenario.stateLabel;
    trackingState.className = `tracking-state-tag ${scenario.stateClass}`;
    trackingBanner.hidden = !scenario.exceptionMessage;
    trackingBanner.textContent = scenario.exceptionMessage;
    trackingAutoStatus.hidden = !scenario.autoStatus;
    trackingAutoStatus.textContent = scenario.autoStatus;
    renderLogs(trackingLogList, scenario.logs);

    root.querySelectorAll("[data-scenario]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.scenario === scenarioKey);
    });

    setActiveTrackingNode(getDefaultSelectedNodeId(scenario));
  };

  modeler.on("commandStack.changed", () => {
    setDirtyState(true);
  });

  eventBus.on("tokenSimulation.toggleMode", (event) => {
    setSimulationState(Boolean(event.active));
  });

  viewerEventBus.on("element.click", ({ element }) => {
    if (!isSelectableElement(element)) {
      return;
    }

    setActiveTrackingNode(element.id);
  });

  viewerEventBus.on("canvas.click", () => {
    setActiveTrackingNode("");
  });

  async function loadDiagram(xml, label) {
    try {
      await modeler.importXML(xml);
      modeler.get("canvas").zoom("fit-viewport");
      diagramStatus.textContent = label;
      setDirtyState(false);
    } catch (error) {
      diagramStatus.textContent = "加载失败";
      console.error("Failed to load diagram", error);
    }
  }

  await loadDiagram(createDefaultDiagram(), "默认空白流程");
  await loadTrackingScenario(currentScenarioKey);
  setLintState();
  setSimulationState(false);
  setView("modeler");

  root.querySelector('[data-action="new"]').addEventListener("click", async () => {
    await loadDiagram(createDefaultDiagram(), "默认空白流程");
  });

  root.querySelector('[data-action="open"]').addEventListener("click", () => {
    fileInput.click();
  });

  root.querySelector('[data-action="fit"]').addEventListener("click", () => {
    if (!trackingPanel.hidden) {
      fitTrackingCanvas();
      if (activeTrackingNodeId) {
        setActiveTrackingNode(activeTrackingNodeId);
      }
      return;
    }

    modeler.get("canvas").zoom("fit-viewport");
  });

  root.querySelector('[data-action="toggle-lint"]').addEventListener("click", () => {
    linting.toggle();
    setLintState();
  });

  root.querySelector('[data-action="toggle-simulation"]').addEventListener("click", () => {
    simulationSupport.toggleSimulation();
  });

  root.querySelector('[data-action="undo"]').addEventListener("click", () => {
    modeler.get("commandStack").undo();
  });

  root.querySelector('[data-action="redo"]').addEventListener("click", () => {
    modeler.get("commandStack").redo();
  });

  root.querySelector('[data-action="save-xml"]').addEventListener("click", async () => {
    const { xml } = await modeler.saveXML({ format: true });
    downloadFile(xml, "workflow.bpmn", "application/xml;charset=utf-8");
    setDirtyState(false);
  });

  root.querySelector('[data-action="save-svg"]').addEventListener("click", async () => {
    const { svg } = await modeler.saveSVG();
    downloadFile(svg, "workflow.svg", "image/svg+xml;charset=utf-8");
  });

  fileInput.addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const xml = await file.text();
    await loadDiagram(xml, `已导入：${file.name}`);
    fileInput.value = "";
  });

  root.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
    });
  });

  root.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", async () => {
      await loadTrackingScenario(button.dataset.scenario);
    });
  });
}
