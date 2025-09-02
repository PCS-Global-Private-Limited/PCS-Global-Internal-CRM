import Attendance from "../models/attendence.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const checkIn = async (req, res) => {
  try {
    const token = req.cookies?.token;
    console.log("token:", token);

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log("decoded:", decoded);

    // Check if user already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alreadyCheckedInToday = await Attendance.findOne({
      userId: decoded.userId,
      checkIn: { $gte: today },
    });

    if (alreadyCheckedInToday) {
      return res.status(400).json({
        success: false,
        message: "You have already checked in today.",
      });
    }

    // Create new attendance record
    const newAttendance = await Attendance.create({
      userId: decoded.userId,
      checkIn: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Checked in successfully",
      data: newAttendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    // 🔹 Get token from cookies
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    // 🔹 Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // 🔹 Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({
      userId: decoded.userId,
      checkIn: { $gte: today },
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "You haven't checked in today.",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out today.",
      });
    }

    // 🔹 Update checkout time
    attendance.checkOut = new Date();
    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Checked out successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Check-out Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkUserCheckInStatus = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token" });
    }

    // ✅ Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.userId;

    // ✅ Set today's start time (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Check if user has checked in today
    const existingAttendance = await Attendance.findOne({
      userId: userId,
      checkIn: { $gte: today },
      checkOut: null, // ✅ Ensure user hasn't checked out yet
    });

    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        checkedIn: true,
        message: "User has already checked in today",
      });
    } else {
      return res.status(200).json({
        success: true,
        checkedIn: false,
        message: "User has not checked in today",
      });
    }
  } catch (error) {
    console.error("Error in checkUserCheckInStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const checkUserCheckOutStatus = async (req, res) => {
  try {
    // ✅ Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token" });
    }

    // ✅ Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.userId;

    // ✅ Set today's start time (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Find today's attendance record
    const existingAttendance = await Attendance.findOne({
      userId: userId,
      checkIn: { $gte: today },
    });

    // ✅ If no attendance found
    if (!existingAttendance) {
      return res.status(200).json({
        success: true,
        checkedOut: false,
        message: "User has not checked in today",
      });
    }

    // ✅ If user has already checked out
    if (existingAttendance.checkOut) {
      return res.status(200).json({
        success: true,
        checkedOut: true,
        message: "User has already checked out today",
      });
    }

    // ✅ If user hasn't checked out yet
    return res.status(200).json({
      success: true,
      checkedOut: false,
      message: "User has not checked out yet",
    });

  } catch (error) {
    console.error("Error in checkUserCheckOutStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getEmployeeDataWithAttendance = async (req, res) => {
  try {
    // ✅ Verify JWT from cookies
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // ✅ Fetch all users
    const users = await User.find().sort({ firstName: 1 });

    // ✅ Fetch all attendance records
    const attendances = await Attendance.find().lean();

    // ✅ Create a Map for attendance grouped by userId
    const attendanceMap = {};
    attendances.forEach((attendance) => {
      const dateKey = attendance.checkIn.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!attendanceMap[attendance.userId]) {
        attendanceMap[attendance.userId] = {};
      }
      attendanceMap[attendance.userId][dateKey] = {
        _id: attendance._id,
        loginTime: attendance.checkIn ? attendance.checkIn.toISOString() : null, // send ISO string
        logoutTime: attendance.checkOut ? attendance.checkOut.toISOString() : null, // send ISO string
        status: attendance.checkOut
          ? "logged_out"
          : new Date(attendance.checkIn).toDateString() === new Date().toDateString()
            ? "active"
            : "break",
      };
    });

    // ✅ Prepare final response in required format
    const allEmployeeData = users.map((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      const avatar = `${user.firstName[0] || ""}${user.lastName[0] || ""}`.toUpperCase();

      // ✅ Dates-wise attendance data
      const dates = {};
      const userAttendance = attendanceMap[user._id] || {};

      // Merge existing attendance with default offline status for missing dates
      Object.keys(userAttendance).forEach((dateKey) => {
        dates[dateKey] = userAttendance[dateKey];
      });

      return {
        _id: user._id,
        name: fullName,
        avatar,
        dates,
      };
    });

    res.status(200).json({
      success: true,
      data: allEmployeeData,
    });
  } catch (error) {
    console.error("Error in getEmployeeDataWithAttendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

