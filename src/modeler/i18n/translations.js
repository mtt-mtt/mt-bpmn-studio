const translations = {
  "Activate the global connect tool": "启用全局连线工具",
  "Activate the hand tool": "启用拖动画布工具",
  "Activate the lasso tool": "启用框选工具",
  "Activate the create/remove space tool": "启用创建/移除空间工具",
  "Activate the direct editing tool": "启用直接编辑工具",
  "Append EndEvent": "追加结束事件",
  "Append Gateway": "追加网关",
  "Append Intermediate/Boundary Event": "追加中间/边界事件",
  "Append Task": "追加任务",
  "Append TextAnnotation": "追加文本注释",
  "Change color": "更改颜色",
  "Change element": "更改元素",
  "Connect using Association": "使用关联线连接",
  "Connect using DataInputAssociation": "使用数据输入关联连接",
  "Connect using Sequence/MessageFlow or Association": "使用顺序流/消息流/关联连接",
  "Create DataObjectReference": "创建数据对象引用",
  "Create DataStoreReference": "创建数据存储引用",
  "Create EndEvent": "创建结束事件",
  "Create expanded SubProcess": "创建展开子流程",
  "Create Gateway": "创建网关",
  "Create Group": "创建分组",
  "Create Intermediate/Boundary Event": "创建中间/边界事件",
  "Create Pool/Participant": "创建池/参与者",
  "Create StartEvent": "创建开始事件",
  "Create Task": "创建任务",
  "Create TextAnnotation": "创建文本注释",
  "Delete": "删除",
  "Edit Label": "编辑标签",
  "Remove": "移除",
  "Replace with Ad-Hoc SubProcess": "替换为即席子流程",
  "Replace with CallActivity": "替换为调用活动",
  "Replace with collapsed SubProcess": "替换为折叠子流程",
  "Replace with expanded SubProcess": "替换为展开子流程",
  "Replace with Exclusive Gateway": "替换为排他网关",
  "Replace with Inclusive Gateway": "替换为包容网关",
  "Replace with Parallel Gateway": "替换为并行网关",
  "Replace with User Task": "替换为用户任务",
};

export default function translate(template, replacements) {
  let translated = translations[template] || template;

  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      translated = translated.replaceAll(`{${key}}`, value);
    });
  }

  return translated;
}
