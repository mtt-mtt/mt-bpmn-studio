import { renderLogs } from "./rendering.js";

export function renderTrackingScenario(refs, scenario, scenarioKey) {
  refs.title.textContent = scenario.title;
  refs.document.textContent = scenario.documentLabel;
  refs.trigger.textContent = scenario.triggerLabel;
  refs.state.textContent = scenario.stateLabel;
  refs.state.className = `tracking-state-tag ${scenario.stateClass}`;
  refs.banner.hidden = !scenario.exceptionMessage;
  refs.banner.textContent = scenario.exceptionMessage;
  refs.autoStatus.hidden = !scenario.autoStatus;
  refs.autoStatus.textContent = scenario.autoStatus;
  renderLogs(refs.logList, scenario.logs);

  refs.scenarioButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scenario === scenarioKey);
  });
}
