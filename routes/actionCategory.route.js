import express from "express";
import {
  createActionCategory,
  deleteActionCategory,
  editActionCategory,
  getActionCategories,
} from "../controllers/actionCategory.controller.js";

const router = express.Router();

// Prefix route - /api/actionCategory

router.post("/create", createActionCategory);
router.get("/", getActionCategories);
router.delete("/:id", deleteActionCategory);
router.put("/:id", editActionCategory);

export default router;
