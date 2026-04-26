# 架构说明

本文档记录 BPMN 能力实验场当前的模块边界，方便后续继续重构、扩展插件或整理样式。

## 应用启动层

### `src/main.js`

项目入口。负责导入全局样式和调用 `bootstrapApp`。

### `src/app/bootstrap.js`

轻量启动壳。当前只做三件事：

1. 将 `appTemplate` 挂载到根节点。
2. 通过 `getDomRefs` 收集关键 DOM 引用。
3. 创建并启动 `workbench`。

### `src/app/workbench.js`

工作台组装层。负责创建：

- `BpmnModeler`
- `BpmnViewer`
- `modelerController`
- `trackingController`
- `viewController`
- `toolbarController`

并在 `start()` 中完成默认流程加载、追踪场景加载、初始状态设置和事件绑定。

## 控制器分层

### `src/modeler/controller.js`

管理建模模式操作：

- 加载默认 BPMN。
- 导入 BPMN 文件。
- 导出 XML / SVG。
- 适配建模画布。
- 撤销 / 重做。
- BPMN lint 开关。
- Token Simulation 开关。
- 脏状态、lint 状态、simulation 状态维护。

### `src/tracking/controller.js`

管理追踪模式操作：

- 加载追踪场景。
- 导入 viewer XML。
- 切换追踪场景按钮状态。
- 切换节点详情 / 事件日志 tab。
- 处理 viewer 节点点击和画布点击。
- 适配、放大、缩小、刷新追踪画布。

追踪 DOM 引用在 `tracking/domRefs.js`，追踪 marker 映射在 `tracking/markers.js`，追踪 HTML 渲染在 `tracking/rendering.js`。

### `src/app/viewController.js`

管理建模模式和追踪模式切换：

- 显示 / 隐藏对应工作区。
- 更新顶部模式按钮激活态。
- 更新左侧状态中的当前视图。
- 进入追踪模式时适配 viewer 画布。

### `src/app/toolbarController.js`

管理左侧工具栏按钮：

- 新建空白图。
- 导入 BPMN。
- 适配当前画布。
- 切换校验。
- 切换模拟。
- 撤销 / 重做。
- 导出 XML / SVG。

## 建模器插件层

### `src/modeler/createModeler.js`

只负责创建 `BpmnModeler`，传入：

- 画布容器。
- 属性面板容器。
- lint 配置。
- `modelerModules`。

### `src/modeler/assets.js`

集中导入 `bpmn-js` 与插件所需 CSS 资源。

### `src/modeler/modules.js`

集中维护建模器模块清单，并按能力分组：

- `canvasSupportModules`：小地图、网格等画布支撑能力。
- `productivityModules`：复制粘贴、颜色、lint、simulation 等效率能力。
- `propertiesPanelModules`：标准属性面板和自定义属性扩展。
- `studioExtensionModules`：i18n、自定义渲染、规则、palette、画布控件。

### `src/modeler/features.js`

集中维护建模器能力开关。当前默认全部开启，保证能力实验场功能完整。后续如果需要做轻量版、只读版或按需加载，可以优先从这里调整：

- `minimap`
- `grid`
- `nativeCopyPaste`
- `colorPicker`
- `lint`
- `simulation`
- `propertiesPanel`
- `studioProperties`
- `i18n`
- `customRendering`
- `workflowRules`
- `studioPalette`
- `canvasControls`

## 样式分层

### `src/styles/app.css`

应用外壳样式入口，按原顺序导入：

- `app/base.css`
- `app/sidebar.css`
- `app/workspace.css`
- `app/modeler-panel.css`
- `app/tracking-panel.css`
- `app/bpmn-plugin-overrides.css`
- `app/responsive.css`

### `src/styles/bpmn-studio-theme.css`

BPMN Studio 主题入口，按原顺序导入：

- `theme/tokens.css`
- `theme/tracking-workbench.css`
- `theme/modeler-surface.css`
- `theme/palette-compat.css`
- `theme/bpmn-overrides.css`
- `theme/viewport-layout.css`

当前样式已经完成保序拆分。后续清理重复规则时，应按文件逐块处理，并在每次改动后运行构建和浏览器检查。

## 推荐后续治理

1. 清理 `palette-compat.css` 中历史遗留的 palette 兼容规则。
2. 继续完善追踪场景数据，必要时为每个场景增加独立说明。
3. 增加最小 smoke test，覆盖默认启动和构建。
4. 继续补充插件开发说明，帮助后续新增 BPMN 能力。

插件开发细节见 [插件扩展指南](plugin-guide.md)。
