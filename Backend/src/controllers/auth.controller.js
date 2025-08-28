import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signupUser = async (req, res) => {
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

    // Check if user already exists with the same email or employee ID
    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with the provided email, employee ID, or phone number",
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
    });

    // Save user to database
    await newUser.save();

    // Send success response
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

const loginUser = async (req, res) => {
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

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true, // cannot be accessed by JS
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.firstName + " " + user.lastName, // example
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { signupUser, loginUser };
