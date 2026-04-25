const PALETTE_PRIORITY = 500;

const GROUPS = [
  {
    id: "event",
    title: "\u4e8b\u4ef6",
    entries: [
      ["create.start.none", "bpmn:StartEvent", "bpmn-icon-start-event-none", "\u5f00\u59cb"],
      ["create.start.message", "bpmn:StartEvent", "bpmn-icon-start-event-message", "\u6d88\u606f", { eventDefinitionType: "bpmn:MessageEventDefinition" }],
      ["create.start.timer", "bpmn:StartEvent", "bpmn-icon-start-event-timer", "\u5b9a\u65f6", { eventDefinitionType: "bpmn:TimerEventDefinition" }],
      ["create.intermediate.none", "bpmn:IntermediateThrowEvent", "bpmn-icon-intermediate-event-none", "\u4e2d\u95f4"],
      ["create.intermediate.message", "bpmn:IntermediateCatchEvent", "bpmn-icon-intermediate-event-catch-message", "\u6355\u83b7", { eventDefinitionType: "bpmn:MessageEventDefinition" }],
      ["create.end.none", "bpmn:EndEvent", "bpmn-icon-end-event-none", "\u7ed3\u675f"],
      ["create.end.error", "bpmn:EndEvent", "bpmn-icon-end-event-error", "\u9519\u8bef", { eventDefinitionType: "bpmn:ErrorEventDefinition" }],
    ],
  },
  {
    id: "task",
    title: "\u4efb\u52a1",
    entries: [
      ["create.task", "bpmn:Task", "bpmn-icon-task", "\u4efb\u52a1"],
      ["create.user-task", "bpmn:UserTask", "bpmn-icon-user-task", "\u7528\u6237"],
      ["create.service-task", "bpmn:ServiceTask", "bpmn-icon-service-task", "\u670d\u52a1"],
      ["create.script-task", "bpmn:ScriptTask", "bpmn-icon-script-task", "\u811a\u672c"],
      ["create.business-rule-task", "bpmn:BusinessRuleTask", "bpmn-icon-business-rule-task", "\u89c4\u5219"],
      ["create.manual-task", "bpmn:ManualTask", "bpmn-icon-manual-task", "\u624b\u5de5"],
      ["create.send-task", "bpmn:SendTask", "bpmn-icon-send-task", "\u53d1\u9001"],
      ["create.receive-task", "bpmn:ReceiveTask", "bpmn-icon-receive-task", "\u63a5\u6536"],
    ],
  },
  {
    id: "gateway",
    title: "\u7f51\u5173",
    entries: [
      ["create.exclusive-gateway", "bpmn:ExclusiveGateway", "bpmn-icon-gateway-xor", "\u6392\u4ed6"],
      ["create.parallel-gateway", "bpmn:ParallelGateway", "bpmn-icon-gateway-parallel", "\u5e76\u884c"],
      ["create.inclusive-gateway", "bpmn:InclusiveGateway", "bpmn-icon-gateway-or", "\u5305\u5bb9"],
      ["create.event-gateway", "bpmn:EventBasedGateway", "bpmn-icon-gateway-eventbased", "\u4e8b\u4ef6"],
      ["create.complex-gateway", "bpmn:ComplexGateway", "bpmn-icon-gateway-complex", "\u590d\u6742"],
    ],
  },
  {
    id: "container",
    title: "\u5bb9\u5668",
    entries: [
      ["create.subprocess", "bpmn:SubProcess", "bpmn-icon-subprocess-collapsed", "\u5b50\u6d41\u7a0b"],
      ["create.expanded-subprocess", "bpmn:SubProcess", "bpmn-icon-subprocess-expanded", "\u5c55\u5f00", { isExpanded: true }],
      ["create.call-activity", "bpmn:CallActivity", "bpmn-icon-call-activity", "\u8c03\u7528"],
      ["create.participant", "bpmn:Participant", "bpmn-icon-participant", "\u6c60"],
    ],
  },
  {
    id: "artifact",
    title: "\u6570\u636e / \u5de5\u4ef6",
    entries: [
      ["create.data-object", "bpmn:DataObjectReference", "bpmn-icon-data-object", "\u6570\u636e"],
      ["create.data-store", "bpmn:DataStoreReference", "bpmn-icon-data-store", "\u5b58\u50a8"],
      ["create.text-annotation", "bpmn:TextAnnotation", "bpmn-icon-text-annotation", "\u6ce8\u91ca"],
      ["create.group", "bpmn:Group", "bpmn-icon-group", "\u5206\u7ec4"],
    ],
  },
];

function titleEntry(group) {
  return {
    group: group.id,
    html: `<div class="odoo-palette-title">${group.title}</div>`,
  };
}

function createEntry(entry, groupId, create, elementFactory) {
  const [id, type, className, label, options = {}] = entry;

  function createListener(event) {
    if (type === "bpmn:Participant") {
      create.start(event, elementFactory.createParticipantShape());
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
    title: label,
    html: `
      <div class="entry odoo-palette-entry" draggable="true">
        <span class="odoo-palette-glyph ${className}"></span>
        <span class="odoo-palette-label">${label}</span>
      </div>
    `,
    action: {
      dragstart: createListener,
      click: createListener,
    },
  };
}

export default function OdooPaletteProvider(palette, create, elementFactory) {
  this._create = create;
  this._elementFactory = elementFactory;

  palette.registerProvider(PALETTE_PRIORITY, this);
}

OdooPaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
];

OdooPaletteProvider.prototype.getPaletteEntries = function() {
  const create = this._create;
  const elementFactory = this._elementFactory;

  return () => GROUPS.reduce((entries, group) => {
    entries[`title.${group.id}`] = titleEntry(group);

    group.entries.forEach((entry) => {
      const [id] = entry;
      entries[id] = createEntry(entry, group.id, create, elementFactory);
    });

    return entries;
  }, {});
};
