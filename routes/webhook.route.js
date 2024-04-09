import express from "express";
import {
  getWebhookResp,
  postWebhookResp,
} from "../controllers/webhook.controller.js";

const router = express.Router();

router.get("/:id", getWebhookResp);
router.post("/:id", postWebhookResp);

export default router;
