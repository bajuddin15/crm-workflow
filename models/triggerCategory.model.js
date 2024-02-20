import mongoose from "mongoose";

const triggerCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    triggers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkflowTrigger",
      },
    ],
  },
  { timestamps: true }
);

const TriggerCategory = mongoose.model(
  "TriggerCategory",
  triggerCategorySchema
);
export default TriggerCategory;
