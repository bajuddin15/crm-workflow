import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";

import workflowRoutes from "./routes/workflow.route.js";
import triggierCategoryRoutes from "./routes/triggerCategory.route.js";
import actionCategoryRoutes from "./routes/actionCategory.route.js";
import workflowTriggerRoutes from "./routes/workflowTrigger.route.js";
import workflowActionRoutes from "./routes/workflowAction.route.js";

const __dirname = path.resolve();
dotenv.config();

// Express app initialisation
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// all routes
app.use("/api/workflow", workflowRoutes);
app.use("/api/triggerCategory", triggierCategoryRoutes);
app.use("/api/actionCategory", actionCategoryRoutes);
app.use("/api/workflowTrigger", workflowTriggerRoutes);
app.use("/api/workflowAction", workflowActionRoutes);

app.post("/api/incoming", async (req, res) => {
  const { msgId, toNumber, fromNumber, message, mediaUrl, channel, email } =
    req.body;

  try {
    res
      .status(200)
      .json({ success: true, message: "Data received", data: req.body });
  } catch (error) {
    console.log(`Incoming controller error : `, error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// bundle frontend code here i mean dist folder
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client", "dist", "index.html"));
});

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
