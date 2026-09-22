const applib = require("applib");
const momentTimezone = require("moment-timezone");
const { errorMessage, errorCode } = require("../utils/constant");
const { response } = require("../utils/helper");
const { ErrorModel } = require("../models/error");
const requestModel = require("../models/request");
const responseModel = require("../models/response");
const categoryDiscountService = require("../services/categoryDiscount");
const validate = require("../utils/validation");

const categoryDiscount = {

  getAllCategories: async (req, res) => {
    const logger = new applib.Logger(req.originalUrl);

    const functionContext = {
      error: null,
      res,
      logger,
      currentTs: momentTimezone.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    };

    const responseObj = {
      name: "getAllCategories",
      model: new responseModel.getAllCategories(),
    };

    try {
      const result = await categoryDiscountService.getAllCategories(
        functionContext
      );
      response(functionContext, responseObj, result);
    } catch (err) {
      response(functionContext, responseObj, null);
    }
  },

  addCategory: async (req, res) => {
    const logger = new applib.Logger(req.originalUrl);

    const functionContext = {
      error: null,
      res,
      logger,
      currentTs: momentTimezone.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    };

    const responseObj = {
      name: "addCategory",
      model: new responseModel.addCategoryDiscount(),
    };

    const requestObj = new requestModel.addCategoryDiscount(req);

    const validation = validate.addCategoryDiscount(requestObj);
    if (validation.error) {
      functionContext.error = new ErrorModel(
        validation.error.details[0].message,
        errorCode.invalidRequest
      );
      return response(functionContext, responseObj, null);
    }

    try {
      const result = await categoryDiscountService.addCategory(
        functionContext,
        requestObj
      );
      response(functionContext, responseObj, result);
    } catch (err) {
      response(functionContext, responseObj, null);
    }
  },

  updateCategoryDiscount: async (req, res) => {
    const logger = new applib.Logger(req.originalUrl);

    const functionContext = {
      error: null,
      res,
      logger,
      currentTs: momentTimezone.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    };

    const responseObj = {
      name: "updateCategoryDiscount",
      model: new responseModel.updateCategoryDiscount(),
    };

    const requestObj = new requestModel.updateCategoryDiscount(req);

    const validation = validate.updateCategoryDiscount(requestObj);
    if (validation.error) {
      functionContext.error = new ErrorModel(
        validation.error.details[0].message,
        errorCode.invalidRequest
      );
      return response(functionContext, responseObj, null);
    }

    try {
      const result =
        await categoryDiscountService.updateCategoryDiscount(
          functionContext,
          requestObj
        );
      response(functionContext, responseObj, result);
    } catch (err) {
      response(functionContext, responseObj, null);
    }
  },

};

module.exports = categoryDiscount;
