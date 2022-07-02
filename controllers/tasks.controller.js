// Models
const { Task } = require('../models/task.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.findAll();

  res.status(200).json({
    status: 'success',
    tasks,
  });
});


const createTask = catchAsync(async (req, res, next) => {
  const { title, userId, limitDate } = req.body;

  const newTask = await Task.create({
    title,
    userId,
    startDate: new Date(),
    limitDate,
  });

  res.status(201).json({
    status: 'success',
    newTask,
  });
});


const getTasksByStatus = catchAsync(async (req, res, next) => {
  const { status } = req.params;

  if (status === 'active' || 'completed' || 'late' || 'cancelled') {
    const validatedStatus = await Task.findAll({ where: { status } });

    res.status(200).json({
      status: 'success',
      validatedStatus,
    });
  }
});


const updateTaskById = catchAsync(async (req, res, next) => {
  const { finishDate } = req.body; 

  const { task } = req;

  if (task.status === 'active') {
    await task.update({ finishDate });
    let finishDateUser = new Date(finishDate); 

    let limitDate = new Date(task.limitDate); 

    if (finishDateUser.valueOf() < limitDate.valueOf()) {
      res.status(201).json({
        status: 'completed',
        task,
      });

    } else {
      res.status(201).json({
        status: 'late',
        task,
      });
    }
  }
});


const cancelTask = catchAsync(async (req, res, next) => {
  const { task } = req;

  await task.update({ status: 'cancelled' });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllTasks,
  createTask,
  getTasksByStatus,
  updateTaskById,
  cancelTask,
};
