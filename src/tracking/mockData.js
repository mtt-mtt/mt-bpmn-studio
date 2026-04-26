import { exceptionScenario } from "./scenarios/exceptionScenario.js";
import { runningScenario } from "./scenarios/runningScenario.js";

export const trackingScenarios = {
  running: runningScenario,
  exception: exceptionScenario,
};
