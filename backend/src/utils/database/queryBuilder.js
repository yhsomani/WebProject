class QueryBuilder {
  constructor(model) {
    this.model = model;
    this.query = {};
    this.options = {};
  }

  filter(filters = {}) {
    this.query = { ...this.query, ...filters };
    return this;
  }

  select(fields = []) {
    if (fields.length > 0) {
      this.options.attributes = fields;
    }
    return this;
  }

  include(relations = []) {
    if (relations.length > 0) {
      this.options.include = relations;
    }
    return this;
  }

  sort(sortBy = 'createdAt', order = 'DESC') {
    this.options.order = [[sortBy, order]];
    return this;
  }

  paginate(page = 1, limit = 10) {
    this.options.offset = (page - 1) * limit;
    this.options.limit = limit;
    return this;
  }

  async execute() {
    try {
      const { count, rows } = await this.model.findAndCountAll({
        where: this.query,
        ...this.options
      });

      return {
        data: rows,
        total: count,
        page: Math.floor(this.options.offset / this.options.limit) + 1,
        limit: this.options.limit
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne() {
    try {
      return await this.model.findOne({
        where: this.query,
        ...this.options
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QueryBuilder;
