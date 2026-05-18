const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const panelDiscountService = require("../services/panelDiscounts");

const validate = require("../utils/validation");

const panelDiscountController = {
  addPanelDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addPanelDiscount() invoked!!`);

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
      name: "addPanelDiscount",
      model: new responseModel.addPanelDiscount(),
    };

    let addPanelDiscountRequest = new requestModel.addPanelDiscount(req);

    logger.logInfo(`addPanelDiscount() :: Request Object :: ${addPanelDiscountRequest}`);

    let validateRequest = validate.addPanelDiscount(addPanelDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addPanelDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addPanelDiscountDBResult = await panelDiscountService.addPanelDiscount(
        functionContext,
        addPanelDiscountRequest
      );
      response(functionContext, responseObj,addPanelDiscountDBResult);
    } catch (errAddPanelDiscount) {
      if (!errAddPanelDiscount.ErrorMessage && !errAddPanelDiscount.ErrorCode) {
        // logger.logInfo(`addPanelDiscountDBResult :: Error :: ${errAddPanelDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addPanelDiscountDBResult :: Error :: ${JSON.stringify(errAddPanelDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updatePanelDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updatePanelDiscount() invoked!!`);

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
      name: "updatePanelDiscount",
      model: new responseModel.updatePanelDiscount(),
    };

    let updatePanelDiscountRequest = new requestModel.updatePanelDiscount(req);

    logger.logInfo(`updatePanelDiscount() :: Request Object :: ${updatePanelDiscountRequest}`);

    let validateRequest = validate.updatePanelDiscount(updatePanelDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updatePanelDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updatePanelDiscountDBResult = await panelDiscountService.updatePanelDiscount(
        functionContext,
        updatePanelDiscountRequest
      );
      response(functionContext, responseObj,updatePanelDiscountDBResult);
    } catch (errUpdatePanelDiscount) {
      if (!errUpdatePanelDiscount.ErrorMessage && !errUpdatePanelDiscount.ErrorCode) {
        // logger.logInfo(`updatePanelDiscountDBResult :: Error :: ${errUpdatePanelDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updatePanelDiscountDBResult :: Error :: ${JSON.stringify(errUpdatePanelDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  deletePanelDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`deletePanelDiscount() invoked!!`);

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
      name: "deletePanelDiscount",
      model: new responseModel.deletePanelDiscount(),
    };

    let deletePanelDiscountRequest = new requestModel.deletePanelDiscount(req);

    logger.logInfo(`deletePanelDiscount() :: Request Object :: ${deletePanelDiscountRequest}`);

    let validateRequest = validate.deletePanelDiscount(deletePanelDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `deletePanelDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let deletePanelDiscountDBResult = await panelDiscountService.deletePanelDiscount(
        functionContext,
        deletePanelDiscountRequest
      );
      response(functionContext, responseObj,deletePanelDiscountDBResult);
    } catch (errDeletePanelDiscount) {
      if (!errDeletePanelDiscount.ErrorMessage && !errDeletePanelDiscount.ErrorCode) {
        // logger.logInfo(`errdeleteWebsiteDiscountDBResult :: Error :: ${errDeletePanelDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `errdeletePanelDiscountResult :: Error :: ${JSON.stringify(errDeletePanelDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  fetchPanelDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchPanelDiscount() invoked!!`);

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
      name: "fetchPanelDiscount",
      model: new responseModel.fetchPanelDiscount(),
    };
    
    try {
      let fetchPanelDiscountDBResult = await panelDiscountService.fetchPanelDiscount(
        functionContext,
      );
      response(functionContext, responseObj,fetchPanelDiscountDBResult);
    } catch (errFetchPanelDiscount) {
      if (!errFetchPanelDiscount.ErrorMessage && !errFetchPanelDiscount.ErrorCode) {
        // logger.logInfo(`fetchPanelDiscountDBResult :: Error :: ${errFetchPanelDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchPanelDiscountDBResult :: Error :: ${JSON.stringify(errFetchPanelDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getEnabledPanelDiscounts: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getEnabledPanelDiscounts() invoked!!`);

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
      name: "getEnabledPanelDiscounts",
      model: new responseModel.getEnabledPanelDiscounts(),
    };
    
    try {
      let getEnabledPanelDiscountsDBResult = await panelDiscountService.getEnabledPanelDiscounts(
        functionContext,
      );
      response(functionContext, responseObj,getEnabledPanelDiscountsDBResult);
    } catch (errGetEnabledPanelDiscounts) {
      if (!errGetEnabledPanelDiscounts.ErrorMessage && !errGetEnabledPanelDiscounts.ErrorCode) {
        // logger.logInfo(`getEnabledPanelDiscountsDBResult :: Error :: ${errGetEnabledPanelDiscounts}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `getEnabledPanelDiscountsDBResult :: Error :: ${JSON.stringify(errGetEnabledPanelDiscounts)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = panelDiscountController;
