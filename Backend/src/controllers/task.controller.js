import Task from '../models/Task.js';

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { task, project, dueDate, assignedTo } = req.body;
    
    const newTask = await Task.create({
      task,
      project,
      dueDate,
      assignedTo,
      createdBy: req.user.userId,
      status: 'To do'
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findOne({ 
      _id: taskId,
      assignedTo: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};
