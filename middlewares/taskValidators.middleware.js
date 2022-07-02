const { body, validationResult } = require('express-validator');

//utils
const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => err.msg);
    const message = errorMsg.join('. ');
    return next(new AppError(message, 400));
  }

  next();
};

const createTaskValidators = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('userId').notEmpty().withMessage('userId cannot be empty'),

  checkResult,
];

module.exports = { createTaskValidators };
