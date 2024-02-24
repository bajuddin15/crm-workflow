import express from "express";
import { incomingMessage } from "../controllers/incoming.controller.js";

const router = express.Router();

router.post("/", incomingMessage);

export default router;
