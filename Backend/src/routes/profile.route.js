import express from 'express';
import { getUserProfile, updateAvatar, addSkill, removeSkill } from '../controllers/profile.controller.js';
import { authenticateToken, validateSession } from '../middleware/auth.js';

const profileRouter = express.Router();

// Apply both authentication and session validation
profileRouter.get('/profile', authenticateToken, validateSession, getUserProfile);
profileRouter.post('/profile/avatar', authenticateToken, validateSession, updateAvatar);
profileRouter.post('/profile/skills', authenticateToken, validateSession, addSkill);
profileRouter.delete('/profile/skills', authenticateToken, validateSession, removeSkill);

export default profileRouter;