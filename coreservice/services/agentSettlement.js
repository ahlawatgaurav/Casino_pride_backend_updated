const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const agentSettlementService = {
 
  addUpdateAgentSettlement: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addUpdateAgentSettlement() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_update_agent_settlements(
        :userId,
        :userTypeId,
        :agentName,
        :settlementAmount,
        :bookingDate,
        :bookingId
        )`,
        {
          userId: resolvedResult.userId,
          userTypeId: resolvedResult.userTypeId,
          agentName: resolvedResult.agentName,
          settlementAmount: resolvedResult.settlementAmount,
          bookingDate: resolvedResult.bookingDate,
          bookingId: resolvedResult.bookingId,
        }
      );

      // logger.logInfo(
      //   `addUpdateAgentSettlement() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addUpdateAgentSettlement() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  agentMonthlySettlement: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("agentMonthlySettlement() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_agent_monthly_settlement(
        :id,
        :userId,
        :referenceNum,
        :isSettled
        )`,
        {
          id: resolvedResult.id,
          userId: resolvedResult.userId,
          referenceNum: resolvedResult.referenceNum,
          isSettled: resolvedResult.isSettled,
        }
      );

      // logger.logInfo(
      //   `agentMonthlySettlement() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
	    console.log("database error->",err);
      logger.logInfo(`agentMonthlySettlement() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  getAgentSettlements: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getAgentSettlements() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_agent_settlements(
        :bookingDate,
        :userTypeId,
        :userId
        )`,
        {
          bookingDate: resolvedResult.bookingDate,
          userTypeId: resolvedResult.userTypeId,
          userId: resolvedResult.userTypeId == 5 ? resolvedResult.userId : null,
        }
      );

      // logger.logInfo(
      //   `getAgentSettlements() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
	    console.log(err);
      logger.logInfo(`getAgentSettlements() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
      

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
 
};

module.exports = agentSettlementService;
