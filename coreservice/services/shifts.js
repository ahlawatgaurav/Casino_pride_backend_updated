const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const shiftsService = {
 
    checkShiftForUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("checkShiftForUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_check_shifts_for_user(
            :outletDate,
            :userId,
            :userType
        )`,{
            outletDate:resolvedResult.outletDate,
            userId:resolvedResult.userId,
            userType:resolvedResult.userType
        }
      );

      // logger.logInfo(
      //   `checkShiftForUser() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`checkShiftForUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
      }
      else if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
        errorCode = constant.errorCode.outletNotOpen;
        errorMessage = constant.errorMessage.outletNotOpen; 
      }
      else if (err.sqlState && err.sqlState == constant.errorCode.noAccessForUser) {
        errorCode = constant.errorCode.noAccessForUser;
        errorMessage = constant.errorMessage.noAccessForUser; 
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
    openShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("openShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_open_shift(
            :outletDate,
            :shiftTypeId,
            :userType,
            :userId,
            :openTime
        )`,{
            outletDate:resolvedResult.outletDate,
            shiftTypeId:resolvedResult.shiftTypeId,
            userType:resolvedResult.userType,
            userId:resolvedResult.userId,
            openTime:resolvedResult.openTime
        }
      );

 

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`openShift() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
    //     errorCode = constant.errorCode.noUser;
    //     errorMessage = constant.errorMessage.noUser;
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
    //     errorCode = constant.errorCode.outletNotOpen;
    //     errorMessage = constant.errorMessage.outletNotOpen; 
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.noAccessForUser) {
    //     errorCode = constant.errorCode.noAccessForUser;
    //     errorMessage = constant.errorMessage.noAccessForUser; 
    //   }
    //   else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
    //   }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  closeShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("closeShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_close_shift(
            :outletId,
            :shiftId,
            :closeTime,
            :userTypeId,
            :userId
        )`,{
            outletId:resolvedResult.outletId,
            shiftId:resolvedResult.shiftId,
            closeTime:resolvedResult.closeTime,
            userTypeId:resolvedResult.userTypeId,
            userId:resolvedResult.userId,
        }
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`closeShift() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
    //     errorCode = constant.errorCode.noUser;
    //     errorMessage = constant.errorMessage.noUser;
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
    //     errorCode = constant.errorCode.outletNotOpen;
    //     errorMessage = constant.errorMessage.outletNotOpen; 
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.noAccessForUser) {
    //     errorCode = constant.errorCode.noAccessForUser;
    //     errorMessage = constant.errorMessage.noAccessForUser; 
    //   }
    //   else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
    //   }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  reopenShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("reopenShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_reopen_shift(
            :userId,
            :outletId,
            :shiftId,
            :userTypeId,
            :reopenTime
        )`,{
            userId:resolvedResult.userId,
            outletId:resolvedResult.outletId,
            shiftId:resolvedResult.shiftId,
            userTypeId:resolvedResult.userTypeId,
            reopenTime:resolvedResult.reopenTime,
        }
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`reopenShift() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
    //     errorCode = constant.errorCode.noUser;
    //     errorMessage = constant.errorMessage.noUser;
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
    //     errorCode = constant.errorCode.outletNotOpen;
    //     errorMessage = constant.errorMessage.outletNotOpen; 
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.noAccessForUser) {
    //     errorCode = constant.errorCode.noAccessForUser;
    //     errorMessage = constant.errorMessage.noAccessForUser; 
    //   }
    //   else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
    //   }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
  recentShiftForOutlet: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("recentShiftForOutlet() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_recent_shift_for_outlet(
            :outletDate
        )`,{
            outletDate:resolvedResult.outletDate,
        }
      );



      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`recentShiftForOutlet() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
    //     errorCode = constant.errorCode.noUser;
    //     errorMessage = constant.errorMessage.noUser;
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
    //     errorCode = constant.errorCode.outletNotOpen;
    //     errorMessage = constant.errorMessage.outletNotOpen; 
    //   }
    //   else if (err.sqlState && err.sqlState == constant.errorCode.noAccessForUser) {
    //     errorCode = constant.errorCode.noAccessForUser;
    //     errorMessage = constant.errorMessage.noAccessForUser; 
    //   }
    //   else {
        errorCode = constant.errorCode.dbError;
        errorMessage = constant.errorMessage.dbError;
    //   }

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );

      throw functionContext.error;
    }
  },
};

module.exports = shiftsService;
