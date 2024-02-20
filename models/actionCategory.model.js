import mongoose from "mongoose";

const actionCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    actions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkflowAction",
      },
    ],
  },
  { timestamps: true }
);

const ActionCategory = new mongoose.model(
  "ActionCategory",
  actionCategorySchema
);
export default ActionCategory;
