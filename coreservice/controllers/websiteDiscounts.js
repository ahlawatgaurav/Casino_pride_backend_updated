const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const websiteDiscountService = require("../services/websiteDiscounts");

const validate = require("../utils/validation");

const websiteDiscountController = {
  addWebsiteDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addWebsiteDiscount() invoked!!`);

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
      name: "addWebsiteDiscount",
      model: new responseModel.addWebsiteDiscount(),
    };

    let addWebsiteDiscountRequest = new requestModel.addWebsiteDiscount(req);

    logger.logInfo(`addWebsiteDiscount() :: Request Object :: ${addWebsiteDiscountRequest}`);

    let validateRequest = validate.addWebsiteDiscount(addWebsiteDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addWebsiteDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addWebsiteDiscountDBResult = await websiteDiscountService.addWebsiteDiscount(
        functionContext,
        addWebsiteDiscountRequest
      );
      response(functionContext, responseObj,addWebsiteDiscountDBResult);
    } catch (errAddWebsiteDiscount) {
      if (!errAddWebsiteDiscount.ErrorMessage && !errAddWebsiteDiscount.ErrorCode) {
        // logger.logInfo(`addWebsiteDiscountDBResult :: Error :: ${errAddWebsiteDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addWebsiteDiscountDBResult :: Error :: ${JSON.stringify(errAddWebsiteDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateWebsiteDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateWebsiteDiscount() invoked!!`);

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
      name: "updateWebsiteDiscount",
      model: new responseModel.updateWebsiteDiscount(),
    };

    let updateWebsiteDiscountRequest = new requestModel.updateWebsiteDiscount(req);

    logger.logInfo(`updateWebsiteDiscount() :: Request Object :: ${updateWebsiteDiscountRequest}`);

    let validateRequest = validate.updateWebsiteDiscount(updateWebsiteDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateWebsiteDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updateWebsiteDiscountDBResult = await websiteDiscountService.updateWebsiteDiscount(
        functionContext,
        updateWebsiteDiscountRequest
      );
      response(functionContext, responseObj,updateWebsiteDiscountDBResult);
    } catch (errUpdateWebsiteDiscount) {
      if (!errUpdateWebsiteDiscount.ErrorMessage && !errUpdateWebsiteDiscount.ErrorCode) {
        // logger.logInfo(`updateWebsiteDiscountDBResult :: Error :: ${errUpdateWebsiteDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateWebsiteDiscountDBResult :: Error :: ${JSON.stringify(errUpdateWebsiteDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  deleteWebsiteDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`deleteWebsiteDiscount() invoked!!`);

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
      name: "deleteWebsiteDiscount",
      model: new responseModel.deleteWebsiteDiscount(),
    };

    let deleteWebsiteDiscountRequest = new requestModel.deleteWebsiteDiscount(req);

    logger.logInfo(`deleteWebsiteDiscount() :: Request Object :: ${deleteWebsiteDiscountRequest}`);

    let validateRequest = validate.deleteWebsiteDiscount(deleteWebsiteDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `deleteWebsiteDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let deleteWebsiteDiscountDBResult = await websiteDiscountService.deleteWebsiteDiscount(
        functionContext,
        deleteWebsiteDiscountRequest
      );
      response(functionContext, responseObj,deleteWebsiteDiscountDBResult);
    } catch (errdeleteWebsiteDiscount) {
      if (!errdeleteWebsiteDiscount.ErrorMessage && !errdeleteWebsiteDiscount.ErrorCode) {
        // logger.logInfo(`errdeleteWebsiteDiscountDBResult :: Error :: ${errdeleteWebsiteDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `errdeleteWebsiteDiscountResult :: Error :: ${JSON.stringify(errdeleteWebsiteDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  fetchWebsiteDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchWebsiteDiscount() invoked!!`);

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
      name: "fetchWebsiteDiscount",
      model: new responseModel.fetchWebsiteDiscount(),
    };
    
    try {
      let fetchWebsiteDiscountDBResult = await websiteDiscountService.fetchWebsiteDiscount(
        functionContext,
      );
      response(functionContext, responseObj,fetchWebsiteDiscountDBResult);
    } catch (errfetchWebsiteDiscount) {
      if (!errfetchWebsiteDiscount.ErrorMessage && !errfetchWebsiteDiscount.ErrorCode) {
        // logger.logInfo(`fetchWebsiteDiscountDBResult :: Error :: ${errfetchWebsiteDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchWebsiteDiscountDBResult :: Error :: ${JSON.stringify(errfetchWebsiteDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  fetchEnabledWebsiteDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchEnabledWebsiteDiscount() invoked!!`);

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
      name: "fetchEnabledWebsiteDiscount",
      model: new responseModel.fetchEnabledWebsiteDiscount(),
    };
    
    try {
      let fetchEnabledWebsiteDiscountDBResult = await websiteDiscountService.fetchEnabledWebsiteDiscount(
        functionContext,
      );
      response(functionContext, responseObj,fetchEnabledWebsiteDiscountDBResult);
    } catch (fetchEnabledWebsiteDiscount) {
      if (!fetchEnabledWebsiteDiscount.ErrorMessage && !fetchEnabledWebsiteDiscount.ErrorCode) {
        // logger.logInfo(`fetchEnabledWebsiteDiscountDBResult :: Error :: ${fetchEnabledWebsiteDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchEnabledWebsiteDiscountDBResult :: Error :: ${JSON.stringify(fetchEnabledWebsiteDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = websiteDiscountController;
