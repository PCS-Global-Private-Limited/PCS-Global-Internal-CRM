// models/TeamMemberRequest.js
import mongoose from "mongoose";

const teamMemberRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // refers to the User who created the request
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // if you have a Project model, otherwise keep as String
      required: false,
    },
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },
    memberType: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    selectedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // selected employees
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const TeamMemberRequest = mongoose.model(
  "TeamMemberRequest",
  teamMemberRequestSchema
);

export default TeamMemberRequest;
