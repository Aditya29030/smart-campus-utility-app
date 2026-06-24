const Task = require('../models/Task');

// @desc Get all tasks for logged-in user
// @route GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc Create a task/assignment
// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, type, subject, dueDate, priority, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      type,
      subject,
      dueDate,
      priority,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc Update a task
// @route PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    Object.assign(task, req.body);
    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task removed', _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
