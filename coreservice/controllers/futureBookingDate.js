const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const futureBookingDateService = require("../services/futureBookingdate");

const validate = require("../utils/validation");
const constant = require("../utils/constant");

const futureBookingDateController = {
  fetchFutureBookingDate: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchFutureBookingDate() invoked!!`);

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
      name: "fetchFutureBookingDate",
      model: new responseModel.fetchFutureBookingDate(),
    };
    try {
      let fetchFutureBookingDateDBResult = await futureBookingDateService.fetchFutureBookingDate(
        functionContext,
      );
      response(functionContext, responseObj,fetchFutureBookingDateDBResult);
    } catch (errfetchFutureBookingDate) {
      if (!errfetchFutureBookingDate.ErrorMessage && !errfetchFutureBookingDate.ErrorCode) {
        // logger.logInfo(`fetchCouponsDBResult :: Error :: ${errfetchFutureBookingDate}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchCouponsDBResult :: Error :: ${JSON.stringify(errfetchFutureBookingDate)}`
      );
      response(functionContext, responseObj, null);
    }
  },

  addUpdateFutureBookingDate: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addUpdateFutureBookingDate() invoked!!`);

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
      name: "addUpdateFutureBookingDate",
      model: new responseModel.addUpdateFutureBookingDate(),
    };

    let addUpdateFutureBookingDateRequest = new requestModel.addUpdateFutureBookingDate(req);

    logger.logInfo(`addUpdateFutureBookingDate() :: Request Object :: ${addUpdateFutureBookingDateRequest}`);

    let validateRequest = validate.addUpdateFutureBookingDate(addUpdateFutureBookingDateRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addUpdateFutureBookingDate() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let addUpdateFutureBookingDateDBResult = await futureBookingDateService.addUpdateFutureBookingDate(
        functionContext,
        addUpdateFutureBookingDateRequest
      );
      response(functionContext, responseObj,addUpdateFutureBookingDateDBResult);
    } catch (errAddUpdateFutureBookingDate) {
      if (!errAddUpdateFutureBookingDate.ErrorMessage && !errAddUpdateFutureBookingDate.ErrorCode) {
        // logger.logInfo(`addFutureBookingDateDBResult :: Error :: ${errAddUpdateFutureBookingDate}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addUpdateFutureBookingDateDBResult :: Error :: ${JSON.stringify(errAddUpdateFutureBookingDate)}`
      );
      response(functionContext, responseObj, null);
    }
  },

};

module.exports = futureBookingDateController;