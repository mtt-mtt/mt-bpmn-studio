export const appTemplate = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-kicker">bpmnPJ</div>
        <h1>BPMN 能力实验场</h1>
        <p>左侧保留建模能力，右侧用于验证运行态追踪。建模与追踪通过顶部切换整块工作区，节点详情固定显示在右侧面板。</p>
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
    </main>
  </div>
`;
