import {
  isTextAreaEntryEdited,
  isTextFieldEntryEdited,
  TextAreaEntry,
  TextFieldEntry,
} from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";

function getAttr(element, name) {
  return getBusinessObject(element)?.$attrs?.[name] || "";
}

function setAttr(element, modeling, name, value) {
  const businessObject = getBusinessObject(element);
  const attrs = { ...(businessObject.$attrs || {}) };

  if (value) {
    attrs[name] = value;
  } else {
    delete attrs[name];
  }

  modeling.updateModdleProperties(element, businessObject, {
    $attrs: attrs,
  });
}

function textEntry(element, modeling, debounce, config) {
  return {
    id: config.id,
    element,
    component(props) {
      return TextFieldEntry({
        ...props,
        id: config.id,
        element,
        label: config.label,
        debounce,
        getValue: () => getAttr(element, config.attr),
        setValue: (value) => setAttr(element, modeling, config.attr, value),
      });
    },
    isEdited: isTextAreaEntryEdited,
  };
}

function textareaEntry(element, modeling, debounce, config) {
  return {
    id: config.id,
    element,
    component(props) {
      return TextAreaEntry({
        ...props,
        id: config.id,
        element,
        label: config.label,
        debounce,
        rows: 3,
        getValue: () => getAttr(element, config.attr),
        setValue: (value) => setAttr(element, modeling, config.attr, value),
      });
    },
    isEdited: isTextFieldEntryEdited,
  };
}

function buildEntries(element, modeling, debounce) {
  const entries = [
    textEntry(element, modeling, debounce, {
      id: "odoo-approval-role",
      label: "审批角色",
      attr: "data-odoo-approval-role",
    }),
    textEntry(element, modeling, debounce, {
      id: "odoo-assignee-domain",
      label: "审批人 Domain",
      attr: "data-odoo-assignee-domain",
    }),
    textareaEntry(element, modeling, debounce, {
      id: "odoo-condition",
      label: "流转条件",
      attr: "data-odoo-condition",
    }),
  ];

  if (is(element, "bpmn:StartEvent")) {
    entries.push(textEntry(element, modeling, debounce, {
      id: "odoo-trigger-button",
      label: "触发按钮",
      attr: "data-odoo-trigger-button",
    }));
  }

  return entries;
}

export default function OdooPropertiesProvider(propertiesPanel, translate, modeling, debounceInput) {
  this.getGroups = function(element) {
    return function(groups) {
      if (!is(element, "bpmn:FlowNode")) {
        return groups;
      }

      groups.push({
        id: "odoo-workflow",
        label: translate("Odoo 工作流"),
        entries: buildEntries(element, modeling, debounceInput),
      });

      return groups;
    };
  };

  propertiesPanel.registerProvider(500, this);
}

OdooPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "modeling",
  "debounceInput",
];
