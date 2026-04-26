import approvalDemoXml from "../../../samples/approval-demo.bpmn?raw";
import { baseNodeDetails } from "./baseNodeDetails.js";

export const runningScenario = {
  key: "running",
  xml: approvalDemoXml,
  title: "销售订单打印审批",
  documentLabel: "S00013",
  triggerLabel: "申请打印",
  stateLabel: "进行中",
  stateClass: "is-running",
  autoStatus: "",
  exceptionMessage: "",
  defaultNodeId: "Task_Finance",
  markers: {
    completed: ["StartEvent_Submit", "Task_Manager", "Gateway_Result"],
    current: ["Task_Finance"],
    pending: ["EndEvent_Done"],
    error: [],
  },
  logs: [
    {
      type: "action",
      actor: "张三",
      time: "2026-04-23 15:10:12",
      title: "当前节点：财务复核",
      message: "等待当前处理人继续审批。",
    },
    {
      type: "passed",
      actor: "李经理",
      time: "2026-04-23 14:52:08",
      title: "已同意",
      message: "经理审批已通过，流程流转至财务节点。",
    },
    {
      type: "sys",
      actor: "系统通知",
      time: "2026-04-23 14:50:01",
      title: "流程启动",
      message: "由按钮“申请打印”触发审批流程。",
    },
  ],
  nodeDetails: {
    ...baseNodeDetails,
  },
};
