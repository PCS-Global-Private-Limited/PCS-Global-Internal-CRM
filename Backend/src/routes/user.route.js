import express from "express";

import { signupUser,loginUser } from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login",loginUser)

export default userRouter;
