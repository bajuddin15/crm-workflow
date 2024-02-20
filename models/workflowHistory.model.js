import mongoose from "mongoose";

const workflowHistorySchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
  },
  { timestamps: true }
);

const WorkflowHistory = mongoose.model(
  "WorkflowHistory",
  workflowHistorySchema
);
export default WorkflowHistory;
