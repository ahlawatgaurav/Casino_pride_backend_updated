const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const outletsService = {
 
  checkOutletExists: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("checkOutletExists() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_check_outlet_exists()`,
      );

      // logger.logInfo(
      //   `checkOutletExists() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`checkOutletExists() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.phoneExists) {
    //     errorCode = constant.errorCode.phoneExists;
    //     errorMessage = constant.errorMessage.phoneExists;
    //   } else if(err.sqlState && err.sqlState == constant.errorCode.discountExists) {
    //     errorCode = constant.errorCode.discountExists;
    //     errorMessage = constant.errorMessage.discountExists;
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
  openOutlet: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("openOutlet() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_open_outlet()`,
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`openOutlet() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.phoneExists) {
    //     errorCode = constant.errorCode.phoneExists;
    //     errorMessage = constant.errorMessage.phoneExists;
    //   } else if(err.sqlState && err.sqlState == constant.errorCode.discountExists) {
    //     errorCode = constant.errorCode.discountExists;
    //     errorMessage = constant.errorMessage.discountExists;
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
  checkThirdShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("checkThirdShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_check_third_shift_closed(
            :outletId
        )`,{
            outletId:resolvedResult.outletId
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`checkThirdShift() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.closeThirdShift) {
        errorCode = constant.errorCode.closeThirdShift;
        errorMessage = constant.errorMessage.closeThirdShift;
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
  closeOutlet: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("closeOutlet() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_close_outlet(
            :outletId
        )`,{
            outletId:resolvedResult.outletId
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`closeOutlet() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
        errorCode = constant.errorCode.outletNotOpen;
        errorMessage = constant.errorMessage.outletNotOpen;
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
  checkCurrentOutlet: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("checkCurrentOutlet() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_check_current_outlet(
            :outletDate
        )`,{
            outletDate:resolvedResult.outletDate
        }
      );


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`checkCurrentOutlet() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      // if (err.sqlState && err.sqlState == constant.errorCode.outletNotOpen) {
      //   errorCode = constant.errorCode.outletNotOpen;
      //   errorMessage = constant.errorMessage.outletNotOpen;
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
  checkActiveOutlet: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("checkActiveOutlet() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_check_active_outlet`,
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`checkActiveOutlet() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

    //   if (err.sqlState && err.sqlState == constant.errorCode.phoneExists) {
    //     errorCode = constant.errorCode.phoneExists;
    //     errorMessage = constant.errorMessage.phoneExists;
    //   } else if(err.sqlState && err.sqlState == constant.errorCode.discountExists) {
    //     errorCode = constant.errorCode.discountExists;
    //     errorMessage = constant.errorMessage.discountExists;
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

module.exports = outletsService;
