import express from "express";

import {
  signupUser,
  loginUser,
  logoutUser,
  verifyUser,
} from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/auth/verify", verifyUser);

export default userRouter;
