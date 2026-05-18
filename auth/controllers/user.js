const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { response } = require("../utils/helper");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const authDB = require("../services/user");

const validate = require("../utils/validation");

const userController = {
  validateUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`validateUser() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "validateUser",
      model: new responseModel.validateUser(),
    };

    let validateUserRequest = new requestModel.validateUser(req);

    logger.logInfo(
      `validateUser() :: Request Object :: ${validateUserRequest}`
    );

    let validateRequest = validate.validateuser(validateUserRequest);

    if (validateRequest.error) {
      functionContext.error = new errorModel.ErrorModel(
        validateRequest.error.details[0]["message"],
        constant.ErrorCode.Invalid_Request
      );
      logger.logInfo(
        `validateUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      let validateUserDBResult = await authDB.validateUser(
        functionContext,
        validateUserRequest
      );

      response(functionContext, responseObj, validateUserDBResult);
    } catch (errValidateUser) {
      if (!errValidateUser.ErrorMessage && !errValidateUser.ErrorCode) {
        // logger.logInfo(`validateUserDBResult :: Error :: ${errValidateUser}`);
        functionContext.error = new errorModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
      logger.logInfo(
        `validateUserDBResult :: Error :: ${JSON.stringify(errValidateUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = userController;
