const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const packageService = require("../services/packages");

const validate = require("../utils/validation");

const packageController = {
  fetchPackages: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchPackages() invoked!!`);

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
      name: "fetchPackages",
      model: new responseModel.fetchPackages(),
    };
    try {
      let fetchPackagesDBResult = await packageService.fetchPackages(
        functionContext,
      );
      response(functionContext, responseObj,fetchPackagesDBResult);
    } catch (errfetchPackages) {
      if (!errfetchPackages.ErrorMessage && !errfetchPackages.ErrorCode) {
        logger.logInfo(`fetchPackagesDBResult :: Error :: ${errfetchPackages}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchPackagesDBResult :: Error :: ${JSON.stringify(errfetchPackages)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  addPackage: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addPackage() invoked!!`);

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
      name: "addPackage",
      model: new responseModel.addPackage(),
    };

    let addPackageRequest = new requestModel.addPackage(req);

    logger.logInfo(`addPackage() :: Request Object :: ${addPackageRequest}`);

    let validateRequest = validate.addPackage(addPackageRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addPackage() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addPackageDBResult = await packageService.addPackageDetails(
        functionContext,
        addPackageRequest
      );
      // let addPackageTeensDBResult = await packageService.addPackageTeensDetails(
      //   functionContext,
      //   addPackageRequest,
      //   addPackageDBResult
      // );

      let addPackageItemsDBResult = await packageService.addPackageItems(
        functionContext,
        addPackageRequest,
        addPackageDBResult
      );
      let getPackageByIdDBResult = await packageService.getPackageById(
        functionContext,
        addPackageRequest,
        addPackageDBResult
      );
      response(functionContext, responseObj,getPackageByIdDBResult);
    } catch (errAddPackage) {
      if (!errAddPackage.ErrorMessage && !errAddPackage.ErrorCode) {
        logger.logInfo(`addCouponDBResult :: Error :: ${errAddPackage}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addPackageDBResult :: Error :: ${JSON.stringify(errAddPackage)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updatePackage: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updatePackage() invoked!!`);

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
      name: "updatePackage",
      model: new responseModel.updatePackage(),
    };

    let updatePackageRequest = new requestModel.updatePackage(req);

    logger.logInfo(`updatePackage() :: Request Object :: ${updatePackageRequest}`);

    let validateRequest = validate.updatePackage(updatePackageRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updatePackage() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updatePackageDBResult = await packageService.updatePackageDetails(
        functionContext,
        updatePackageRequest
      );
      // let updatePackageTeensDBResult = await packageService.updatePackageTeensDetails(
      //   functionContext,
      //   updatePackageRequest,
      //   updatePackageDBResult
      // );

      let updatePackageItemsDBResult = await packageService.updatePackageItems(
        functionContext,
        updatePackageRequest,
        updatePackageDBResult
      );
      let getPackageByIdDBResult = await packageService.getPackageById(
        functionContext,
        updatePackageRequest,
        updatePackageDBResult
      );
      response(functionContext, responseObj,getPackageByIdDBResult);
    } catch (errUpdatePackage) {
      if (!errUpdatePackage.ErrorMessage && !errUpdatePackage.ErrorCode) {
        logger.logInfo(`updatePackageDBResult :: Error :: ${errUpdatePackage}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updatePackageDBResult :: Error :: ${JSON.stringify(errUpdatePackage)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  deletePackage: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`deletePackage() invoked!!`);

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
      name: "deletePackage",
      model: new responseModel.deletePackage(),
    };

    let deletePackageRequest = new requestModel.deletePackage(req);

    logger.logInfo(`deletePackage() :: Request Object :: ${deletePackageRequest}`);

    let validateRequest = validate.deletePackage(deletePackageRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `deletePackage() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let deletePackageDBResult = await packageService.deletePackageDetails(
        functionContext,
        deletePackageRequest
      );
      response(functionContext, responseObj,deletePackageDBResult);
    } catch (errDeletePackage) {
      if (!errDeletePackage.ErrorMessage && !errDeletePackage.ErrorCode) {
        logger.logInfo(`deletePackageDBResult :: Error :: ${errDeletePackage}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `deletePackageDBResult :: Error :: ${JSON.stringify(errDeletePackage)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getPackageDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getPackageDetails() invoked!!`);

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
      name: "getPackageDetails",
      model: new responseModel.getPackageDetails(),
    };

    let getPackageDetailsRequest = new requestModel.getPackageDetails(req);

    logger.logInfo(`getPackageDetails() :: Request Object :: ${getPackageDetailsRequest}`);

    let validateRequest = validate.getPackageDetails(getPackageDetailsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getPackageDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let getPackageDetailsDBResult = await packageService.getPackageDetails(
        functionContext,
        getPackageDetailsRequest
      );
      response(functionContext, responseObj,getPackageDetailsDBResult);
    } catch (errGetPackageDetails) {
      if (!errGetPackageDetails.ErrorMessage && !errGetPackageDetails.ErrorCode) {
        logger.logInfo(`getPackageDetailsDBResult :: Error :: ${errGetPackageDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `getPackageDetailsDBResult :: Error :: ${JSON.stringify(errGetPackageDetails)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = packageController;