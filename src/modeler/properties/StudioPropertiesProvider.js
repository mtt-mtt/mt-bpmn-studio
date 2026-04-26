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
      id: "studio-processing-role",
      label: "处理角色",
      attr: "data-studio-processing-role",
    }),
    textEntry(element, modeling, debounce, {
      id: "studio-assignee-expression",
      label: "处理人表达式",
      attr: "data-studio-assignee-expression",
    }),
    textareaEntry(element, modeling, debounce, {
      id: "studio-condition",
      label: "流转条件",
      attr: "data-studio-condition",
    }),
  ];

  if (is(element, "bpmn:StartEvent")) {
    entries.push(textEntry(element, modeling, debounce, {
      id: "studio-trigger-action",
      label: "触发按钮",
      attr: "data-studio-trigger-action",
    }));
  }

  return entries;
}

export default function StudioPropertiesProvider(propertiesPanel, translate, modeling, debounceInput) {
  this.getGroups = function(element) {
    return function(groups) {
      if (!is(element, "bpmn:FlowNode")) {
        return groups;
      }

      groups.push({
        id: "studio-workflow",
        label: translate("流程扩展"),
        entries: buildEntries(element, modeling, debounceInput),
      });

      return groups;
    };
  };

  propertiesPanel.registerProvider(500, this);
}

StudioPropertiesProvider.$inject = [
  "propertiesPanel",
  "translate",
  "modeling",
  "debounceInput",
];
