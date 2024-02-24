import express from "express";
import { getAllHistory } from "../controllers/workflowHistory.controller.js";

const router = express.Router();

router.get("/allHistory/:id", getAllHistory);

export default router;
