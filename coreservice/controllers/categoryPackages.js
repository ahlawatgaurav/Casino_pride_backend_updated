const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const categoryPackagesService = require("../services/categoryPackages");
const validate = require("../utils/validation");

const categoryPackagesController = {
  getCategoryPackages: async (req, res) => {
    const logger = new applib.Logger(req.originalUrl);
    logger.logInfo("getCategoryPackages() invoked!!");

    const functionContext = {
      error: null,
      res,
      logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "getCategoryPackages",
      model: new responseModel.getCategoryPackages(),
    };

    const getReq = new requestModel.getCategoryPackages(req);
    const validateRequest = validate.getCategoryPackages(getReq);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      const result = await categoryPackagesService.getCategoryPackages(
        functionContext,
        getReq
      );
      response(functionContext, responseObj, result);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`getCategoryPackages :: Error :: ${JSON.stringify(err)}`);
      response(functionContext, responseObj, null);
    }
  },

  updateCategoryPackages: async (req, res) => {
    const logger = new applib.Logger(req.originalUrl);
    logger.logInfo("updateCategoryPackages() invoked!!");

    const functionContext = {
      error: null,
      res,
      logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "updateCategoryPackages",
      model: new responseModel.updateCategoryPackages(),
    };

    const updateReq = new requestModel.updateCategoryPackages(req);
    const validateRequest = validate.updateCategoryPackages(updateReq);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      const result = await categoryPackagesService.updateCategoryPackages(
        functionContext,
        updateReq
      );
      response(functionContext, responseObj, result);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateCategoryPackages :: Error :: ${JSON.stringify(err)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = categoryPackagesController;

