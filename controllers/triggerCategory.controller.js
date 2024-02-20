import TriggerCategory from "../models/triggerCategory.model.js";

const createTriggerCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newTriggerCat = new TriggerCategory({ name });
    await newTriggerCat.save();
    res.status(201).json({
      success: true,
      message: "Trigger category created successfully",
    });
  } catch (error) {
    console.log("Create trigger category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const deleteTriggerCategory = async (req, res) => {
  const { id: triggerId } = req.params;
  try {
    const findTriggerCat = await TriggerCategory.findById(triggerId);
    if (!findTriggerCat) {
      return res
        .status(404)
        .json({ success: false, message: "This Trigger Category not found" });
    }
    await TriggerCategory.findByIdAndDelete(triggerId);
    res.status(200).json({
      success: true,
      message: "Trigger Category deleted successfully",
    });
  } catch (error) {
    console.log("Delete trigger category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const editTriggerCategory = async (req, res) => {
  const { id: triggerId } = req.params;
  const { name } = req.body;
  try {
    // Find the trigger category by ID
    const triggerCategory = await TriggerCategory.findById(triggerId).populate(
      "triggers"
    );
    if (!triggerCategory) {
      return res.status(404).json({ error: "Trigger category not found" });
    }

    // Update trigger category fields
    triggerCategory.name = name || triggerCategory.name;

    // Save the updated trigger category
    const updatedCategory = await triggerCategory.save();
    res.status(200).json({
      success: true,
      message: "Trigger Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("Edit trigger category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTriggerCategories = async (req, res) => {
  try {
    const triggerCats = await TriggerCategory.find().populate("triggers");
    res.status(200).json({
      success: true,
      message: "Trigger categories found",
      data: triggerCats,
    });
  } catch (error) {
    console.log("Get trigger category controller error : ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createTriggerCategory,
  deleteTriggerCategory,
  editTriggerCategory,
  getTriggerCategories,
};
