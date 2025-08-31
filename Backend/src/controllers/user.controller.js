import User from "../models/user.model.js";

// ✅ Get all employees (basic info only)
export const allEmployees = async (req, res) => {
  try {
    const employees = await User.find({role:"Employee"}); // Fetch only necessary fields
    res.status(200).json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
