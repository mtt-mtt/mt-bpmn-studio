import endEventRequiredRule from "bpmnlint/rules/end-event-required";
import labelRequiredRule from "bpmnlint/rules/label-required";
import noDisconnectedRule from "bpmnlint/rules/no-disconnected";
import noDuplicateSequenceFlowsRule from "bpmnlint/rules/no-duplicate-sequence-flows";
import noImplicitEndRule from "bpmnlint/rules/no-implicit-end";
import noImplicitSplitRule from "bpmnlint/rules/no-implicit-split";
import startEventRequiredRule from "bpmnlint/rules/start-event-required";

const ruleMap = {
  "end-event-required": endEventRequiredRule,
  "label-required": labelRequiredRule,
  "no-disconnected": noDisconnectedRule,
  "no-duplicate-sequence-flows": noDuplicateSequenceFlowsRule,
  "no-implicit-end": noImplicitEndRule,
  "no-implicit-split": noImplicitSplitRule,
  "start-event-required": startEventRequiredRule,
};

const config = {
  rules: {
    "start-event-required": "error",
    "end-event-required": "error",
    "label-required": "warn",
    "no-disconnected": "error",
    "no-duplicate-sequence-flows": "error",
    "no-implicit-split": "error",
    "no-implicit-end": "error",
  },
};

const resolver = {
  resolveRule(pkg, ruleName) {
    if (pkg !== "bpmnlint" || !ruleMap[ruleName]) {
      throw new Error(`cannot resolve rule <${pkg}/${ruleName}>`);
    }
    return ruleMap[ruleName];
  },
  resolveConfig() {
    throw new Error("nested lint config is not bundled");
  },
};

export const bpmnlintConfig = {
  config,
  resolver,
};
