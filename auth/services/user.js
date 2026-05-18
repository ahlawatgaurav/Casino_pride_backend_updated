const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constants");

const userService = {
  validateUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("validateUserDB() Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_validate_user(:Username, :Password)`,
        {
          Username: resolvedResult.Username,
          Password: resolvedResult.Password,
        }
      );

      // logger.logInfo(
      //   `validateUserDB() :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (errValidateUserDB) {
      logger.logInfo(
        `validateUserDB() :: Error :: ${JSON.stringify(errValidateUserDB)}`
      );
      let errorCode = null;
      let errorMessage = null;
      if (
        errValidateUserDB.sqlState &&
        errValidateUserDB.sqlState == constant.errorCode.invalidUser
      ) {
        errorCode = constant.errorCode.invalidUser;
        errorMessage = constant.errorMessage.invalidUser;
      } 
      else if(
        errValidateUserDB.sqlState &&
        errValidateUserDB.sqlState == constant.errorCode.userDoesNotExist
      ){
        errorCode = constant.errorCode.userDoesNotExist;
        errorMessage = constant.errorMessage.userDoesNotExist;
      }
      else if(
        errValidateUserDB.sqlState &&
        errValidateUserDB.sqlState == constant.errorCode.inactiveUser
      ){
        errorCode = constant.errorCode.inactiveUser;
        errorMessage = constant.errorMessage.inactiveUser;
      }
      else {
        errorCode = constant.errorCode.applicationError;
        errorMessage = constant.errorMessage.applicationError;
      }
      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );
      throw functionContext.error;
    }
  },
};

module.exports = userService;
