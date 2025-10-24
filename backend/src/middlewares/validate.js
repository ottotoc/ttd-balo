const { BadRequestError } = require('../common/errors');

// Simple validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { body, query, params } = req;
    
    // Basic validation - can be extended with joi or zod
    if (schema.body) {
      for (const field of schema.body.required || []) {
        if (!body[field]) {
          throw new BadRequestError(`Field '${field}' is required`);
        }
      }
    }

    if (schema.query) {
      for (const field of schema.query.required || []) {
        if (!query[field]) {
          throw new BadRequestError(`Query parameter '${field}' is required`);
        }
      }
    }

    next();
  };
};

module.exports = validate;

