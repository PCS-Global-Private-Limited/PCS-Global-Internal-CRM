import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignees: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // User model ka reference
          required: true,
        },
        name: {
          type: String,
        },
        status: {
          type: String,
          enum: ["todo", "in progress", "completed"],
          default: "todo",
        },
      },
    ],
    deadline: {
      type: Date,
      required: true,
    },
    documentUrls: {
      type: [String], // Array of strings (Cloudinary URLs)
      required: false,
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    overallStatus: {
      type: String,
      enum: ["unassigned", "not started", "in progress", "completed"],
      default: "unassigned", // By default agar koi assignee nahi hai
    },
    requestTeamMember: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt fields automatically add honge
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
