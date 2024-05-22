import mongoose from "mongoose";

const workflowTriggerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unqName: {
      type: String,
      required: true,
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
    webhook_url: {
      type: String,
    },
    responseListening: {
      type: Boolean,
      default: false,
    },
    webhookResponse: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

const WorkflowTrigger = mongoose.model(
  "WorkflowTrigger",
  workflowTriggerSchema
);
export default WorkflowTrigger;
