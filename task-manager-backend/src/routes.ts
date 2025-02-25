import express from "express";
import * as controllers from "./controllers"; // Updated import

const router = express.Router();

router.get("/tasks", controllers.getTasks);
router.get("/tasks/:id", controllers.getTaskById);
router.post("/tasks", controllers.createTask);
router.put("/tasks/:id", controllers.updateTask);
router.delete("/tasks/:id", controllers.deleteTask);
router.get("/streaming", controllers.getStreamingData);

export default router;
