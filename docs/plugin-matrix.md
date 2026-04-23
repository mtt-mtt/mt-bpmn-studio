# 插件兼容矩阵

## 当前基线

| 组件 | 版本 | 状态 | 备注 |
| --- | --- | --- | --- |
| `bpmn-js` | `18.15.0` | 已接入 | 最小 Modeler 已运行 |
| `diagram-js-minimap` | `5.3.0` | 已接入 | 构建通过 |
| `diagram-js-grid` | `2.0.1` | 已接入 | 构建通过 |
| `bpmn-js-native-copy-paste` | `0.3.0` | 已接入 | 构建通过，待浏览器交互验证 |
| `bpmn-js-properties-panel` | `5.54.0` | 已接入 | 标准属性面板已挂载 |
| `@bpmn-io/properties-panel` | 自动安装 | 已接入 | 作为属性面板底层 UI 依赖 |
| `bpmn-js-bpmnlint` | `0.24.0` | 已接入 | 画布规则校验已接入 |
| `bpmnlint` | `11.12.1` | 已接入 | 使用本地基础规则集 |
| `bpmn-js-token-simulation` | `0.39.3` | 已接入 | Token Simulation 已接入 |

## 当前验证结论

1. 基础依赖可以在同一个 Vite 项目内正常混装。
2. 当前阶段没有出现打包冲突或样式导入错误。
3. `native copy paste` 已通过构建验证，但仍需浏览器实际复制粘贴行为验证。
4. 标准属性面板已经完成接入，当前可以进入浏览器交互验证阶段。
5. `bpmnlint` 已完成接入，当前支持默认开启和手动开关。
6. `bpmn-js-token-simulation` 已完成接入，当前支持工具栏切换模拟状态。
7. 当前项目已经具备 `建模 + 属性面板 + 校验 + 模拟` 的第一版混装能力。
8. 项目已补出一版独立 Tracking 原型，支持只读 Viewer、场景切换、运行态 marker 和右侧轨迹面板。
