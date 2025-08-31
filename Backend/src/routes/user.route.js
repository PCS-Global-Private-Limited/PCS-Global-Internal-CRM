import express from "express";
import { allEmployees } from "../controllers/user.controller.js";
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
userRouter.get("/user/all-employees", allEmployees);

export default userRouter;
