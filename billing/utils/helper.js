const applib = require("applib");

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
