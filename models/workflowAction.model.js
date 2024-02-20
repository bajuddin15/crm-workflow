import mongoose from "mongoose";

const workflowActionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    unqName: {
      type: String,
      required: true,
      unique: true,
    },
    contactName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    groupName: {
      type: String,
    },
    toNumber: {
      type: String,
    },
    fromNumber: {
      type: String,
    },
    message: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    templateName: {
      type: String,
    },
    templateLang: {
      type: String,
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
  },
  { timestamps: true }
);

const WorkflowAction = mongoose.model("WorkflowAction", workflowActionSchema);
export default WorkflowAction;
