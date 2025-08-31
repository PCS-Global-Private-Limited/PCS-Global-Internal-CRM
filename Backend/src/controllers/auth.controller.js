import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupUser = async (req, res) => {
  try {
    const {
      branch,
      confirmPassword,
      designation,
      email,
      employeeId,
      firstName,
      lastName,
      password,
      phone,
    } = req.body;

    // Validate if all required fields are present
    if (
      !branch ||
      !designation ||
      !email ||
      !employeeId ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with the provided email, employee ID, or phone number",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      branch,
      designation,
      email,
      employeeId,
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      lastActive: new Date() // Add last active timestamp
    });

    await newUser.save();

    // Create and send token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        employeeId: newUser.employeeId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        branch: newUser.branch,
        designation: newUser.designation,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.firstName + " " + user.lastName,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};
export const verifyUser = (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.json({ success: true, userId: decoded.userId });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};