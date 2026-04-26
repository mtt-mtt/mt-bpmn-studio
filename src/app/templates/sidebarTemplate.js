export const sidebarTemplate = `
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
`;
