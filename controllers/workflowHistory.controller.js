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

export { getAllHistory };
