import express from "express";
import { checkIn, checkOut, checkUserCheckInStatus, checkUserCheckOutStatus, getEmployeeDataWithAttendance } from "../controllers/attendence.controller.js";

const router = express.Router();

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/check-in-status", checkUserCheckInStatus);
router.get("/check-out-status", checkUserCheckOutStatus);
router.get("/employee-data-with-attendence", getEmployeeDataWithAttendance);

export default router;
