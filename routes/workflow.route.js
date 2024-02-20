import express from "express";
import {
  createWorkflow,
  deleteWorkflow,
  editWorkflow,
  getAllWorkflowsOfToken,
  getSingleWorkflow,
} from "../controllers/workflow.controller.js";

// Route Prefix - /api/workflow

const router = express.Router();

// workflows routes
router.post("/create", createWorkflow);
router.delete("/:id", deleteWorkflow);
router.put("/:id", editWorkflow);
router.get("/all/:token", getAllWorkflowsOfToken);
router.get("/:id", getSingleWorkflow);

export default router;
