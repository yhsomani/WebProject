/**
 * Utility function to handle pagination of database queries
 * @param {Model} model - Mongoose/Sequelize model
 * @param {Object} query - Query object for filtering
 * @param {Object} options - Pagination options
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Number of items per page
 * @param {string} options.sort - Sort field and order (e.g., 'createdAt:desc')
 * @param {Array} options.populate - Array of populate options for mongoose
 * @returns {Promise<{results: Array, total: number}>}
 */
async function paginateResults(model, query = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort,
    populate = []
  } = options;

  // Calculate skip value
  const skip = (page - 1) * limit;

  // Parse sort option
  let sortOptions = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortOptions[field] = order === 'desc' ? -1 : 1;
  }

  // Build query
  let queryBuilder = model.find(query)
    .skip(skip)
    .limit(parseInt(limit));

  // Add sort if specified
  if (Object.keys(sortOptions).length > 0) {
    queryBuilder = queryBuilder.sort(sortOptions);
  }

  // Add population
  populate.forEach(populateOption => {
    queryBuilder = queryBuilder.populate(populateOption);
  });

  // Execute query
  const [results, total] = await Promise.all([
    queryBuilder.exec(),
    model.countDocuments(query)
  ]);

  return {
    results,
    total
  };
}

module.exports = {
  paginateResults
};
