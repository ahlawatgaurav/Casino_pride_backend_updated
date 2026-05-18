const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const agentDiscountService = {
 
    addAgentDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addAgentDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_travel_agent_discount(
        :agentDiscountPercent,
        :userId,
        :userTypeId,
        :agentDiscountQRLink,
        :isAgentDiscountEnabled,
        :isActive,
        :agentDiscountCode
        )`,
        {
          agentDiscountPercent: resolvedResult.agentDiscountPercent,
          userId: resolvedResult.userId,
          userTypeId: resolvedResult.userTypeId,
          agentDiscountQRLink: resolvedResult.agentDiscountQRLink,
          isAgentDiscountEnabled: resolvedResult.isAgentDiscountEnabled,
          isActive: resolvedResult.isActive,
          agentDiscountCode: resolvedResult.DiscountCode
        }
      );

      // logger.logInfo(
      //   `addAgentDiscount() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addAgentDiscount() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.discountExists) {
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
    updateAgentDiscount: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateAgentDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_travel_agent_discount(
        :agentDiscountId,
        :agentDiscountRef,
        :isAgentDiscountEnabled
        )`,
        {
          agentDiscountId: resolvedResult.agentDiscountId,
          agentDiscountRef: resolvedResult.agentDiscountRef,
          isAgentDiscountEnabled: resolvedResult.isAgentDiscountEnabled,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateAgentDiscount() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noDiscount) {
        errorCode = constant.errorCode.noDiscount;
        errorMessage = constant.errorMessage.noDiscount;
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
  getAgentDiscount: async (functionContext, resolvedResult) => {

    let logger = functionContext.logger;

    logger.logInfo("getAgentDiscount() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_travel_agent_discount(
        :agentDiscountId,
        :userId
        )`,
        {
          agentDiscountId: resolvedResult.agentDiscountId,
          userId: resolvedResult.userId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getAgentDiscount() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      // if (err.sqlState && err.sqlState == constant.errorCode.noDiscount) {
      //   errorCode = constant.errorCode.noDiscount;
      //   errorMessage = constant.errorMessage.noDiscount;
      // } 
      
      // else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      // }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  getAgentDiscountUsingDiscountCode: async (functionContext, resolvedResult) => {
    
    let logger = functionContext.logger;

    logger.logInfo("getAgentDiscountUsingDiscountCode() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_travel_agent_discount_using_discount_code(
        :agentDiscountCode
        )`,
        {
          agentDiscountCode: resolvedResult.agentDiscountCode,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`getAgentDiscountUsingDiscountCode() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      // if (err.sqlState && err.sqlState == constant.errorCode.noDiscount) {
      //   errorCode = constant.errorCode.noDiscount;
      //   errorMessage = constant.errorMessage.noDiscount;
      // } 
      
      // else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      // }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  uploadAgentDiscountQRFile: async (functionContext, resolvedResult,fileURL) => {
    let logger = functionContext.logger;

    logger.logInfo("uploadAgentDiscountQRFile() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_upload_agent_discount_QR(
        :agentDiscountId,
        :qrFile
        )`,
        {
            agentDiscountId:resolvedResult.agentDiscountId,
            qrFile:fileURL,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`uploadAgentDiscountQRFile() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noDiscount) {
        errorCode = constant.errorCode.noDiscount;
        errorMessage = constant.errorMessage.noDiscount;
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
};

module.exports = agentDiscountService;
