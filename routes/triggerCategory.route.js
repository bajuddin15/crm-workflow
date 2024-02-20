import express from "express";
import {
  createTriggerCategory,
  deleteTriggerCategory,
  editTriggerCategory,
  getTriggerCategories,
} from "../controllers/triggerCategory.controller.js";

const router = express.Router();

// Prefix route - /api/triggerCategory

router.post("/create", createTriggerCategory);
router.get("/", getTriggerCategories);
router.delete("/:id", deleteTriggerCategory);
router.put("/:id", editTriggerCategory);

export default router;
