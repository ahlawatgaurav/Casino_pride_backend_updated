const joi = require("joi");

module.exports.validateuser = (requestParams) => {
  let joiSchema = joi.object({
    Username: joi.string().required(),
    Password: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.loginUser = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    UserType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.logoutUser = (requestParams) => {
  let joiSchema = joi.object({
    UserId: joi.number().required(),
    AuthToken:joi.string().required()
  });
  return joiSchema.validate(requestParams);
};
