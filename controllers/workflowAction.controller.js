import Workflow from "../models/workflow.model.js";
import WorkflowAction from "../models/workflowAction.model.js";

const createWorkflowAction = async (req, res) => {
  const {
    workflowId,
    name,
    unqName,
    contactName,
    email,
    phoneNumber,
    groupName,
    toNumber,
    fromNumber,
    message,
    mediaUrl,
    templateName,
    templateLang,
  } = req.body;

  try {
    const newAction = new WorkflowAction({
      workflowId,
      name,
      unqName,
      contactName,
      email,
      phoneNumber,
      groupName,
      toNumber,
      fromNumber,
      message,
      mediaUrl,
      templateName,
      templateLang,
    });

    // find workflow and push this action
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }

    workflow.actions.push(newAction._id);
    await newAction.save();
    await workflow.save();

    res.status(201).json({
      success: true,
      message: "Action created successfully",
      data: newAction,
    });
  } catch (error) {
    console.log("Create workflow actions controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteWorkflowAction = async (req, res) => {
  const { id: actionId } = req.params;
  const { workflowId } = req.body;
  console.log({ "req.body": req.body, workflowId });

  try {
    const findAction = await WorkflowAction.findById(actionId);

    if (!findAction) {
      return res
        .status(404)
        .json({ success: false, message: "Action not found" });
    }
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }

    await Workflow.findByIdAndUpdate(workflowId, {
      $pull: { actions: actionId },
    });

    await WorkflowAction.findByIdAndDelete(actionId);
    res
      .status(200)
      .json({ success: true, message: "Action deleted successfully" });
  } catch (error) {
    console.log("Delete workflow action controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const editWorkflowAction = async (req, res) => {
  const { name } = req.body;
  const { id: actionId } = req.params;

  try {
    const action = await WorkflowAction.findById(actionId);

    if (!action) {
      return res
        .status(404)
        .json({ success: false, message: "Action not found" });
    }

    action.name = name || action.name;

    const updatedAction = await action.save();
    res.status(200).json({
      success: true,
      message: "Action updated successfully",
      data: updatedAction,
    });
  } catch (error) {
    console.log("Delete workflow action controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllWorkflowActions = async (req, res) => {
  const { id: workflowId } = req.params;
  try {
    const actions = await WorkflowAction.find({ workflowId });
    res.status(200).json({
      success: true,
      message: "Workflow actions found",
      data: actions,
    });
  } catch (error) {
    console.log("Get all workflow actions controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createWorkflowAction,
  deleteWorkflowAction,
  editWorkflowAction,
  getAllWorkflowActions,
};
