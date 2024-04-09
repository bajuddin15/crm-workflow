import express from "express";
import {
  createWorkflowHistory,
  getAllHistory,
} from "../controllers/workflowHistory.controller.js";

const router = express.Router();

/* Prefix - /api/workflowHistory */
router.get("/allHistory/:id", getAllHistory);
router.post("/create", createWorkflowHistory);

export default router;
