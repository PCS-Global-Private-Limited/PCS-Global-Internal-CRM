import Task from "../models/task.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ✅ Helper function to update overall status automatically
const updateOverallStatus = async (task) => {
  if (!task.assignees || task.assignees.length === 0) {
    task.overallStatus = "unassigned";
  } else {
    const allCompleted = task.assignees.every((a) => a.status === "completed");
    const allNotStarted = task.assignees.every(
      (a) => a.status === "not started"
    );
    const inProgress = task.assignees.some((a) => a.status === "in progress");

    if (allCompleted) task.overallStatus = "completed";
    else if (allNotStarted) task.overallStatus = "not started";
    else if (inProgress) task.overallStatus = "in progress";
    else task.overallStatus = "not started";
  }
  await task.save();
};

// ✅ Create a new task
export const createTask = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
  console.log("decoded:", decoded);

  try {
    const { title, description, deadline, documentUrls } = req.body;

    const task = await Task.create({
      title,
      description,
      deadline,
      documentUrls,
      createdBy: decoded.userId,
    });

    await updateOverallStatus(task);

    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    // Extract user ID from JWT token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const userId = decoded.userId;

    // Find tasks where the authenticated user is assigned
    const tasks = await Task.find({
      "assignees.userId": userId
    })
    .populate("createdBy", "firstName lastName email")
    .populate("assignees.userId", "firstName lastName email")
    .sort({ createdAt: -1 });

    // Format response similar to the above function
    const myTasks = tasks.map(task => {
      const myAssignee = task.assignees.find(
        assignee => assignee.userId._id.toString() === userId
      );

      return {
        _id: task._id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        documentUrls: task.documentUrls,
        createdBy: task.createdBy,
        overallStatus: task.overallStatus,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        myStatus: myAssignee ? myAssignee.status : "not assigned",
        allAssignees: task.assignees
      };
    });

    const tasksByStatus = {
      "not started": myTasks.filter(task => task.myStatus === "not started"),
      "in progress": myTasks.filter(task => task.myStatus === "in progress"),
      "completed": myTasks.filter(task => task.myStatus === "completed")
    };

    res.status(200).json({
      success: true,
      message: "My tasks retrieved successfully",
      totalTasks: myTasks.length,
      tasks: myTasks,
      tasksByStatus,
      summary: {
        notStarted: tasksByStatus["not started"].length,
        inProgress: tasksByStatus["in progress"].length,
        completed: tasksByStatus["completed"].length
      }
    });

  } catch (error) {
    console.error("Error fetching my tasks:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required"
      });
    }

    // Validate if projectId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }

    // Find the project/task by ID and populate related fields
    const project = await Task.findById(projectId)
      .populate("createdBy", "firstName lastName email role")
      .populate("assignees.userId", "firstName lastName email role")
      .lean(); // Use lean() for better performance when we don't need mongoose document methods

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Calculate project statistics
    const totalAssignees = project.assignees.length;
    const completedAssignees = project.assignees.filter(a => a.status === "completed").length;
    const inProgressAssignees = project.assignees.filter(a => a.status === "in progress").length;
    const notStartedAssignees = project.assignees.filter(a => a.status === "not started").length;

    // Calculate completion percentage
    const completionPercentage = totalAssignees > 0 ? 
      Math.round((completedAssignees / totalAssignees) * 100) : 0;

    // Check if project is overdue
    const currentDate = new Date();
    const deadline = new Date(project.deadline);
    const isOverdue = currentDate > deadline && project.overallStatus !== "completed";
    
    // Calculate days until deadline (negative if overdue)
    const daysUntilDeadline = Math.ceil((deadline - currentDate) / (1000 * 60 * 60 * 24));

    // Format assignees with additional details
    const formattedAssignees = project.assignees.map(assignee => ({
      _id: assignee.userId._id,
      firstName: assignee.userId.firstName,
      lastName: assignee.userId.lastName,
      email: assignee.userId.email,
      role: assignee.userId.role,
      status: assignee.status,
      fullName: `${assignee.userId.firstName} ${assignee.userId.lastName}`
    }));

    // Prepare detailed project response
    const projectDetails = {
      _id: project._id,
      title: project.title,
      description: project.description,
      deadline: project.deadline,
      documentUrls: project.documentUrls,
      overallStatus: project.overallStatus,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      
      // Creator details
      createdBy: {
        _id: project.createdBy._id,
        firstName: project.createdBy.firstName,
        lastName: project.createdBy.lastName,
        email: project.createdBy.email,
        role: project.createdBy.role,
        fullName: `${project.createdBy.firstName} ${project.createdBy.lastName}`
      },
      
      // Assignees details
      assignees: formattedAssignees,
      
      // Project statistics
      statistics: {
        totalAssignees,
        completedAssignees,
        inProgressAssignees,
        notStartedAssignees,
        completionPercentage
      },
      
      // Timeline information
      timeline: {
        isOverdue,
        daysUntilDeadline,
        deadlineStatus: isOverdue ? "overdue" : 
                       daysUntilDeadline <= 3 ? "urgent" : 
                       daysUntilDeadline <= 7 ? "soon" : "normal"
      },
      
      // Document information
      documents: {
        count: project.documentUrls ? project.documentUrls.length : 0,
        urls: project.documentUrls || []
      }
    };

    res.status(200).json({
      success: true,
      message: "Project details retrieved successfully",
      project: projectDetails
    });

  } catch (error) {
    console.error("Error fetching project details:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const assignEmployeesToTask = async (req, res) => {
  try {
    const { taskId, employeeIds } = req.body;

    // Validate inputs
    if (!taskId || !employeeIds || !Array.isArray(employeeIds)) {
      return res.status(400).json({
        success: false,
        message: "Task ID and employee IDs are required",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Convert employeeIds into the format required for assignees
    const newAssignees = employeeIds.map((id) => ({
      userId: id,
      status: "not started",
    }));

    let updatedTask;

    // Update the task's assignees (without duplicates)
    if (task.overallStatus === "unassigned") {
      updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
          $addToSet: {
            assignees: { $each: newAssignees },
          },
          $set: { overallStatus: "not started" },
        },
        { new: true }
      );
    } else {
      updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
          $addToSet: {
            assignees: { $each: newAssignees },
          },
        },
        { new: true }
      );
    }

    //.populate("assignees.userId", "firstName lastName email"); // populate user details if needed

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employees assigned successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error assigning employees:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Get single task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignees.userId",
      "name email"
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update task details
export const updateTask = async (req, res) => {
  try {
    const { title, description, deadline, documentUrl } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline, documentUrl },
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update status of a specific assignee in a task
export const updateAssigneeStatus = async (req, res) => {
  try {
    const { taskId, userId, status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const assignee = task.assignees.find((a) => a.userId.toString() === userId);

    if (!assignee) {
      return res
        .status(404)
        .json({ success: false, message: "User is not assigned to this task" });
    }

    assignee.status = status;

    await updateOverallStatus(task);

    res
      .status(200)
      .json({ success: true, message: "Assignee status updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
