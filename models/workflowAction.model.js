import mongoose from "mongoose";

const workflowActionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unqName: {
      type: String,
      required: true,
    },
    delayTime: {
      type: String, // it should be in miliseconds
      default: 0,
    },
    delayFormate: {
      type: String, // it should be in miliseconds
      enum: ["seconds", "minutes", "hours", "days", "{{delayFormate}}"],
      default: "seconds",
    },
    pickFromPayload: {
      type: Boolean,
      default: true,
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
