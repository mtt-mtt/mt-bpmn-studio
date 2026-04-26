export const trackingPanelTemplate = `
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
        <div class="tracking-canvas-host studio-theme-canvas" data-role="tracking-canvas">
          <div class="canvas-legend">
            <div class="legend-item"><span class="legend-dot is-completed"></span>已完成</div>
            <div class="legend-item"><span class="legend-dot is-current"></span>当前节点</div>
            <div class="legend-item"><span class="legend-dot is-pending"></span>抄送/非阻塞</div>
            <div class="legend-item"><span class="legend-dot is-error"></span>异常</div>
          </div>
          <div class="canvas-toolbar">
            <button type="button" class="icon-btn" data-tracking-tool="zoom-in" title="放大">+</button>
            <button type="button" class="icon-btn" data-tracking-tool="zoom-out" title="缩小">-</button>
            <button type="button" class="icon-btn" data-tracking-tool="fit" title="适配画布">⌖</button>
            <button type="button" class="icon-btn" data-tracking-tool="refresh" title="刷新画布">↻</button>
          </div>
        </div>
      </div>
      <aside class="tracking-timeline">
        <div class="tracking-timeline-header">
          <h4>审批轨迹</h4>
          <div class="tracking-auto-status" data-role="tracking-auto-status" hidden></div>
        </div>
        <div class="tracking-side-tabs">
          <button type="button" class="is-active" data-tracking-tab="detail">节点详情</button>
          <button type="button" data-tracking-tab="log">事件日志</button>
        </div>
        <div class="tracking-detail-card" data-tracking-panel="detail" data-role="tracking-node-detail"></div>
        <div class="tracking-log-list" data-tracking-panel="log" data-role="tracking-log-list" hidden></div>
      </aside>
    </div>
  </section>
`;
