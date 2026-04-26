function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderLogs(container, logs) {
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

export function buildNodeDetailHtml(detail) {
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
    <article class="tracking-node-pop tracking-node-detail">
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

export function buildFallbackNodeDetail(viewer, scenario, nodeId) {
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

export function buildEmptyNodeDetailHtml() {
  return `
    <article class="tracking-node-empty">
      <h5>未选择节点</h5>
      <p>点击流程图中的节点后，这里显示节点定义、处理人和历史事件。</p>
    </article>
  `;
}

export function getDefaultSelectedNodeId(scenario) {
  return scenario.defaultNodeId
    || scenario.markers.error?.[0]
    || scenario.markers.current?.[0]
    || scenario.markers.completed?.at(-1)
    || Object.keys(scenario.nodeDetails || {})[0]
    || "";
}

export function isSelectableElement(element) {
  if (!element) {
    return false;
  }

  if (element.type === "label" || element.waypoints) {
    return false;
  }

  const businessObjectType = element.businessObject?.$type;
  return businessObjectType !== "bpmn:Process";
}
