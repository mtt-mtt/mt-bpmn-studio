export const toolbarLabels = {
  hand: { zh: "抓手工具", en: "Hand tool" },
  lasso: { zh: "框选工具", en: "Lasso tool" },
  space: { zh: "拉伸空间工具", en: "Create/remove space tool" },
  connect: { zh: "全局连线工具", en: "Global connect tool" },
  zoomIn: { zh: "放大", en: "Zoom in" },
  zoomOut: { zh: "缩小", en: "Zoom out" },
  fit: { zh: "适配画布", en: "Fit viewport" },
  reset: { zh: "刷新标记", en: "Refresh markers" },
  minimapOpen: { zh: "打开小地图", en: "Open minimap" },
  minimapClose: { zh: "关闭小地图", en: "Close minimap" },
  simulation: { zh: "切换 Token Simulation", en: "Toggle Token Simulation" },
  languageToEnglish: { zh: "切换到英文", en: "Switch to English" },
  languageToChinese: { zh: "切换到中文", en: "Switch to Chinese" },
  undo: { zh: "撤销", en: "Undo" },
  redo: { zh: "重做", en: "Redo" },
};

export function getToolbarLabel(key, language) {
  const labels = toolbarLabels[key];

  if (!labels) {
    return key;
  }

  return labels[language] || labels.en || labels.zh || key;
}
