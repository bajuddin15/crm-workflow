import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import connectDB from "./config/db.js";

import workflowRoutes from "./routes/workflow.route.js";
import triggierCategoryRoutes from "./routes/triggerCategory.route.js";
import actionCategoryRoutes from "./routes/actionCategory.route.js";
import workflowTriggerRoutes from "./routes/workflowTrigger.route.js";
import workflowActionRoutes from "./routes/workflowAction.route.js";
import incomingRoutes from "./routes/incoming.route.js";
import workflowHistoryRoutes from "./routes/workflowHistory.route.js";

import webhookRoutes from "./routes/webhook.route.js";

const __dirname = path.resolve();
dotenv.config();

// Express app initialisation
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// all routes
app.use("/api/workflow", workflowRoutes);
app.use("/api/triggerCategory", triggierCategoryRoutes);
app.use("/api/actionCategory", actionCategoryRoutes);
app.use("/api/workflowTrigger", workflowTriggerRoutes);
app.use("/api/workflowAction", workflowActionRoutes);
app.use("/api/incoming", incomingRoutes);
app.use("/api/workflowHistory", workflowHistoryRoutes);

//
app.use("/workflow/sendwebhookdata", webhookRoutes);

// bundle frontend code here i mean dist folder
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client", "dist", "index.html"));
});

// listen all requests resposes

// Server listening and database connection
const PORT = process.env.PORT ?? 5000;
connectDB()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
