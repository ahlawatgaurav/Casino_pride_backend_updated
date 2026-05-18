const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const panelDiscountService = {
 
  addPanelDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addPanelDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_panel_discounts(
        :panelDiscountTitle,
        :panelDiscountAmount,
        :isDiscountEnabled,
        :IsActive
        )`,
        {
          panelDiscountTitle: resolvedResult.panelDiscountTitle,
          panelDiscountAmount: resolvedResult.panelDiscountAmount,
          isDiscountEnabled: resolvedResult.isDiscountEnabled,
          IsActive: resolvedResult.IsActive
        }
      );

      // logger.logInfo(
      //   `addPanelDiscount() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addPanelDiscount() :: Error :: ${JSON.stringify(err)}`);

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
  updatePanelDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updatePanelDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_panel_discounts(
        :discountId,
        :discountRef,
        :discountTitle,
        :discountAmount,
        :isDiscountEnabled,
        :IsActive
        )`,
        {
          discountId:resolvedResult.discountId,
          discountRef:resolvedResult.discountRef,
          discountTitle: resolvedResult.discountTitle,
          discountAmount: resolvedResult.discountAmount,
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
  deletePanelDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deletePanelDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_delete_panel_discounts(
        :discountId
        )`,
        {
            discountId:resolvedResult.discountId,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`deletePanelDiscount() :: Error :: ${JSON.stringify(err)}`);

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
  fetchPanelDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchPanelDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_panel_discounts()`
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`fetchPanelDiscount() :: Error :: ${JSON.stringify(err)}`);

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
  getEnabledPanelDiscounts: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getEnabledPanelDiscounts() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_panel_discounts()`
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getEnabledPanelDiscounts() :: Error :: ${JSON.stringify(err)}`);

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

module.exports = panelDiscountService;
