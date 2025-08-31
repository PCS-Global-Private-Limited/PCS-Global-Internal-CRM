import Task from "../models/task.model.js";
import jwt from "jsonwebtoken";

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
