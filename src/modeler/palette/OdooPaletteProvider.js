const PALETTE_PRIORITY = 500;

const GROUPS = [
  {
    id: "start-event",
    title: "Start",
    entries: [
      ["create.start.none", "bpmn:StartEvent", "bpmn-icon-start-event-none", "Start"],
      ["create.start.message", "bpmn:StartEvent", "bpmn-icon-start-event-message", "Msg Start", { eventDefinitionType: "bpmn:MessageEventDefinition" }],
      ["create.start.timer", "bpmn:StartEvent", "bpmn-icon-start-event-timer", "Timer Start", { eventDefinitionType: "bpmn:TimerEventDefinition" }],
      ["create.start.condition", "bpmn:StartEvent", "bpmn-icon-start-event-condition", "Cond Start", { eventDefinitionType: "bpmn:ConditionalEventDefinition" }],
      ["create.start.signal", "bpmn:StartEvent", "bpmn-icon-start-event-signal", "Signal Start", { eventDefinitionType: "bpmn:SignalEventDefinition" }],
    ],
  },
  {
    id: "event-subprocess-start",
    title: "Event Starts",
    entries: [
      ["create.event-subprocess-start.message", "bpmn:StartEvent", "bpmn-icon-start-event-message", "Int Msg", { eventDefinitionType: "bpmn:MessageEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.timer", "bpmn:StartEvent", "bpmn-icon-start-event-timer", "Int Timer", { eventDefinitionType: "bpmn:TimerEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.condition", "bpmn:StartEvent", "bpmn-icon-start-event-condition", "Int Cond", { eventDefinitionType: "bpmn:ConditionalEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.signal", "bpmn:StartEvent", "bpmn-icon-start-event-signal", "Int Signal", { eventDefinitionType: "bpmn:SignalEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.error", "bpmn:StartEvent", "bpmn-icon-start-event-error", "Int Error", { eventDefinitionType: "bpmn:ErrorEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.escalation", "bpmn:StartEvent", "bpmn-icon-start-event-escalation", "Int Esc", { eventDefinitionType: "bpmn:EscalationEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.compensation", "bpmn:StartEvent", "bpmn-icon-start-event-compensation", "Int Comp", { eventDefinitionType: "bpmn:CompensateEventDefinition", isInterrupting: true }],
      ["create.event-subprocess-start.non-interrupting-message", "bpmn:StartEvent", "bpmn-icon-start-event-non-interrupting-message", "Non Msg", { eventDefinitionType: "bpmn:MessageEventDefinition", isInterrupting: false }],
      ["create.event-subprocess-start.non-interrupting-timer", "bpmn:StartEvent", "bpmn-icon-start-event-non-interrupting-timer", "Non Timer", { eventDefinitionType: "bpmn:TimerEventDefinition", isInterrupting: false }],
      ["create.event-subprocess-start.non-interrupting-condition", "bpmn:StartEvent", "bpmn-icon-start-event-non-interrupting-condition", "Non Cond", { eventDefinitionType: "bpmn:ConditionalEventDefinition", isInterrupting: false }],
      ["create.event-subprocess-start.non-interrupting-signal", "bpmn:StartEvent", "bpmn-icon-start-event-non-interrupting-signal", "Non Signal", { eventDefinitionType: "bpmn:SignalEventDefinition", isInterrupting: false }],
      ["create.event-subprocess-start.non-interrupting-escalation", "bpmn:StartEvent", "bpmn-icon-start-event-non-interrupting-escalation", "Non Esc", { eventDefinitionType: "bpmn:EscalationEventDefinition", isInterrupting: false }],
    ],
  },
  {
    id: "intermediate-event",
    title: "Middle Events",
    entries: [
      ["create.intermediate.none", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-none", "Throw"],
      ["create.intermediate.message-catch", "bpmn:IntermediateCatchEvent", "bpmn-icon-intermediate-event-catch-message", "Msg Catch", { eventDefinitionType: "bpmn:MessageEventDefinition" }],
      ["create.intermediate.message-throw", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-throw-message", "Msg Throw", { eventDefinitionType: "bpmn:MessageEventDefinition" }],
      ["create.intermediate.timer-catch", "bpmn:IntermediateCatchEvent", "bpmn-icon-intermediate-event-catch-timer", "Timer Catch", { eventDefinitionType: "bpmn:TimerEventDefinition" }],
      ["create.intermediate.escalation-throw", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-throw-escalation", "Esc Throw", { eventDefinitionType: "bpmn:EscalationEventDefinition" }],
      ["create.intermediate.condition-catch", "bpmn:IntermediateCatchEvent", "bpmn-icon-intermediate-event-catch-condition", "Cond Catch", { eventDefinitionType: "bpmn:ConditionalEventDefinition" }],
      ["create.intermediate.link-catch", "bpmn:IntermediateCatchEvent", "bpmn-icon-intermediate-event-catch-link", "Link Catch", { eventDefinitionType: "bpmn:LinkEventDefinition", eventDefinitionAttrs: { name: "" } }],
      ["create.intermediate.link-throw", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-throw-link", "Link Throw", { eventDefinitionType: "bpmn:LinkEventDefinition", eventDefinitionAttrs: { name: "" } }],
      ["create.intermediate.compensation-throw", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-throw-compensation", "Comp Throw", { eventDefinitionType: "bpmn:CompensateEventDefinition" }],
      ["create.intermediate.signal-catch", "bpmn:IntermediateCatchEvent", "bpmn-icon-intermediate-event-catch-signal", "Signal Catch", { eventDefinitionType: "bpmn:SignalEventDefinition" }],
      ["create.intermediate.signal-throw", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-throw-signal", "Signal Throw", { eventDefinitionType: "bpmn:SignalEventDefinition" }],
    ],
  },
  {
    id: "boundary",
    title: "Boundary",
    entries: [
      ["create.boundary.message", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-message", "Bnd Msg", { eventDefinitionType: "bpmn:MessageEventDefinition", cancelActivity: true }],
      ["create.boundary.timer", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-timer", "Bnd Timer", { eventDefinitionType: "bpmn:TimerEventDefinition", cancelActivity: true }],
      ["create.boundary.escalation", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-escalation", "Bnd Esc", { eventDefinitionType: "bpmn:EscalationEventDefinition", cancelActivity: true }],
      ["create.boundary.condition", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-condition", "Bnd Cond", { eventDefinitionType: "bpmn:ConditionalEventDefinition", cancelActivity: true }],
      ["create.boundary.error", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-error", "Bnd Error", { eventDefinitionType: "bpmn:ErrorEventDefinition", cancelActivity: true }],
      ["create.boundary.cancel", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-cancel", "Bnd Cancel", { eventDefinitionType: "bpmn:CancelEventDefinition", cancelActivity: true }],
      ["create.boundary.signal", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-signal", "Bnd Signal", { eventDefinitionType: "bpmn:SignalEventDefinition", cancelActivity: true }],
      ["create.boundary.compensation", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-compensation", "Bnd Comp", { eventDefinitionType: "bpmn:CompensateEventDefinition", cancelActivity: true }],
      ["create.boundary.non-interrupting-message", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-non-interrupting-message", "Non Msg", { eventDefinitionType: "bpmn:MessageEventDefinition", cancelActivity: false }],
      ["create.boundary.non-interrupting-timer", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-non-interrupting-timer", "Non Timer", { eventDefinitionType: "bpmn:TimerEventDefinition", cancelActivity: false }],
      ["create.boundary.non-interrupting-escalation", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-non-interrupting-escalation", "Non Esc", { eventDefinitionType: "bpmn:EscalationEventDefinition", cancelActivity: false }],
      ["create.boundary.non-interrupting-condition", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-non-interrupting-condition", "Non Cond", { eventDefinitionType: "bpmn:ConditionalEventDefinition", cancelActivity: false }],
      ["create.boundary.non-interrupting-signal", "bpmn:BoundaryEvent", "bpmn-icon-intermediate-event-catch-non-interrupting-signal", "Non Signal", { eventDefinitionType: "bpmn:SignalEventDefinition", cancelActivity: false }],
    ],
  },
  {
    id: "end-event",
    title: "End",
    entries: [
      ["create.end.none", "bpmn:EndEvent", "bpmn-icon-end-event-none", "End"],
      ["create.end.message", "bpmn:EndEvent", "bpmn-icon-end-event-message", "Msg End", { eventDefinitionType: "bpmn:MessageEventDefinition" }],
      ["create.end.escalation", "bpmn:EndEvent", "bpmn-icon-end-event-escalation", "Esc End", { eventDefinitionType: "bpmn:EscalationEventDefinition" }],
      ["create.end.error", "bpmn:EndEvent", "bpmn-icon-end-event-error", "Error End", { eventDefinitionType: "bpmn:ErrorEventDefinition" }],
      ["create.end.cancel", "bpmn:EndEvent", "bpmn-icon-end-event-cancel", "Cancel End", { eventDefinitionType: "bpmn:CancelEventDefinition" }],
      ["create.end.compensation", "bpmn:EndEvent", "bpmn-icon-end-event-compensation", "Comp End", { eventDefinitionType: "bpmn:CompensateEventDefinition" }],
      ["create.end.signal", "bpmn:EndEvent", "bpmn-icon-end-event-signal", "Signal End", { eventDefinitionType: "bpmn:SignalEventDefinition" }],
      ["create.end.terminate", "bpmn:EndEvent", "bpmn-icon-end-event-terminate", "Term End", { eventDefinitionType: "bpmn:TerminateEventDefinition" }],
    ],
  },
  {
    id: "task",
    title: "Tasks",
    entries: [
      ["create.task", "bpmn:Task", "bpmn-icon-task", "Task"],
      ["create.user-task", "bpmn:UserTask", "bpmn-icon-user", "User"],
      ["create.service-task", "bpmn:ServiceTask", "bpmn-icon-service", "Service"],
      ["create.send-task", "bpmn:SendTask", "bpmn-icon-send-task", "Send"],
      ["create.receive-task", "bpmn:ReceiveTask", "bpmn-icon-receive-task", "Receive"],
      ["create.manual-task", "bpmn:ManualTask", "bpmn-icon-manual", "Manual"],
      ["create.business-rule-task", "bpmn:BusinessRuleTask", "bpmn-icon-business-rule", "Rule"],
      ["create.script-task", "bpmn:ScriptTask", "bpmn-icon-script", "Script"],
    ],
  },
  {
    id: "gateway",
    title: "Gateways",
    entries: [
      ["create.exclusive-gateway", "bpmn:ExclusiveGateway", "bpmn-icon-gateway-xor", "Exclusive"],
      ["create.parallel-gateway", "bpmn:ParallelGateway", "bpmn-icon-gateway-parallel", "Parallel"],
      ["create.inclusive-gateway", "bpmn:InclusiveGateway", "bpmn-icon-gateway-or", "Inclusive"],
      ["create.event-gateway", "bpmn:EventBasedGateway", "bpmn-icon-gateway-eventbased", "Event"],
      ["create.complex-gateway", "bpmn:ComplexGateway", "bpmn-icon-gateway-complex", "Complex"],
    ],
  },
  {
    id: "container",
    title: "Containers",
    entries: [
      ["create.subprocess", "bpmn:SubProcess", "bpmn-icon-subprocess-collapsed", "Subprocess"],
      ["create.expanded-subprocess", "bpmn:SubProcess", "bpmn-icon-subprocess-expanded", "Expanded", { isExpanded: true }],
      ["create.ad-hoc-subprocess", "bpmn:AdHocSubProcess", "bpmn-icon-subprocess-collapsed", "Ad-hoc", { isExpanded: false }],
      ["create.expanded-ad-hoc-subprocess", "bpmn:AdHocSubProcess", "bpmn-icon-subprocess-expanded", "Ad-hoc Exp", { isExpanded: true }],
      ["create.transaction", "bpmn:Transaction", "bpmn-icon-transaction", "Transaction", { isExpanded: true }],
      ["create.event-subprocess", "bpmn:SubProcess", "bpmn-icon-event-subprocess-expanded", "Event Sub", { triggeredByEvent: true, isExpanded: true }],
      ["create.call-activity", "bpmn:CallActivity", "bpmn-icon-call-activity", "Call"],
      ["create.participant.expanded", "bpmn:Participant", "bpmn-icon-participant", "Pool", { isExpanded: true }],
      ["create.participant.collapsed", "bpmn:Participant", "bpmn-icon-lane", "Pool Empty", { isExpanded: false }],
    ],
  },
  {
    id: "artifact",
    title: "Data / Artifacts",
    entries: [
      ["create.data-object", "bpmn:DataObjectReference", "bpmn-icon-data-object", "Data"],
      ["create.data-store", "bpmn:DataStoreReference", "bpmn-icon-data-store", "Store"],
      ["create.text-annotation", "bpmn:TextAnnotation", "bpmn-icon-text-annotation", "Annotation"],
      ["create.group", "bpmn:Group", "bpmn-icon-group", "Group"],
    ],
  },
];

function titleEntry(group, translate) {
  const title = translate(group.title);

  return {
    group: group.id,
    html: `<div class="odoo-palette-title">${title}</div>`,
  };
}

function createEntry(entry, groupId, create, elementFactory, translate) {
  const [id, type, className, label, options = {}] = entry;
  const translatedLabel = translate(label);

  function createListener(event) {
    if (type === "bpmn:Participant") {
      create.start(event, elementFactory.createParticipantShape(options));
      return;
    }

    const shape = elementFactory.createShape({
      type,
      ...options,
    });

    create.start(event, shape);
  }

  return {
    group: groupId,
    title: translatedLabel,
    html: `
      <div class="entry odoo-palette-entry" draggable="true">
        <span class="odoo-palette-glyph ${className}"></span>
        <span class="odoo-palette-label">${translatedLabel}</span>
      </div>
    `,
    action: {
      dragstart: createListener,
      click: createListener,
    },
  };
}

export default function OdooPaletteProvider(palette, create, elementFactory, translate) {
  this._create = create;
  this._elementFactory = elementFactory;
  this._translate = translate;

  palette.registerProvider(PALETTE_PRIORITY, this);
}

OdooPaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "translate",
];

OdooPaletteProvider.prototype.getPaletteEntries = function() {
  const create = this._create;
  const elementFactory = this._elementFactory;
  const translate = this._translate;

  return () => GROUPS.reduce((entries, group) => {
    entries[`title.${group.id}`] = titleEntry(group, translate);

    group.entries.forEach((entry) => {
      const [id] = entry;
      entries[id] = createEntry(entry, group.id, create, elementFactory, translate);
    });

    return entries;
  }, {});
};
