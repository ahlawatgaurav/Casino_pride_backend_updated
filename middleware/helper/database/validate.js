const databaseModule = require("./config")
const errorModel = require("../../model/requestModel/error")
const constant = require("../../constant/error")

module.exports.validateRequest = async (functionContext, resolvedResult) => {

    const logger = functionContext.logger;
    logger.logInfo("validateRequest() Invoked!");
  
    try {
      let result = await databaseModule.knex.raw(`CALL usp_validate_request(
              '${resolvedResult.apiUri}',
              '${resolvedResult.appAuth}')`);
      logger.logInfo("validRequest() :: Api validated Successfully");
  
      return result[0][0][0];
    } catch (errValidateRequest) {
      logger.logInfo(
        `validateRequest() :: Error :: Helper ${JSON.stringify(errValidateRequest)}`
      );
  
      let errorCode = null;
      let errorMessage = null;
      if (
        errValidateRequest.sqlState &&
        errValidateRequest.sqlState == constant.errorCode.Invalid_Request_Url
      ) {
        errorCode = constant.errorCode.Invalid_Request_Url;
        errorMessage = constant.errorMessage.Invalid_Request_Url;
      } else if (
        errValidateRequest.sqlState &&
        errValidateRequest.sqlState == constant.errorCode.Invalid_User_Credentials
      ) {
        errorCode = constant.errorCode.Invalid_User_Credentials;
        errorMessage = constant.errorMessage.Invalid_User_Credentials;
      } else {
        errorCode = constant.errorCode.ApplicationError;
        errorMessage = constant.errorMessage.ApplicationError;
      }
      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );
      throw functionContext.error;
    }
  };
  