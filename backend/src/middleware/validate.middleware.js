const { validationResult } = require('express-validator');
const AppError = require('../utils/errors/AppError');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new AppError(errorMessages[0], 400);
  }
  next();
};
