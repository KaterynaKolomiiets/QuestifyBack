"use strict";

var Joi = require("joi");

module.exports = {
  userValidation: function userValidation(req, res, next) {
    var schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      subscription: Joi.string(),
      token: Joi.string()
    });
    var validationResult = schema.validate(req.body);
    if (validationResult.error) return res.status(400).json({
      message: validationResult.error.details
    });
    next();
  }
};