import TeamMemberRequest from "../models/requestTeamMember.model.js";
import jwt from "jsonwebtoken";

// ✅ Create a new Team Member Request
export const requestTeamMember = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Decode JWT to verify sender (optional, since senderId is also coming in body)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const { memberType, projectTitle,projectId, reason, selectedMembers, senderId } = req.body;

    if (!memberType || !projectTitle || !reason || !selectedMembers || selectedMembers.length === 0) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const request = await TeamMemberRequest.create({
      memberType,
      projectTitle,
      projectId,
      reason,
      selectedMembers,
      senderId: senderId || decoded.userId, // fallback to logged-in user
    });

    res.status(201).json({
      success: true,
      message: "Team member request created successfully",
      request,
    });
  } catch (error) {
    console.error("Error creating team member request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
