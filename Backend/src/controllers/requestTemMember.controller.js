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

// ✅ List Team Member Requests (optional status filter)
export const listTeamMemberRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
      filter.status = status;
    }

    const requests = await TeamMemberRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "senderId",
        select: "firstName lastName employeeId email",
      })
      .populate({
        path: "selectedMembers",
        select: "firstName lastName employeeId email",
      });

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error listing team member requests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a single Team Member Request by ID
export const getTeamMemberRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TeamMemberRequest.findById(id)
      .populate({ path: "senderId", select: "firstName lastName employeeId email branch designation" })
      .populate({ path: "selectedMembers", select: "firstName lastName employeeId email branch designation" });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Error fetching request by id:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update request status (Approved / Rejected)
export const updateTeamMemberRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updated = await TeamMemberRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({ path: "senderId", select: "firstName lastName employeeId email branch designation" })
      .populate({ path: "selectedMembers", select: "firstName lastName employeeId email branch designation" });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", request: updated });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};