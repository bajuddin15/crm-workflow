import Workflow from "../models/workflow.model.js";
import WorkflowTrigger from "../models/workflowTrigger.model.js";

const createWorkflowTrigger = async (req, res) => {
  const { name, unqName, workflowId } = req.body;

  try {
    const newWorkflowTrigger = new WorkflowTrigger({
      name,
      unqName,
      workflowId,
    });

    // find workflow and push this action
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }

    workflow.triggers.push(newWorkflowTrigger?._id);
    await newWorkflowTrigger.save();
    await workflow.save();
    res.status(201).json({
      success: true,
      message: "Trigger created successfully",
      data: newWorkflowTrigger,
    });
  } catch (error) {
    console.log("Create workflow trigger controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteWorkflowTrigger = async (req, res) => {
  const { id: triggerId } = req.params;
  const { workflowId } = req.body;
  console.log({ "req.body": req.body, workflowId });

  try {
    const findTrigger = await WorkflowTrigger.findById(triggerId);

    if (!findTrigger) {
      return res
        .status(404)
        .json({ success: false, message: "Trigger not found" });
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }

    await Workflow.findByIdAndUpdate(workflowId, {
      $pull: { triggers: triggerId },
    });

    await WorkflowTrigger.findByIdAndDelete(triggerId);
    res
      .status(200)
      .json({ success: true, message: "Trigger deleted successfully" });
  } catch (error) {
    console.log("Delete workflow trigger controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const editWorkflowTrigger = async (req, res) => {
  const { name } = req.body;
  const { id: triggerId } = req.params;

  try {
    const trigger = await WorkflowTrigger.findById(triggerId);

    if (!trigger) {
      return res
        .status(404)
        .json({ success: false, message: "Trigger not found" });
    }

    trigger.name = name || trigger.name;

    const updatedTrigger = await trigger.save();
    res.status(200).json({
      success: true,
      message: "Trigger updated successfully",
      data: updatedTrigger,
    });
  } catch (error) {
    console.log("Delete workflow trigger controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllTriggers = async (req, res) => {
  const { id: workflowId } = req.params;
  try {
    const triggers = await WorkflowTrigger.find({ workflowId });
    res
      .status(200)
      .json({ success: true, message: "Triggers found", data: triggers });
  } catch (error) {
    console.log("Get all workflow triggers controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createWorkflowTrigger,
  deleteWorkflowTrigger,
  editWorkflowTrigger,
  getAllTriggers,
};
