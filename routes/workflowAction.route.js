import express from "express";
import {
  createWorkflowAction,
  deleteWorkflowAction,
  editWorkflowAction,
  getAllWorkflowActions,
} from "../controllers/workflowAction.controller.js";

const router = express.Router();

// Route Prefix - /api/workflowAction
router.post("/create", createWorkflowAction);
router.get("/allActions/:id", getAllWorkflowActions);
router.delete("/:id", deleteWorkflowAction);
router.put("/:id", editWorkflowAction);

export default router;
