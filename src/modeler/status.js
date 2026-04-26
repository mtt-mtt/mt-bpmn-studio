export function createModelerStatus({
  diagramStatus,
  dirtyStatus,
  lintStatus,
  simulationStatus,
  linting,
}) {
  const setDirtyState = (isDirty) => {
    dirtyStatus.textContent = isDirty ? "有未导出修改" : "无";
  };

  const syncLintState = () => {
    lintStatus.textContent = linting.isActive() ? "推荐规则已开启" : "已关闭";
  };

  const setSimulationState = (active) => {
    simulationStatus.textContent = active ? "Token Simulation 已开启" : "已关闭";
  };

  return {
    markDiagramLoaded(label) {
      diagramStatus.textContent = label;
      setDirtyState(false);
    },
    markDiagramLoadFailed() {
      diagramStatus.textContent = "加载失败";
    },
    markDirty() {
      setDirtyState(true);
    },
    markSaved() {
      setDirtyState(false);
    },
    setInitialState() {
      syncLintState();
      setSimulationState(false);
    },
    setSimulationState,
    syncLintState,
  };
}
