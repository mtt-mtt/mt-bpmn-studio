# BPMN 能力实验场

一个基于 `bpmn-js` 的 BPMN 建模与追踪能力实验项目。当前目标是把建模器、插件能力、运行态追踪视图和主题样式沉淀成一个相对规范、可继续扩展的独立前端项目。

## 功能概览

- BPMN 建模器：基于 `bpmn-js/Modeler`。
- 自定义 Palette：将常用 BPMN 元素和变体直接展开到左侧组件栏。
- 标准属性面板：集成 `bpmn-js-properties-panel`。
- 自定义属性扩展：提供通用流程扩展字段。
- BPMN 校验：集成 `bpmn-js-bpmnlint`。
- Token Simulation：集成流程模拟能力。
- 颜色选择：集成 `bpmn-js-color-picker`。
- 原生复制粘贴：集成 `bpmn-js-native-copy-paste` 和兜底模块。
- 小地图和网格：集成 `diagram-js-minimap`、`diagram-js-grid`。
- 中文 / 英文切换：通过自定义 translate 模块处理。
- 自定义渲染：提供更贴近工作台风格的 BPMN 图形展示。
- 追踪模式：使用 viewer 渲染运行态流程图，并展示节点详情和事件日志。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址通常是：

```text
http://localhost:5173/
```

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 目录结构

```text
src/
  app/                 应用启动、DOM 引用、工作台组装、视图和工具栏控制
  lint/                BPMN lint 配置
  modeler/             建模器创建、控制器、插件模块和本地扩展
  styles/              应用样式与 BPMN Studio 主题样式
  tracking/            追踪模式控制器、mock 数据、渲染和 marker 逻辑
  viewer/              追踪 viewer 创建
```

## 当前架构状态

入口文件已经被压缩为轻量启动壳：

- `src/main.js`：导入样式并启动应用。
- `src/app/bootstrap.js`：挂载模板、收集 DOM 引用、启动 workbench。
- `src/app/workbench.js`：创建 modeler、viewer 和各控制器。

建模、追踪、视图切换、工具栏已经拆成独立控制器，后续可以按模块继续扩展，而不需要把所有逻辑塞回入口文件。

## 开发约定

- 优先保持已有行为稳定，再做结构调整。
- 样式调整先按职责拆分，再逐步清理重复规则。
- 插件能力统一从 `src/modeler/modules.js` 查看和维护。
- 新增 BPMN 能力时，优先封装为独立模块并在 `modules.js` 中注册。
- 追踪模式相关逻辑放在 `src/tracking/` 下，不和建模器控制逻辑混在一起。

## 后续计划

- 继续清理历史重复 CSS，特别是 palette 和 BPMN 覆盖样式。
- 将追踪 mock 数据按场景拆分。
- 增加插件开关配置。
- 补充最小 smoke test。
- 完善更多开源项目说明和贡献约定。
