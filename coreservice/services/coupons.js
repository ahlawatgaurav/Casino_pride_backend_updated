const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const couponService = {
    fetchCoupons: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchCoupons() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_coupons()`
      );

      // logger.logInfo(
      //   `fetchCoupons() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`fetchCoupons() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

     {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  deleteCoupon: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deleteCoupon() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_delete_coupon(
        :couponId
        )`,
        {
            couponId:resolvedResult.couponId,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`deleteCoupon() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.invalidCouponId) {
        errorCode = constant.errorCode.invalidCouponId;
        errorMessage = constant.errorMessage.invalidCouponId;
      } else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  getCouponByInitial: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deleteCoupon() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_coupon_by_initial(
        :initial,
        :currentDate
        )`,
        {
            initial:resolvedResult.initial,
            currentDate:resolvedResult.currentDate,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`deleteCoupon() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noCoupon) {
        errorCode = constant.errorCode.noCoupon;
        errorMessage = constant.errorMessage.noCoupon;
      } 
     else if (err.sqlState && err.sqlState == constant.errorCode.inactiveCoupon) {
        errorCode = constant.errorCode.inactiveCoupon;
        errorMessage = constant.errorMessage.inactiveCoupon;
      } 
     else if (err.sqlState && err.sqlState == constant.errorCode.expiredCoupon) {
        errorCode = constant.errorCode.expiredCoupon;
        errorMessage = constant.errorMessage.expiredCoupon;
      } 
      
      else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  addCoupon: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addCoupon() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_coupons(
        :couponTitle,
        :couponDiscount,
        :initial,
        :seriesStart,
        :seriesEnd,
        :startDate,
        :endDate,
        :totalCoupons,
        :usedCoupons,
        :remainingCoupons,
        :isCouponEnabled,
        :isActive
        )`,
        {
            couponTitle:resolvedResult.couponTitle,
            couponDiscount:resolvedResult.couponDiscount,
            initial:resolvedResult.initial,
            seriesStart:resolvedResult.seriesStart,
            seriesEnd:resolvedResult.seriesEnd,
            startDate:resolvedResult.startDate,
            endDate:resolvedResult.endDate,
            totalCoupons:resolvedResult.totalCoupons,
            usedCoupons:resolvedResult.usedCoupons,
            remainingCoupons:resolvedResult.remainingCoupons,
            isCouponEnabled:resolvedResult.isCouponEnabled,
            isActive:resolvedResult.isActive,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addCoupon() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.couponExists) {
        errorCode = constant.errorCode.couponExists;
        errorMessage = constant.errorMessage.couponExists;
      } else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  updateCoupon: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateCoupon() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_coupon(
        :couponId,
        :couponRef,
        :couponTitle,
        :couponDiscount,
        :initial,
        :seriesStart,
        :seriesEnd,
        :startDate,
        :endDate,
        :totalCoupons,
        :usedCoupons,
        :remainingCoupons,
        :isCouponEnabled,
        :isActive
        )`,
        {
            couponId:resolvedResult.couponId,
            couponRef:resolvedResult.couponRef,
            couponTitle:resolvedResult.couponTitle,
            couponDiscount:resolvedResult.couponDiscount,
            initial:resolvedResult.initial,
            seriesStart:resolvedResult.seriesStart,
            seriesEnd:resolvedResult.seriesEnd,
            startDate:resolvedResult.startDate,
            endDate:resolvedResult.endDate,
            totalCoupons:resolvedResult.totalCoupons,
            usedCoupons:resolvedResult.usedCoupons,
            remainingCoupons:resolvedResult.remainingCoupons,
            isCouponEnabled:resolvedResult.isCouponEnabled,
            isActive:resolvedResult.isActive,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateCoupon() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noCoupon) {
        errorCode = constant.errorCode.noCoupon;
        errorMessage = constant.errorMessage.noCoupon;
      } else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  updateUsedCoupons: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateCoupon() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_used_coupons(
        :couponId,
        :usedCoupons,
        :remainingCoupons
        )`,
        {
            couponId:resolvedResult.couponId,
            usedCoupons:resolvedResult.usedCoupons,
            remainingCoupons:resolvedResult.remainingCoupons,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateCoupon() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noCoupon) {
        errorCode = constant.errorCode.noCoupon;
        errorMessage = constant.errorMessage.noCoupon;
      } else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
};

module.exports = couponService;
