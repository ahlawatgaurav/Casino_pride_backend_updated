const applib = require("applib");
const momentTimezone = require("moment-timezone");
var requestIp = require("request-ip");

const { errorMessage, errorCode } = require("../utils/constants");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const authDB = require("../services/auth");

const validate = require("../utils/validation");

const authController = {
  login: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`loginUser() invoked!!`);

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
      name: "loginUser",
      model: new responseModel.loginUser(),
    };

    let loginUserRequest = new requestModel.loginUser(req);

    logger.logInfo(`loginUser() :: Request Object :: ${loginUserRequest}`);

    let validateRequest = validate.loginUser(loginUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `loginUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    const token = generateToken(loginUserRequest.UserId);
    loginUserRequest = {
      ...loginUserRequest,
      Token: token,
    };
    try {
      let loginUserDBResult = await authDB.loginUser(
        functionContext,
        loginUserRequest
      );

      response(functionContext, responseObj, loginUserDBResult);
    } catch (errLoginUser) {
      if (!errLoginUser.ErrorMessage && !errLoginUser.ErrorCode) {
        // logger.logInfo(`validateUserDBResult :: Error :: ${errLoginUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `validateUserDBResult :: Error :: ${JSON.stringify(errLoginUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  logout: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`logoutUser() invoked!!`);

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
      name: "logoutUser",
      model: new responseModel.logoutUser(),
    };

    let logoutUserRequest = new requestModel.logoutUser(req);

    logger.logInfo(`logoutUser() :: Request Object :: ${logoutUserRequest}`);

    let validateRequest = validate.logoutUser(logoutUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `logoutUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let logoutUserDBResult = await authDB.logoutUser(
        functionContext,
        logoutUserRequest
      );
      response(functionContext, responseObj, logoutUserDBResult);
    } catch (errLogoutUser) {
      if (!errLogoutUser.ErrorMessage && !errLogoutUser.ErrorCode) {
        // logger.logInfo(`logoutUserDBResult :: Error :: ${errLogoutUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `logoutUserDBResult :: Error :: ${JSON.stringify(errLogoutUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  checkIP: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`checkIP() invoked!!`);
    var actualIP1 = "103.225.102.194";
    var actualIP2 = "255.255.255.252 /30";
    var actualIP3 = "103.225.102.193";
    var actualIP4 = "103.29.249.4";
    var actualIP5 = "103.29.249.245";
    var actualIP6 = "36.255.234.178";
    var actualIP7 = "103.255.183.12";
    var actualIP8 = "36.255.234.149";
    var actualIP9 = "103.164.196.0";
    var actualIP10 = "103.255.182.117";
    var actualIP11 = "103.225.102.162";
    var actualIP12 = "49.15.228.74";
	  var actualIP13 = "49.15.228.78";
	  var actualIP14 = "103.237.157.7";
    var clientCurrentIp = requestIp.getClientIp(req);
    console.log("clientCurrentIp==>", clientCurrentIp);

    // Extract the IPv4 address from the ::ffff: prefix
    const extractedClientIp = clientCurrentIp.includes("::ffff:")
      ? clientCurrentIp.split(":").pop()
      : clientCurrentIp;

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
      name: "checkIP",
      model: new responseModel.checkIP(),
    };

    // Compare actualIP's and extractedClientIp
    if (
      extractedClientIp === actualIP1 ||
      extractedClientIp === actualIP2 ||
      extractedClientIp === actualIP3 ||
      extractedClientIp === actualIP4 ||
      extractedClientIp === actualIP5 ||
      extractedClientIp === actualIP6 ||
      extractedClientIp === actualIP7 ||
      extractedClientIp === actualIP8 ||
      extractedClientIp === actualIP9 ||
      extractedClientIp === actualIP10||
      extractedClientIp === actualIP11||
	    extractedClientIp === actualIP12||
	    extractedClientIp === actualIP13||
	          extractedClientIp === actualIP14
    ) {
      // IPs match
      logger.logInfo(`IPs match: ${extractedClientIp}`);
      response(functionContext, responseObj, { result: "IPs match" });
    } else {
      // IPs do not match
      logger.logInfo(`IPs do not match. Client IP: ${extractedClientIp}`);
      response(functionContext, responseObj, { result: "IPs do not match" });
    }
  },
};

module.exports = authController;
