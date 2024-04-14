import Workflow from "../models/workflow.model.js";

const createWorkflow = async (req, res) => {
  const { name, description, token } = req.body;
  try {
    if (!token) {
      return res
        .status(409)
        .json({ success: false, message: "Token not found" });
    }
    const newWorkflow = new Workflow({ name, description, token });
    await newWorkflow.save();
    res.status(201).json({
      success: true,
      message: "Workflow created successfully",
      data: newWorkflow,
    });
  } catch (error) {
    console.log("Create workflow controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteWorkflow = async (req, res) => {
  const { id: workflowId } = req.params;
  try {
    const findWorkflow = await Workflow.findById(workflowId);
    if (!findWorkflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }

    // now delete finded workflow
    await Workflow.findByIdAndDelete(workflowId);
    res
      .status(200)
      .json({ success: true, message: "Workflow deleted successfully" });
  } catch (error) {
    console.log("Delete workflow controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const editWorkflow = async (req, res) => {
  const { id: workflowId } = req.params;
  const { name, description, isActive, status, apiResponse, reEnrollment } =
    req.body;

  try {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }
    // update workflows field
    workflow.name = name || workflow.name;
    workflow.description = description || workflow.description;
    workflow.isActive = isActive || workflow.isActive;
    workflow.status = status || workflow.status;
    workflow.reEnrollment = reEnrollment;
    if (apiResponse && Array.isArray(apiResponse)) {
      workflow.apiResponse = [
        ...(workflow.apiResponse || []), // Existing apiResponse or an empty array
        ...apiResponse, // New apiResponse from request body
      ];
    }

    // save the updated workflow
    const updatedWorkflow = await workflow.save();

    res.status(200).json({
      success: true,
      message: "Workflow updated successfully",
      data: updatedWorkflow,
    });
  } catch (error) {
    console.log("Delete workflow controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get all workflows of a specific token
const getAllWorkflowsOfToken = async (req, res) => {
  const { token } = req.params;
  const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
  const perPage = 10; // number of results per page

  try {
    const totalCount = await Workflow.countDocuments({ token });
    const totalPages = Math.ceil(totalCount / perPage);
    const skip = (page - 1) * perPage;

    const workflows = await Workflow.find({ token })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(perPage);

    res.status(200).json({
      success: true,
      message: "Workflows found.",
      data: workflows,
      totalPages,
      currentPage: page,
      totalResults: totalCount,
    });
  } catch (error) {
    console.log("Get all workflows controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getSingleWorkflow = async (req, res) => {
  const { id: workflowId } = req.params;

  try {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow not found" });
    }
    res.status(200).json({
      success: true,
      message: "workflow found",
      data: workflow,
    });
  } catch (error) {
    console.log("Get single workflows controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createWorkflow,
  deleteWorkflow,
  getAllWorkflowsOfToken,
  editWorkflow,
  getSingleWorkflow,
};
