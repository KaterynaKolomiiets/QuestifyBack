const Joi = require("joi");

module.exports = {
  userValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      subscription: Joi.string(),
      token: Joi.string(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error)
      return res.status(400).json({ message: validationResult.error.details });

    next();
  },
};
