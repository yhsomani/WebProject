const { schemas } = require('../utils/validation/validator');

const paginationMiddleware = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const validationResult = schemas.pagination.validate({ page, limit });
    if (validationResult.error) {
      req.pagination = { page: 1, limit: 10 };
    } else {
      req.pagination = {
        page: parseInt(page),
        limit: parseInt(limit)
      };
    }

    req.pagination.offset = (req.pagination.page - 1) * req.pagination.limit;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = paginationMiddleware;
