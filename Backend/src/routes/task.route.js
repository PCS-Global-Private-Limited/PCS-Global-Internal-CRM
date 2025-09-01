import express from "express";
// import { getUserTasks, updateTaskStatus } from '../controllers/task.controller.js';
// import { authenticateToken, validateSession } from '../middleware/auth.js';
import { assignEmployeesToTask, createTask, getAllTasks,getMyTasks,getProjectDetails } from "../controllers/task.controller.js";
import { uploadDocuments } from "../config/uploadDoc.cloudinary.js";

const taskRouter = express.Router();

// taskRouter.get('/tasks', authenticateToken, validateSession, getUserTasks);
// taskRouter.post('/tasks', authenticateToken, validateSession, createTask);
// taskRouter.patch('/tasks/:taskId/status', authenticateToken, validateSession, updateTaskStatus);
taskRouter.post("/create", createTask);
taskRouter.get("/get-all", getAllTasks);
taskRouter.get("/my-tasks", getMyTasks);
taskRouter.put("/assign", assignEmployeesToTask);
taskRouter.post("/upload-documents", uploadDocuments);

taskRouter.get("/project-details/:projectId", getProjectDetails);

export default taskRouter;
