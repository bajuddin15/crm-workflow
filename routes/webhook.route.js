import express from "express";
import { allWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.all("/:triggerId", allWebhook);
export default router;
