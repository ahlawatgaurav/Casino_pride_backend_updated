const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const shiftsService = require("../services/shifts");

const validate = require("../utils/validation");

const shiftsController = {
  checkShiftForUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`checkShiftForUser() invoked!!`);

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
      name: "checkShiftForUser",
      model: new responseModel.checkShiftForUser(),
    };

    let checkShiftForUserRequest = new requestModel.checkShiftForUser(req);

    logger.logInfo(`checkShiftForUser() :: Request Object :: ${checkShiftForUserRequest}`);

    let validateRequest = validate.checkShiftForUser(checkShiftForUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `checkShiftForUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
    let CheckShiftForUserDBResult = await shiftsService.checkShiftForUser(
        functionContext,
        checkShiftForUserRequest
      );
      response(functionContext, responseObj,CheckShiftForUserDBResult);
    } catch (errCheckShiftForUser) {
      if (!errCheckShiftForUser.ErrorMessage && !errCheckShiftForUser.ErrorCode) {
        logger.logInfo(`CheckShiftForUserDBResult :: Error :: ${errCheckShiftForUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `CheckShiftForUserDBResult :: Error :: ${JSON.stringify(errCheckShiftForUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  openShift: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`openShift() invoked!!`);

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
      name: "openShift",
      model: new responseModel.openShift(),
    };

    let checkShiftForUserRequest = new requestModel.openShift(req);

    logger.logInfo(`openShift() :: Request Object :: ${checkShiftForUserRequest}`);

    let validateRequest = validate.openShift(checkShiftForUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `openShift() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
    let CheckShiftForUserDBResult = await shiftsService.checkShiftForUser(
        functionContext,
        checkShiftForUserRequest
      );
    //   response(functionContext, responseObj,CheckShiftForUserDBResult);
    if (CheckShiftForUserDBResult === null) {
         let openShiftDBResult = await shiftsService.openShift(
        functionContext,
        checkShiftForUserRequest
      );
       response(functionContext, responseObj,openShiftDBResult);
    }
    else if (CheckShiftForUserDBResult != null && CheckShiftForUserDBResult.ShiftTypeId != checkShiftForUserRequest.shiftTypeId) {
      let openShiftDBResult = await shiftsService.openShift(
        functionContext,
        checkShiftForUserRequest
      );
       response(functionContext, responseObj,openShiftDBResult);
    }
    // let openShiftDBResult = await shiftsService.openShift(
    //     functionContext,
    //     checkShiftForUserRequest
    //   );
    //    response(functionContext, responseObj,openShiftDBResult);

    } catch (errOpenShiftDBResult) {
      if (!errOpenShiftDBResult.ErrorMessage && !errOpenShiftDBResult.ErrorCode) {
        logger.logInfo(`openShiftDBResult :: Error :: ${errOpenShiftDBResult}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `openShiftDBResult :: Error :: ${JSON.stringify(errOpenShiftDBResult)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  closeShift: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`closeShift() invoked!!`);

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
      name: "closeShift",
      model: new responseModel.closeShift(),
    };

    let checkShiftForUserRequest = new requestModel.closeShift(req);

    logger.logInfo(`closeShift() :: Request Object :: ${checkShiftForUserRequest}`);

    let validateRequest = validate.closeShift(checkShiftForUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `closeShift() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
    let CloseShiftDBResult = await shiftsService.closeShift(
        functionContext,
        checkShiftForUserRequest
      );
      response(functionContext, responseObj,CloseShiftDBResult);

    } catch (errCloseShiftDBResult) {
      if (!errCloseShiftDBResult.ErrorMessage && !errCloseShiftDBResult.ErrorCode) {
        logger.logInfo(`CloseShiftDBResult :: Error :: ${errCloseShiftDBResult}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `CloseShiftDBResult :: Error :: ${JSON.stringify(errCloseShiftDBResult)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  reopenShift: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`reopenShift() invoked!!`);

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
      name: "reopenShift",
      model: new responseModel.reopenShift(),
    };

    let checkShiftForUserRequest = new requestModel.reopenShift(req);

    logger.logInfo(`reopenShift() :: Request Object :: ${checkShiftForUserRequest}`);

    let validateRequest = validate.reopenShift(checkShiftForUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `reopenShift() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
    let ReopenShiftDBResult = await shiftsService.reopenShift(
        functionContext,
        checkShiftForUserRequest
      );
      response(functionContext, responseObj,ReopenShiftDBResult);

    } catch (errReopenShiftDBResult) {
      if (!errReopenShiftDBResult.ErrorMessage && !errReopenShiftDBResult.ErrorCode) {
        logger.logInfo(`ReopenShiftDBResult :: Error :: ${errReopenShiftDBResult}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `ReopenShiftDBResult :: Error :: ${JSON.stringify(errReopenShiftDBResult)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  recentShiftForOutlet: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`recentShiftForOutlet() invoked!!`);

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
      name: "recentShiftForOutlet",
      model: new responseModel.recentShiftForOutlet(),
    };

    let recentShiftForOutletRequest = new requestModel.recentShiftForOutlet(req);

    logger.logInfo(`recentShiftForOutlet() :: Request Object :: ${recentShiftForOutletRequest}`);

    let validateRequest = validate.recentShiftForOutlet(recentShiftForOutletRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `recentShiftForOutlet() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
    let recentShiftForOutletDBResult = await shiftsService.recentShiftForOutlet(
        functionContext,
        recentShiftForOutletRequest
      );
      response(functionContext, responseObj,recentShiftForOutletDBResult);

    } catch (errRecentShiftForOutletDBResult) {
      if (!errRecentShiftForOutletDBResult.ErrorMessage && !errRecentShiftForOutletDBResult.ErrorCode) {
        logger.logInfo(`recentShiftForOutletDBResult :: Error :: ${errRecentShiftForOutletDBResult}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `recentShiftForOutletDBResult :: Error :: ${JSON.stringify(errRecentShiftForOutletDBResult)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = shiftsController;
