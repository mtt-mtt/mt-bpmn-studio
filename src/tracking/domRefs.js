export function getTrackingDomRefs(root) {
  return {
    autoStatus: root.querySelector('[data-role="tracking-auto-status"]'),
    banner: root.querySelector('[data-role="tracking-banner"]'),
    document: root.querySelector('[data-role="tracking-document"]'),
    logList: root.querySelector('[data-role="tracking-log-list"]'),
    nodeDetail: root.querySelector('[data-role="tracking-node-detail"]'),
    panels: [...root.querySelectorAll("[data-tracking-panel]")],
    scenarioButtons: [...root.querySelectorAll("[data-scenario]")],
    state: root.querySelector('[data-role="tracking-state"]'),
    tabs: [...root.querySelectorAll("[data-tracking-tab]")],
    title: root.querySelector('[data-role="tracking-title"]'),
    tools: [...root.querySelectorAll("[data-tracking-tool]")],
    trigger: root.querySelector('[data-role="tracking-trigger"]'),
  };
}
