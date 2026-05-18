const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constants");

const authService = {
  loginUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("loginUserDB() Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_user_login(:UserId, :UserType, :Token,:currentTs)`,
        {
          UserId: resolvedResult.UserId,
          UserType: resolvedResult.UserType,
          Token:resolvedResult.Token,
          currentTs: functionContext.currentTs,
        }
      );

      // logger.logInfo(
      //   `loginUserDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return {
        logindata: rows[0][0][0] ? rows[0][0][0] : null,
        // userData: rows[0][0][1] ? rows[0][0][1] : null,
      };
    } catch (errLoginUser) {
      logger.logInfo(
        `loginUserDB() :: Error :: ${JSON.stringify(errLoginUser)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );
      throw functionContext.error;
    }
  },
  logoutUser: async (functionContext, resolvedResult) => {
    
    let logger = functionContext.logger;

    logger.logInfo("logoutUserDB() Invoked !");
  
    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_user_logout(:UserId,:AuthToken,:currentTs)`,
        {
          UserId:resolvedResult.UserId,
          AuthToken:resolvedResult.AuthToken,
          currentTs: functionContext.currentTs,
        }
      );

      // logger.logInfo(
      //   `logoutUserDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );
      return {
        logoutdata: rows[0][0][0] ? rows[0][0][0] : null,
      };
    } catch (errLogoutUser) {
      logger.logInfo(
        `logoutUserDB() :: Error :: ${JSON.stringify(errLogoutUser)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );
      throw functionContext.error;
    }
  },
};

module.exports = authService;
