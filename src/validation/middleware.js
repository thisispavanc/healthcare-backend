const { asyncHandler } = require('../middleware/errorHandler');

// Validation middleware factory
const validate = (schema, source = 'body') => {
  return asyncHandler(async (req, res, next) => {
    const dataToValidate = req[source];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
      });
    }
    
    // Replace the original data with validated and sanitized data
    req[source] = value;
    next();
  });
};

module.exports = { validate };