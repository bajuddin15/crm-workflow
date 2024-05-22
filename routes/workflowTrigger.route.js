import express from "express";
import {
  createWorkflowTrigger,
  deleteWorkflowTrigger,
  editWorkflowTrigger,
  getAllTriggers,
  getSingleTrigger,
} from "../controllers/workflowTrigger.controller.js";

const router = express.Router();

// Route Prefix - /api/workflowTrigger
router.post("/create", createWorkflowTrigger);
router.get("/allTriggers/:id", getAllTriggers);
router.get("/:id", getSingleTrigger);
router.delete("/:id", deleteWorkflowTrigger);
router.put("/:id", editWorkflowTrigger);

export default router;
