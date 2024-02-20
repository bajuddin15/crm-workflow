import ActionCategory from "../models/actionCategory.model.js";

const createActionCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newActionCat = new ActionCategory({ name });
    await newActionCat.save();
    res.status(201).json({
      success: true,
      message: "Action category created successfully",
    });
  } catch (error) {
    console.log("Create Action category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteActionCategory = async (req, res) => {
  const { id: actionId } = req.params;
  try {
    const findActionCat = await ActionCategory.findById(actionId);
    if (!findActionCat) {
      return res
        .status(404)
        .json({ success: false, message: "This Action Category not found" });
    }
    await ActionCategory.findByIdAndDelete(actionId);
    res.status(200).json({
      success: true,
      message: "Action Category deleted successfully",
    });
  } catch (error) {
    console.log("Delete action category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editActionCategory = async (req, res) => {
  const { id: actionId } = req.params;
  const { name } = req.body;
  try {
    // Find the trigger category by ID
    const actionCategory = await ActionCategory.findById(actionId).populate(
      "actions"
    );
    if (!actionCategory) {
      return res.status(404).json({ error: "This Action category not found" });
    }

    // Update trigger category fields
    actionCategory.name = name || actionCategory.name;

    // Save the updated trigger category
    const updatedCategory = await actionCategory.save();
    res.status(200).json({
      success: true,
      message: "Action Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("Edit action category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getActionCategories = async (req, res) => {
  try {
    const actionCats = await ActionCategory.find().populate("actions");
    res.status(200).json({
      success: true,
      message: "Action categories found",
      data: actionCats,
    });
  } catch (error) {
    console.log("Get action categories controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createActionCategory,
  deleteActionCategory,
  editActionCategory,
  getActionCategories,
};
