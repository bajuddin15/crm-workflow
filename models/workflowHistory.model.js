import mongoose from "mongoose";

const workflowHistorySchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
    actionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkflowAction",
    },
    status: {
      type: String,
      enum: ["failed", "finshed", "waiting"],
      default: "waiting",
    },
    contact: {
      type: String,
    },
    actionName: String,
    apiResponse: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

const WorkflowHistory = mongoose.model(
  "WorkflowHistory",
  workflowHistorySchema
);
export default WorkflowHistory;
