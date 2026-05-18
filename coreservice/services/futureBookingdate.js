const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const futureBookingDateService = {
    fetchFutureBookingDate: async (functionContext) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchFutureBookingDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_future_booking_dates()`
      );

      // logger.logInfo(
      //   `fetchFutureBookingDate() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`fetchFutureBookingDate() :: Error :: ${JSON.stringify(err)}`);

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
  
  addUpdateFutureBookingDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addUpdateFutureBookingDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_update_future_booking_date(
        :futureDateId,
        :startDate,
        :endDate
        )`,
        {
            futureDateId:resolvedResult.futureDateId,
            startDate:resolvedResult.startDate,
            endDate:resolvedResult.endDate,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addUpdateFutureBookingDate() :: Error :: ${JSON.stringify(err)}`);

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

module.exports = futureBookingDateService;
