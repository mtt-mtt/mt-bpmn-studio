import inherits from "inherits-browser";
import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

export default function WorkflowRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(WorkflowRules, RuleProvider);

WorkflowRules.$inject = ["eventBus"];

WorkflowRules.prototype.init = function() {
  this.addRule("connection.create", LOW_PRIORITY, (context) => {
    const source = context.source;
    const target = context.target;

    if (is(source, "bpmn:EndEvent") || is(target, "bpmn:StartEvent")) {
      return false;
    }
  });
};
