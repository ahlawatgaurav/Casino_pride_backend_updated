const applib = require("applib");
const momentTimezone = require("moment-timezone");
const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");
const requestModel = require("../models/request");
const responseModel = require("../models/response");
const userService = require("../services/users");
const validate = require("../utils/validation");
const AWS = require("aws-sdk");
const FileUploadFunction = require("../utils/fileUpload").FileUploadFunction;
const fs = require("fs")
require("dotenv").config({ path: __dirname + "/.env" });

const userController = {
  addUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addUser() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "addUser",
      model: new responseModel.addUser(),
    };

    let addUserRequest = new requestModel.addUser(req);

    logger.logInfo(`addUser() :: Request Object :: ${addUserRequest}`);

    let validateRequest = validate.addUser(addUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addUserDBResult = await userService.addUser(
        functionContext,
        addUserRequest
      );
      response(functionContext, responseObj,addUserDBResult);
    } catch (errAddUser) {
      if (!errAddUser.ErrorMessage && !errAddUser.ErrorCode) {
        logger.logInfo(`addUserDBResult :: Error :: ${errAddUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addUserDBResult :: Error :: ${JSON.stringify(errAddUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateUser() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "updateUser",
      model: new responseModel.updateUser(),
    };

    let updateUserRequest = new requestModel.updateUser(req);

    logger.logInfo(`updateUser() :: Request Object :: ${updateUserRequest}`);

    let validateRequest = validate.updateUser(updateUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addUserDBResult = await userService.updateUser(
        functionContext,
        updateUserRequest
      );
      response(functionContext, responseObj,addUserDBResult);
    } catch (errUpdateUser) {
      if (!errUpdateUser.ErrorMessage && !errUpdateUser.ErrorCode) {
        logger.logInfo(`updateUserDBResult :: Error :: ${errUpdateUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addUserDBResult :: Error :: ${JSON.stringify(errUpdateUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  deleteUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`deleteUser() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "deleteUser",
      model: new responseModel.deleteUser(),
    };

    let deleteUserRequest = new requestModel.deleteUser(req);

    logger.logInfo(`deleteUser() :: Request Object :: ${deleteUserRequest}`);

    let validateRequest = validate.deleteUser(deleteUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `deleteUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addUserDBResult = await userService.deleteUser(
        functionContext,
        deleteUserRequest
      );
      response(functionContext, responseObj,addUserDBResult);
    } catch (errUpdateUser) {
      if (!errUpdateUser.ErrorMessage && !errUpdateUser.ErrorCode) {
        logger.logInfo(`deleteUserDBResult :: Error :: ${errUpdateUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `deleteUserDBResult :: Error :: ${JSON.stringify(errUpdateUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`getUser() invoked!!`);
    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };
    const responseObj = {
      name: "getUser",
      model: new responseModel.getUser(),
    };
    let getUserRequest = new requestModel.getUser(req);
    logger.logInfo(`getUser() :: Request Object :: ${getUserRequest}`);
    let validateRequest = validate.getUser(getUserRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getUserDBResult = await userService.getUser(
        functionContext,
        getUserRequest
      );
      
            // Loop through each object in the array
            getUserDBResult.forEach(
              (item, index) => {
                const s3 = new AWS.S3({
                  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                  signatureVersion: "v4",
                  region: "ap-south-1",
                });
        if (item.QRFile != null) {
          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + item.QRFile,
          });
      
          getUserDBResult[
            index
          ].QRFile = imageUrl;
        }
        else{
          getUserDBResult[
            index
          ].QRFile = null;
        }
               
              }
            );

      response(functionContext, responseObj, getUserDBResult);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        logger.logInfo(`getUserDBResult :: Error :: ${err}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`getUserDBResult :: Error :: ${JSON.stringify(err)}`);
      response(functionContext, responseObj, null);
    }
  },
  getUserById: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`getUserById() invoked!!`);
    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };
    const responseObj = {
      name: "getUserById",
      model: new responseModel.getUserById(),
    };
    let getUserRequest = new requestModel.getUserById(req);
    logger.logInfo(`getUserById() :: Request Object :: ${getUserRequest}`);
    let validateRequest = validate.getUserById(getUserRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getUserById() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getUserDBResult = await userService.getUserById(
        functionContext,
        getUserRequest
      );
      response(functionContext, responseObj, getUserDBResult);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        logger.logInfo(`getUserDBResult :: Error :: ${err}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`getUserDBResult :: Error :: ${JSON.stringify(err)}`);
      response(functionContext, responseObj, null);
    }
  },
  getUserByPhone: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`getUserByPhone() invoked!!`);
    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };
    const responseObj = {
      name: "getUserByPhone",
      model: new responseModel.getUserByPhone(),
    };
    let getUserRequest = new requestModel.getUserByPhone(req);
    logger.logInfo(`getUserByPhone() :: Request Object :: ${getUserRequest}`);
    let validateRequest = validate.getUserByPhone(getUserRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getUserByPhone() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getUserDBResult = await userService.getUserByPhone(
        functionContext,
        getUserRequest
      );
      response(functionContext, responseObj, getUserDBResult);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        logger.logInfo(`getUserDBResult :: Error :: ${err}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`getUserDBResult :: Error :: ${JSON.stringify(err)}`);
      response(functionContext, responseObj, null);
    }
  },
  addQRLink: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addQRLink() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "addQRLink",
      model: new responseModel.addQRLink(),
    };
  
    let addQRLinkRequest = new requestModel.addQRLink(req);

    logger.logInfo(`addQRLink() :: Request Object :: ${addQRLinkRequest}`);

    let validateRequest = validate.addQRLink(addQRLinkRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addQRLink() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    var redirectTo = null
    if (addQRLinkRequest?.userType==6) {
    //  redirectTo = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:5858?UserId=${addQRLinkRequest.userId}`
     redirectTo = `${process.env.BASE_URL}:${process.env.WEBSITE_PORT}?UserId=${addQRLinkRequest.userId}`
      
    }
    else if (addQRLinkRequest?.userType == 8) {
    //  redirectTo = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:4848/NewBooking?UserId=${addQRLinkRequest.userId}`
    //  redirectTo = `${process.env.BASE_URL}:${process.env.ADMIN_PORT}/NewBooking?UserId=${addQRLinkRequest.userId}`
     redirectTo = `${process.env.JETTY_POS}/NewBooking?UserId=${addQRLinkRequest.userId}`
    
    }

      addQRLinkRequest.qrLink = redirectTo
    try {
      let addQRLinkDBResult = await userService.addQRLink(
        functionContext,
        addQRLinkRequest
      );
      response(functionContext, responseObj,addQRLinkDBResult);
    } catch (errAddQRLink) {
      if (!errAddQRLink.ErrorMessage && !errAddQRLink.ErrorCode) {
        logger.logInfo(`addQRLinkDBResult :: Error :: ${errAddQRLink}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addQRLinkDBResult :: Error :: ${JSON.stringify(errAddQRLink)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  countDriverBookings: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`countDriverBookings() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "countDriverBookings",
      model: new responseModel.countDriverBookings(),
    };

    let countDriverBookingsRequest = new requestModel.countDriverBookings(req);

    logger.logInfo(`countDriverBookings() :: Request Object :: ${countDriverBookingsRequest}`);

    let validateRequest = validate.countDriverBookings(countDriverBookingsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `countDriverBookings() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let countDriverBookingsDBResult = await userService.countDriverBookings(
        functionContext,
        countDriverBookingsRequest
      );
      response(functionContext, responseObj,countDriverBookingsDBResult);
    } catch (errCountDriverBookings) {
      if (!errCountDriverBookings.ErrorMessage && !errCountDriverBookings.ErrorCode) {
        logger.logInfo(`countDriverBookingsDBResult :: Error :: ${errCountDriverBookings}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `countDriverBookingsDBResult :: Error :: ${JSON.stringify(errCountDriverBookings)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  uploadQRFile: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`uploadQRFile() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "uploadQRFile",
      model: new responseModel.uploadQRFile(),
    };

    let uploadQRFileRequest = new requestModel.uploadQRFile(req);
    let requestContext = {
      ...uploadQRFileRequest,
  };

    logger.logInfo(`uploadQRFile() :: Request Object :: ${uploadQRFileRequest}`);

    let validateRequest = validate.uploadQRFile(uploadQRFileRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `uploadQRFile() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {

      if (req.hasOwnProperty("files")) {
        var imagetobeUploaded = [];    
          for (let count = 0; count < req.files.length; count++) {
            var file = req.files[count];
            if (file.hasOwnProperty("filename")) {
              if (file.filename) {
                const image = fs.readFileSync(file.path);
                requestContext.ImageURL = file.filename.split(" ").join("%20");
                const imageUrl = await FileUploadFunction(
                  functionContext,
                  requestContext.ImageURL,
                  image,
                  "QRFile",
                  file.path
                );
                imagetobeUploaded.push(imageUrl);
              }
            }
          }
          requestContext.fileUploadDetails = JSON.stringify(imagetobeUploaded)
          .split("[")
          .join("")
          .split("]")
          .join("")
          .split('"')
          .join("");
          const url = requestContext.fileUploadDetails;

// Require the 'url' and 'path' modules
const { parse } = require('url');
const path = require('path');

// Parse the URL
const parsedUrl = parse(url);

// Extract the filename from the path
const filename = path.basename(parsedUrl.pathname);

        let uploadQRFileDBResult = await userService.uploadQRFile(
          functionContext,
          uploadQRFileRequest,
          filename
        );

        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });
    
        let imageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key:"casinopridefiles/" + uploadQRFileDBResult.QRFile,
        });
        uploadQRFileDBResult.QRFile = imageUrl;
        response(functionContext, responseObj,uploadQRFileDBResult);
      }

     
    } catch (errUploadACKFile) {
      if (!errUploadACKFile.ErrorMessage && !errUploadACKFile.ErrorCode) {
        logger.logInfo(`newBookingDBResult :: Error :: ${errUploadACKFile}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `uploadQRFileDBResult :: Error :: ${JSON.stringify(errUploadACKFile)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = userController;
