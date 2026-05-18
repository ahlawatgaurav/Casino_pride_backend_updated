const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const outletsService = require("../services/outlets");

const validate = require("../utils/validation");

const outletsController = {
  openOutlet: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`openOutlet() invoked!!`);

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
      name: "openOutlet",
      model: new responseModel.openOutlet(),
    };

    let openOutletRequest = new requestModel.openOutlet(req);

    logger.logInfo(`openOutlet() :: Request Object :: ${openOutletRequest}`);

    let validateRequest = validate.openOutlet(openOutletRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `openOutlet() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    
    try {
      let checkOutletExistsDBResult = await outletsService.checkOutletExists(
        functionContext,
        // addWebsiteDiscountRequest
      );
    // Check if outletDateToCheck exists in the "Date" property of any object in the response
    const dateExists = checkOutletExistsDBResult.some(detail => detail.OutletDate === openOutletRequest?.outletDate);
    if (dateExists) {
        functionContext.error = new ErrorModel(
            errorMessage.outletDateExists,
            errorCode.outletDateExists
          );
          response(functionContext, responseObj, null);
        
    } else {
        try {
            let openOutletDBResult = await outletsService.openOutlet(
                functionContext,
                // addWebsiteDiscountRequest
              );
                 response(functionContext, responseObj,openOutletDBResult);
        } catch (errOpenOutlet) {
            if (!errOpenOutlet.ErrorMessage && !errOpenOutlet.ErrorCode) {
                // logger.logInfo(`openOutletDBResult :: Error :: ${errOpenOutlet}`);
                functionContext.error = new ErrorModel(
                  errorMessage.applicationError,
                  errorCode.applicationError
                );
              }
              logger.logInfo(
                `openOutletDBResult :: Error :: ${JSON.stringify(errOpenOutlet)}`
              );
              response(functionContext, responseObj, null);
        }
    }
    } catch (errCheckOutletExists) {
      if (!errCheckOutletExists.ErrorMessage && !errCheckOutletExists.ErrorCode) {
        // logger.logInfo(`checkOutletExistsDBResult :: Error :: ${errCheckOutletExists}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `checkOutletExistsDBResult :: Error :: ${JSON.stringify(errCheckOutletExists)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  closeOutlet: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`closeOutlet() invoked!!`);

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
      name: "closeOutlet",
      model: new responseModel.closeOutlet(),
    };

    let closeOutletRequest = new requestModel.closeOutlet(req);

    logger.logInfo(`closeOutlet() :: Request Object :: ${closeOutletRequest}`);

    let validateRequest = validate.closeOutlet(closeOutletRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `closeOutlet() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let checkThirdShiftDBResult = await outletsService.checkThirdShift(
        functionContext,
        closeOutletRequest
      );
    //   response(functionContext, responseObj,checkThirdShiftDBResult);
    let closeOutletDBResult = await outletsService.closeOutlet(
        functionContext,
        closeOutletRequest
      );
      response(functionContext, responseObj,closeOutletDBResult);
    } catch (errCloseOutlet) {
      if (!errCloseOutlet.ErrorMessage && !errCloseOutlet.ErrorCode) {
        // logger.logInfo(`closeOutletDBResult :: Error :: ${errCloseOutlet}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `closeOutletDBResult :: Error :: ${JSON.stringify(errCloseOutlet)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  checkCurrentOutlet: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`checkCurrentOutlet() invoked!!`);

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
      name: "checkCurrentOutlet",
      model: new responseModel.checkCurrentOutlet(),
    };

    let checkCurrentOutletRequest = new requestModel.checkCurrentOutlet(req);

    logger.logInfo(`checkCurrentOutlet() :: Request Object :: ${checkCurrentOutletRequest}`);

    let validateRequest = validate.checkCurrentOutlet(checkCurrentOutletRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `checkCurrentOutlet() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
       let checkCurrentOutletDBResult = await outletsService.checkCurrentOutlet(
        functionContext,
        checkCurrentOutletRequest
      );
      response(functionContext, responseObj,checkCurrentOutletDBResult);
    } catch (errCheckCurrentOutlet) {
      if (!errCheckCurrentOutlet.ErrorMessage && !errCheckCurrentOutlet.ErrorCode) {
        // logger.logInfo(`checkCurrentOutletDBResult :: Error :: ${errCheckCurrentOutlet}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `checkCurrentOutletDBResult :: Error :: ${JSON.stringify(errCheckCurrentOutlet)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  checkActiveOutlet: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`checkActiveOutlet() invoked!!`);

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
      name: "checkActiveOutlet",
      model: new responseModel.checkActiveOutlet(),
    };
    try {
       let checkActiveOutletDBResult = await outletsService.checkActiveOutlet(
        functionContext,
        // checkCurrentOutletRequest
      );
      response(functionContext, responseObj,checkActiveOutletDBResult);
    } catch (errCheckActiveOutlet) {
      if (!errCheckActiveOutlet.ErrorMessage && !errCheckActiveOutlet.ErrorCode) {
        // logger.logInfo(`checkActiveOutletDBResult :: Error :: ${errCheckActiveOutlet}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `checkActiveOutletDBResult :: Error :: ${JSON.stringify(errCheckActiveOutlet)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = outletsController;
