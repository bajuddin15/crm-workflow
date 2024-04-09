import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "publish"],
      default: "draft",
    },
    triggers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkflowTrigger",
      },
    ],
    actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkflowAction",
      },
    ],
    apiResponse: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

const Workflow = mongoose.model("Workflow", workflowSchema);
export default Workflow;
