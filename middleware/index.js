const appLib = require("applib");
const logger = new appLib.Logger(null);
const validateModel = require("./model/requestModel/validate")
const errorModel = require("./model/requestModel/error").ErrorModel
const errorConstant = require("./constant/error")
const settings = require("./constant/settings").settings
const momentTimezone = require("moment-timezone");
const config = require("./helper/database/config")
const dbHelper = require("./helper/database/validate")

module.exports.validateRequest = async (req, res, next) => {
    logger.logInfo("validateRequest() invoked");
  
    const functionContext = {
      error: null,
      logger: logger,
      res: res,
    };
  
    const apiContext = {
      userId: 0,
      currenTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss.SSS")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss.SSS"),
    };
  
    res.apiContext = apiContext;
  
    const validateRequest = new validateModel.ValidateRequest(req);
    const validateResponse = new validateModel.ValidateResponse(req);
  
    if (!validateRequest.apiUri || !validateRequest.authorization) {
      functionContext.error = new errorModel(
        errorConstant.errorMessage.Invalid_App_Authorization,
        errorConstant.errorCode.Invalid_App_Authorization
      );
  
      logger.logInfo(`validateRequest() Error:: Invalid Request :: 
      ${JSON.stringify(validateRequest)}`);
  
      validateResponse.Error = functionContext.error;
  
      appLib.SendHttpResponse(functionContext, validateResponse);
  
      return;
    }
    await appLib.fetchDBSettings(logger, settings, config);
  
    const basicAuth = new Buffer(
      settings.APP_KEY + ":" + settings.APP_SECRET
    ).toString("base64");

    if (validateRequest.authorization != basicAuth) {
      functionContext.error = new errorModel(
        errorConstant.errorMessage.Invalid_App_Authorization,
        errorConstant.errorCode.Invalid_App_Authorization
      );
  
      logger.logInfo(`validateRequest() Error:: Invalid Request :: 
      ${JSON.stringify(validateRequest)}`);
  
      validateResponse.Error = functionContext.error;
      appLib.SendHttpResponse(functionContext, validateResponse);
      return;
    }
    try {
      let validateRequestResult = await dbHelper.validateRequest(
        functionContext,
        validateRequest
      );
      apiContext.userType = validateRequestResult.UserType;
      apiContext.userId = validateRequestResult.UserId;
  
      res.apiContext = apiContext;
      next();
    } catch (errValidateRequest) {
      if (!errValidateRequest.ErrorMessage && !errValidateRequest.ErrorCode) {
        logger.logInfo(`validateRequest() :: Error :: ## ${errValidateRequest}`);
        functionContext.error = new errorModel(
          errorConstant.errorMessage.ApplicationError,
          errorConstant.errorCode.ApplicationError
        );
      }
      logger.logInfo(
        `validateRequest() :: Error :: PP ${JSON.stringify(errValidateRequest)}`
      );
      validateResponse.Error = functionContext.error;
      appLib.SendHttpResponse(functionContext, validateResponse);
    }
  };
  
  module.exports.settings = settings;
