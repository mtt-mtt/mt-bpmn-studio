import inherits from "inherits-browser";
import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;
const UNSUPPORTED_TYPES = [
  "bpmn:BusinessRuleTask",
  "bpmn:CallActivity",
  "bpmn:DataObjectReference",
  "bpmn:DataStoreReference",
  "bpmn:Group",
  "bpmn:ManualTask",
  "bpmn:ReceiveTask",
  "bpmn:ScriptTask",
  "bpmn:SendTask",
  "bpmn:TextAnnotation",
];

function isUnsupported(element) {
  return UNSUPPORTED_TYPES.some((type) => is(element, type));
}

export default function WorkflowRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(WorkflowRules, RuleProvider);

WorkflowRules.$inject = ["eventBus"];

WorkflowRules.prototype.init = function() {
  this.addRule(["shape.create", "elements.create"], LOW_PRIORITY, (context) => {
    const shapes = context.shapes || [context.shape];

    if (shapes.some(isUnsupported)) {
      return false;
    }
  });

  this.addRule("connection.create", LOW_PRIORITY, (context) => {
    const source = context.source;
    const target = context.target;

    if (is(source, "bpmn:EndEvent") || is(target, "bpmn:StartEvent")) {
      return false;
    }
  });
};
