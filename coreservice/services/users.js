const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const userService = {
 
  addUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_users(
        :firebaseUUID,
        :name,
        :address,
        :email,
        :phone,
        :userName,
        :password,
        :userType,
        :discountPercent,
        :monthlySettlement,
        :QRLink,
        :NumOfBookings,
        :isUserEnabled,
        :isActive,
        :currentTs
        )`,
        {
          firebaseUUID: resolvedResult.firebaseUUID,
          name: resolvedResult.name,
          address: resolvedResult.address,
          email: resolvedResult.email,
          phone: resolvedResult.phone,
          userName: resolvedResult.userName,
          password: resolvedResult.password,
          userType: resolvedResult.userType,
          discountPercent: resolvedResult.discountPercent,
          monthlySettlement: resolvedResult.monthlySettlement,
          QRLink: resolvedResult.QRLink,
          NumOfBookings: resolvedResult.NumOfBookings,
          isUserEnabled: resolvedResult.isUserEnabled,
          isActive: resolvedResult.isActive,
          currentTs: functionContext.currentTs,
        }
      );

      // logger.logInfo(
      //   `addUser() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.phoneExists) {
        errorCode = constant.errorCode.phoneExists;
        errorMessage = constant.errorMessage.phoneExists;
      } else if(err.sqlState && err.sqlState == constant.errorCode.emailExists) {
        errorCode = constant.errorCode.emailExists;
        errorMessage = constant.errorMessage.emailExists;
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
  updateUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_users(
        :userId,
        :userRef,
        :firebaseUUID,
        :name,
        :address,
        :email,
        :phone,
        :userName,
        :password,
        :userType,
        :discountPercent,
        :monthlySettlement,
        :QRLink,
        :NumOfBookings,
        :isUserEnabled,
        :isActive,
        :currentTs
        )`,
        {
          userId:resolvedResult.userId,
          userRef:resolvedResult.userRef,
          firebaseUUID: resolvedResult.firebaseUUID,
          name: resolvedResult.name,
          address: resolvedResult.address,
          email: resolvedResult.email,
          phone: resolvedResult.phone,
          userName: resolvedResult.userName,
          password: resolvedResult.password,
          userType: resolvedResult.userType,
          discountPercent: resolvedResult.discountPercent,
          monthlySettlement: resolvedResult.monthlySettlement,
          QRLink: resolvedResult.QRLink,
          NumOfBookings: resolvedResult.NumOfBookings,
          isUserEnabled: resolvedResult.isUserEnabled,
          isActive: resolvedResult.isActive,
          currentTs: functionContext.currentTs,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
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
  deleteUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deleteUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_delete_user(
        :userId
        )`,
        {
          userId:resolvedResult.userId,
        }
      );



      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`deleteUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.invalidUserId) {
        errorCode = constant.errorCode.invalidUserId;
        errorMessage = constant.errorMessage.invalidUserId;
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
  getUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getUser() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_fetch_users(:userType)`, {
        userType: resolvedResult.userType,
      });

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getUser() :: DB :: Error :: ${JSON.stringify(err)}`);
      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.invalidUserType) {
        errorCode = constant.errorCode.invalidUserType;
        errorMessage = constant.errorMessage.invalidUserType;
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
  getUserById: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getUserById() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_user_by_Id(:userId)`, {
        userId: resolvedResult.userId,
      });

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`getUserById() :: DB :: Error :: ${JSON.stringify(err)}`);
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
  getUserByPhone: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getUserByPhone() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_user_by_phone(:phone)`, {
        phone: resolvedResult.phone,
      });

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`getUserByPhone() :: DB :: Error :: ${JSON.stringify(err)}`);
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
  addQRLink: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("addQRLink() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_add_QR_link(
        :userId,
        :qrLink
        )`, {
        userId: resolvedResult.userId,
        qrLink: resolvedResult.qrLink,
      });

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addQRLink() :: DB :: Error :: ${JSON.stringify(err)}`);
      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      // if (err.sqlState && err.sqlState == constant.errorCode.invalidUserType) {
      //   errorCode = constant.errorCode.invalidUserType;
      //   errorMessage = constant.errorMessage.invalidUserType;
      // } else {
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
  countDriverBookings: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("countDriverBookings() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_count_driver_bookings(
        :userId,
        :userType,
        :localAgentName
        )`,
        {
          userId: resolvedResult.userId,
          userType: resolvedResult.userType,
          localAgentName: resolvedResult.localAgentName,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`countDriverBookings() :: Error :: ${JSON.stringify(err)}`);

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
  uploadQRFile: async (functionContext, resolvedResult,fileURL) => {
    let logger = functionContext.logger;

    logger.logInfo("uploadQRFile() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_upload_QR_file_user(
        :userId,
        :qrFile
        )`,
        {
            userId:resolvedResult.userId,
            // ackFile:resolvedResult.fileUploadDetails,
            qrFile:fileURL,
        }
      );



      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`uploadQRFile() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
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

module.exports = userService;
