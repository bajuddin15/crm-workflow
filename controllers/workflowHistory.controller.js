import WorkflowHistory from "../models/workflowHistory.model.js";

const getAllHistory = async (req, res) => {
  const { id: workflowId } = req.params;
  try {
    const allHistory = await WorkflowHistory.find({ workflowId })
      .populate("actionId")
      .sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      message: "History Data found.",
      data: allHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createWorkflowHistory = async (req, res) => {
  const { workflowId, actionId, status, actionName, apiResponse } = req.body;
  try {
    const newHistory = new WorkflowHistory({
      workflowId,
      actionId,
      status,
      actionName,
      apiResponse,
    });
    await newHistory.save();
    res.status(201).json({
      success: true,
      message: "History created",
      data: newHistory,
    });
  } catch (error) {
    console.log(`Create workflow history error : `, error?.message);
    res.status(500).json({ success: false, message: error?.message });
  }
};

export { getAllHistory, createWorkflowHistory };
