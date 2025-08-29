import express from 'express';
import { getUserTasks, createTask, updateTaskStatus } from '../controllers/task.controller.js';
import { authenticateToken, validateSession } from '../middleware/auth.js';

const taskRouter = express.Router();

taskRouter.get('/tasks', authenticateToken, validateSession, getUserTasks);
taskRouter.post('/tasks', authenticateToken, validateSession, createTask);
taskRouter.patch('/tasks/:taskId/status', authenticateToken, validateSession, updateTaskStatus);

export default taskRouter;
