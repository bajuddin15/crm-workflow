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
    actionEventMethod: {
      type: String,
      enum: ["GET", "POST"],
    },
    endpointUrl: {
      type: String,
    },
    payloadType: {
      type: String,
    },
    authType: {
      type: String,
    },
    headers: [
      {
        key: String,
        value: String,
      },
    ],
    parameters: [
      {
        key: String,
        value: String,
      },
    ],
    voiceText: {
      type: String,
    },
    // filter
    filterValues: {
      andValues: [
        {
          label: String,
          filterType: String,
          value: String,
        },
      ],
      orValues: [
        {
          label: String,
          filterType: String,
          value: String,
        },
      ],
    },
    filterExpression: {
      type: String,
    },
  },
  { timestamps: true }
);

const WorkflowAction = mongoose.model("WorkflowAction", workflowActionSchema);
export default WorkflowAction;
