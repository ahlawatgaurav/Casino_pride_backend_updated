const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const couponService = require("../services/coupons");

const validate = require("../utils/validation");
const constant = require("../utils/constant");

const couponController = {
  fetchCoupons: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchCoupons() invoked!!`);

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
      name: "fetchCoupons",
      model: new responseModel.fetchCoupons(),
    };
    try {
      let fetchCouponsDBResult = await couponService.fetchCoupons(
        functionContext,
      );
      response(functionContext, responseObj,fetchCouponsDBResult);
    } catch (errfetchCoupons) {
      if (!errfetchCoupons.ErrorMessage && !errfetchCoupons.ErrorCode) {
        // logger.logInfo(`fetchCouponsDBResult :: Error :: ${errfetchCoupons}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchCouponsDBResult :: Error :: ${JSON.stringify(errfetchCoupons)}`
      );
      response(functionContext, responseObj, null);
    }
  },

  deleteCoupon: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`deleteCoupon() invoked!!`);

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
      name: "deleteCoupon",
      model: new responseModel.deleteCoupon(),
    };

    let deleteCouponRequest = new requestModel.deleteCoupon(req);

    logger.logInfo(`deleteCoupon() :: Request Object :: ${deleteCouponRequest}`);

    let validateRequest = validate.deleteCoupon(deleteCouponRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `deleteCoupon() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let deleteCouponDBResult = await couponService.deleteCoupon(
        functionContext,
        deleteCouponRequest
      );
      response(functionContext, responseObj,deleteCouponDBResult);
    } catch (errdeleteCoupon) {
      if (!errdeleteCoupon.ErrorMessage && !errdeleteCoupon.ErrorCode) {
        // logger.logInfo(`errdeleteCouponDBResult :: Error :: ${errdeleteCoupon}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `errdeleteCouponResult :: Error :: ${JSON.stringify(errdeleteCoupon)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getCouponByInitial: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getCouponByInitial() invoked!!`);

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
      name: "getCouponByInitial",
      model: new responseModel.getCouponByInitial(),
    };

    let getCouponByInitialRequest = new requestModel.getCouponByInitial(req);

    logger.logInfo(`getCouponByInitial() :: Request Object :: ${getCouponByInitialRequest}`);

    let validateRequest = validate.getCouponByInitial(getCouponByInitialRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getCouponByInitial() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let getCouponByInitialDBResult = await couponService.getCouponByInitial(
        functionContext,
        getCouponByInitialRequest
      );
      //checking if given coupon exists within the SeriesStart and SeriesEnd 
      if (parseInt(getCouponByInitialRequest.numeric) >= parseInt(getCouponByInitialDBResult.SeriesStart) && parseInt(getCouponByInitialRequest.numeric) <=  parseInt(getCouponByInitialDBResult.SeriesEnd)) {
      response(functionContext, responseObj,getCouponByInitialDBResult);
      }
      else {
        functionContext.error = {
          errorMessage : constant.errorMessage.invalidCoupon,
          errorCode : constant.errorCode.invalidCoupon
        }
        response(functionContext, responseObj, null);
      }
      // response(functionContext, responseObj,getCouponByInitialDBResult);
    } catch (errgetCouponByInitial) {
      if (!errgetCouponByInitial.ErrorMessage && !errgetCouponByInitial.ErrorCode) {
        // logger.logInfo(`errgetCouponByInitialDBResult :: Error :: ${errgetCouponByInitial}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `errgetCouponByInitialResult :: Error :: ${JSON.stringify(errgetCouponByInitial)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  addCoupon: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addCoupon() invoked!!`);

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
      name: "addCoupon",
      model: new responseModel.addCoupon(),
    };

    let addCouponRequest = new requestModel.addCoupon(req);

    logger.logInfo(`addCoupon() :: Request Object :: ${addCouponRequest}`);

    let validateRequest = validate.addCoupon(addCouponRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addCoupon() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addCouponDBResult = await couponService.addCoupon(
        functionContext,
        addCouponRequest
      );
      response(functionContext, responseObj,addCouponDBResult);
    } catch (errAddCoupon) {
      if (!errAddCoupon.ErrorMessage && !errAddCoupon.ErrorCode) {
        // logger.logInfo(`addCouponDBResult :: Error :: ${errAddCoupon}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addCouponDBResult :: Error :: ${JSON.stringify(errAddCoupon)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateCoupon: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateCoupon() invoked!!`);

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
      name: "updateCoupon",
      model: new responseModel.updateCoupon(),
    };

    let updateCouponRequest = new requestModel.updateCoupon(req);

    logger.logInfo(`updateCoupon() :: Request Object :: ${updateCouponRequest}`);

    let validateRequest = validate.updateCoupon(updateCouponRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateCoupon() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updateCouponDBResult = await couponService.updateCoupon(
        functionContext,
        updateCouponRequest
      );
      response(functionContext, responseObj,updateCouponDBResult);
    } catch (errUpdateCoupon) {
      if (!errUpdateCoupon.ErrorMessage && !errUpdateCoupon.ErrorCode) {
        // logger.logInfo(`updateCouponDBResult :: Error :: ${errUpdateCoupon}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateCouponDBResult :: Error :: ${JSON.stringify(errUpdateCoupon)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateUsedCoupons: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateUsedCoupons() invoked!!`);

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
      name: "updateUsedCoupons",
      model: new responseModel.updateUsedCoupons(),
    };

    let updateUsedCouponsRequest = new requestModel.updateUsedCoupons(req);

    logger.logInfo(`updateUsedCoupons() :: Request Object :: ${updateUsedCouponsRequest}`);

    let validateRequest = validate.updateUsedCoupons(updateUsedCouponsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateCoupon() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updateUsedCouponsDBResult = await couponService.updateUsedCoupons(
        functionContext,
        updateUsedCouponsRequest
      );
      response(functionContext, responseObj,updateUsedCouponsDBResult);
    } catch (errUpdateUsedCoupons) {
      if (!errUpdateUsedCoupons.ErrorMessage && !errUpdateUsedCoupons.ErrorCode) {
        // logger.logInfo(`updateUsedCouponsDBResult :: Error :: ${errUpdateUsedCoupons}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateUsedCouponsDBResult :: Error :: ${JSON.stringify(errUpdateUsedCoupons)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = couponController;