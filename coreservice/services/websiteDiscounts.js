const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const websiteDiscountService = {
 
  addWebsiteDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addWebsiteDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_website_discount(
        :discountTitle,
        :discountAmount,
        :StartDate,
        :EndDate,
        :isDiscountEnabled,
        :IsActive
        )`,
        {
          discountTitle: resolvedResult.discountTitle,
          discountAmount: resolvedResult.discountAmount,
          StartDate: resolvedResult.StartDate,
          EndDate: resolvedResult.EndDate,
          isDiscountEnabled: resolvedResult.isDiscountEnabled,
          IsActive: resolvedResult.IsActive
        }
      );

      // logger.logInfo(
      //   `addWebsiteDiscount() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addWebsiteDiscount() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

     if(err.sqlState && err.sqlState == constant.errorCode.discountExists) {
        errorCode = constant.errorCode.discountExists;
        errorMessage = constant.errorMessage.discountExists;
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
  updateWebsiteDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_website_discount(
        :discountId,
        :discountRef,
        :discountTitle,
        :discountAmount,
        :StartDate,
        :EndDate,
        :isDiscountEnabled,
        :IsActive
        )`,
        {
          discountId:resolvedResult.discountId,
          discountRef:resolvedResult.discountRef,
          discountTitle: resolvedResult.discountTitle,
          discountAmount: resolvedResult.discountAmount,
          StartDate: resolvedResult.StartDate,
          EndDate: resolvedResult.EndDate,
          isDiscountEnabled: resolvedResult.isDiscountEnabled,
          IsActive: resolvedResult.IsActive,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noDiscount) {
        errorCode = constant.errorCode.noDiscount;
        errorMessage = constant.errorMessage.noDiscount;
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
  deleteWebsiteDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deleteWebsiteDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_delete_website_discount(
        :discountId
        )`,
        {
            discountId:resolvedResult.discountId,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`deleteWebsiteDiscount() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.invalidDiscountId) {
        errorCode = constant.errorCode.invalidDiscountId;
        errorMessage = constant.errorMessage.invalidDiscountId;
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
  fetchWebsiteDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchWebsiteDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_website_discounts()`
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`fetchWebsiteDiscount() :: Error :: ${JSON.stringify(err)}`);

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
  fetchEnabledWebsiteDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchEnabledWebsiteDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_enabled_website_discounts()`
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`fetchEnabledWebsiteDiscount() :: Error :: ${JSON.stringify(err)}`);

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
};

module.exports = websiteDiscountService;
