require("dotenv").config({ path: __dirname + "./.env" });

const applib = require("applib");
const jwt = require("jsonwebtoken");

module.exports.response = (functionContext, responseObj, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`${responseObj.name}Response() invoked!`);

  let functionResponse = responseObj.model;

  if (functionContext.error) {
    functionResponse.Error = functionContext.error;
    functionResponse.Details = null;
  } else {
    functionResponse.Error = null;
    functionResponse.Details = resolvedResult;
  }

  applib.SendHttpResponse(functionContext, functionResponse);

  // logger.logInfo(
  //   `${responseObj.name}Response() response :: ${JSON.stringify(
  //     functionResponse
  //   )}`
  // );

  logger.logInfo(`${responseObj.name}Response() completed`);
};

module.exports.generateToken = (userId) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: userId,
  };

  const token = jwt.sign(data, jwtSecretKey);

  return token;
};
