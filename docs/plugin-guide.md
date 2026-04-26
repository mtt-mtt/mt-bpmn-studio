# 插件扩展指南

本文档说明如何在 BPMN 能力实验场中新增或调整建模器能力。当前项目基于 `bpmn-js` 的模块机制组织插件，所有新增能力都应尽量保持独立模块、集中注册、可开关。

## 插件入口

建模器创建入口在：

```text
src/modeler/createModeler.js
```

该文件只负责创建 `BpmnModeler`。实际能力模块在：

```text
src/modeler/modules.js
```

能力开关在：

```text
src/modeler/features.js
```

如果新增插件，应优先做到：

1. 在 `src/modeler/<feature>/` 下创建独立目录。
2. 在该目录提供 `index.js` 作为 bpmn-js module 导出入口。
3. 在 `src/modeler/modules.js` 中按能力分组注册。
4. 如需可开关，在 `src/modeler/features.js` 中增加布尔配置。
5. 更新 README 或架构文档。

## 推荐目录形态

```text
src/modeler/my-feature/
  index.js
  MyFeatureProvider.js
```

`index.js` 示例：

```js
import MyFeatureProvider from "./MyFeatureProvider.js";

export default {
  __init__: ["myFeatureProvider"],
  myFeatureProvider: ["type", MyFeatureProvider],
};
```

Provider 示例：

```js
export default function MyFeatureProvider(eventBus) {
  eventBus.on("import.done", () => {
    // feature logic
  });
}

MyFeatureProvider.$inject = ["eventBus"];
```

## Palette 扩展

当前自定义 Palette 位于：

```text
src/modeler/palette/
```

如果要新增 BPMN 元素入口，应优先修改 `StudioPaletteProvider.js` 中的分组和 entries。新增时需要确认：

- 元素类型是否是 bpmn-js 支持的 BPMN 类型。
- 是否需要 event definition。
- 是否需要特殊属性，如 `isExpanded`、`cancelActivity`、`triggeredByEvent`。
- 中文和英文 label 是否需要同步到 i18n。

## 属性面板扩展

当前自定义属性扩展位于：

```text
src/modeler/properties/
```

新增字段时应注意：

- 字段 id 保持稳定。
- 自定义属性统一使用 `data-studio-*` 命名。
- 不要把外部业务系统字段直接写死到通用实验场。
- 如果字段只对特定 BPMN 类型有效，应在 provider 中按类型判断。

## 自定义渲染

当前自定义渲染位于：

```text
src/modeler/custom-rendering/
```

新增渲染规则时应优先保证：

- BPMN 语义不变，只调整视觉。
- 颜色、边框、图标不要破坏 color picker 的用户设置。
- Token Simulation 等模式开启时不要覆盖用户自定义颜色。

## 建模规则

当前建模规则位于：

```text
src/modeler/rules/
```

规则适合用来限制不合法建模行为，例如禁止某些连线、限制某些节点类型或控制边界事件放置。新增规则时应明确：

- 是业务规则还是 BPMN 语法规则。
- 是否应该只在实验场开启。
- 是否需要在 lint 中提供对应提示。

## 追踪能力

追踪模式不直接复用 Modeler，而是使用 Viewer：

```text
src/viewer/createViewer.js
src/tracking/
```

新增追踪场景时，应放在：

```text
src/tracking/scenarios/
```

并在 `src/tracking/mockData.js` 中聚合导出。运行态 marker 映射统一在：

```text
src/tracking/markers.js
```

## 样式扩展

应用壳样式入口：

```text
src/styles/app.css
```

BPMN Studio 主题入口：

```text
src/styles/bpmn-studio-theme.css
```

新增样式时先判断属于哪一类：

- 应用布局：放到 `src/styles/app/`
- BPMN 主题：放到 `src/styles/theme/`
- 第三方插件覆盖：优先放到 `bpmn-plugin-overrides.css` 或 `bpmn-overrides.css`
- Palette 兼容规则：优先放到 `palette-compat.css`

不要直接把新样式堆回入口文件。

## 提交前检查

提交前至少运行：

```bash
npm run smoke
```

该命令会先检查关键文件结构，再执行生产构建。
