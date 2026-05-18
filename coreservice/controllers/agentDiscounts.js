const applib = require("applib");
const momentTimezone = require("moment-timezone");
const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");
const requestModel = require("../models/request");
const responseModel = require("../models/response");
const agentDiscountService = require("../services/agentDiscount");
const validate = require("../utils/validation");
const AWS = require("aws-sdk");
const FileUploadFunction = require("../utils/fileUpload").FileUploadFunction;
const fs = require("fs")
require("dotenv").config({ path: __dirname + "/.env" });

const agentDiscount = {
  addAgentDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addAgentDiscount() invoked!!`);

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
      name: "addAgentDiscount",
      model: new responseModel.addAgentDiscount(),
    };

    let addAgentDiscountRequest = new requestModel.addAgentDiscount(req);

    logger.logInfo(`addAgentDiscount() :: Request Object :: ${addAgentDiscountRequest}`);

    let validateRequest = validate.addAgentDiscount(addAgentDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addAgentDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    // addAgentDiscountRequest.agentDiscountQRLink = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:4848/NewBooking?UserId=${addAgentDiscountRequest.userId}&Discountpercent=${addAgentDiscountRequest.agentDiscountPercent}`
    // addAgentDiscountRequest.agentDiscountQRLink = `${process.env.BASE_URL}:${process.env.ADMIN_PORT}/NewBooking?UserId=${addAgentDiscountRequest.userId}&Discountpercent=${addAgentDiscountRequest.agentDiscountPercent}`
    addAgentDiscountRequest.DiscountCode =  Math.random().toString(36).substring(13) + Date.now().toString(36);
    addAgentDiscountRequest.agentDiscountQRLink = `${process.env.JETTY_POS}/NewBooking?UserId=${addAgentDiscountRequest.userId}&Discountpercent=${addAgentDiscountRequest.agentDiscountPercent}&DiscountCode=${addAgentDiscountRequest.DiscountCode}`

    try {
      let addAgentDiscountDBResult = await agentDiscountService.addAgentDiscount(
        functionContext,
        addAgentDiscountRequest
      );
      response(functionContext, responseObj,addAgentDiscountDBResult);
    } catch (errAddAgentDiscount) {
      if (!errAddAgentDiscount.ErrorMessage && !errAddAgentDiscount.ErrorCode) {
        // logger.logInfo(`addAgentDiscountDBResult :: Error :: ${errAddAgentDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addAgentDiscountDBResult :: Error :: ${JSON.stringify(errAddAgentDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateAgentDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateAgentDiscount() invoked!!`);

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
      name: "updateAgentDiscount",
      model: new responseModel.updateAgentDiscount(),
    };

    let updateAgentDiscountRequest = new requestModel.updateAgentDiscount(req);

    logger.logInfo(`updateAgentDiscount() :: Request Object :: ${updateAgentDiscountRequest}`);

    let validateRequest = validate.updateAgentDiscount(updateAgentDiscountRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateAgentDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    
    try {
      let updateAgentDiscountDBResult = await agentDiscountService.updateAgentDiscount(
        functionContext,
        updateAgentDiscountRequest
      );
      response(functionContext, responseObj,updateAgentDiscountDBResult);
    } catch (errAddAgentDiscount) {
      if (!errAddAgentDiscount.ErrorMessage && !errAddAgentDiscount.ErrorCode) {
        // logger.logInfo(`updateAgentDiscountDBResult :: Error :: ${errAddAgentDiscount}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateAgentDiscountDBResult :: Error :: ${JSON.stringify(errAddAgentDiscount)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getAgentDiscount: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`getAgentDiscount() invoked!!`);
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
      name: "getAgentDiscount",
      model: new responseModel.getAgentDiscount(),
    };
    let getAgentDiscountRequest = new requestModel.getAgentDiscount(req);
    logger.logInfo(`getAgentDiscount() :: Request Object :: ${getAgentDiscountRequest}`);
    let validateRequest = validate.getAgentDiscount(getAgentDiscountRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getAgentDiscount() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getAgentDiscountDBResult = await agentDiscountService.getAgentDiscount(
        functionContext,
        getAgentDiscountRequest
      );
            // Loop through each object in the array
            getAgentDiscountDBResult.forEach(
              (item, index) => {
                const s3 = new AWS.S3({
                  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                  signatureVersion: "v4",
                  region: "ap-south-1",
                });
        if (item?.QRFile != null) {
          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + item.QRFile,
          });
      
          getAgentDiscountDBResult[
            index
          ].QRFile = imageUrl;
        }
        else{
          getAgentDiscountDBResult[
            index
          ].QRFile = null;
        }
               
              }
            );
      response(functionContext, responseObj, getAgentDiscountDBResult);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        // logger.logInfo(`getAgentDiscountDBResult :: Error :: ${err}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`getAgentDiscountDBResult :: Error :: ${JSON.stringify(err)}`);
      response(functionContext, responseObj, null);
    }
  },
  getAgentDiscountUsingDiscountCode: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`getAgentDiscountUsingDiscountCode() invoked!!`);
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
      name: "getAgentDiscountUsingDiscountCode",
      model: new responseModel.getAgentDiscountUsingDiscountCode(),
    };
    let getAgentDiscountUsingDiscountCodeRequest = new requestModel.getAgentDiscountUsingDiscountCode(req);
    logger.logInfo(`getAgentDiscountUsingDiscountCode() :: Request Object :: ${getAgentDiscountUsingDiscountCodeRequest}`);
    let validateRequest = validate.getAgentDiscountUsingDiscountCode(getAgentDiscountUsingDiscountCodeRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getAgentDiscountUsingDiscountCode() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getAgentDiscountUsingDiscountCodeDBResult = await agentDiscountService.getAgentDiscountUsingDiscountCode(
        functionContext,
        getAgentDiscountUsingDiscountCodeRequest
      );
      response(functionContext, responseObj, getAgentDiscountUsingDiscountCodeDBResult);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        // logger.logInfo(`getAgentDiscountDBResult :: Error :: ${err}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`getAgentDiscountUsingDiscountCodeDBResult :: Error :: ${JSON.stringify(err)}`);
      response(functionContext, responseObj, null);
    }
  },
  uploadAgentDiscountQRFile: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`uploadAgentDiscountQRFile() invoked!!`);

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
      name: "uploadAgentDiscountQRFile",
      model: new responseModel.uploadAgentDiscountQRFile(),
    };

    let uploadQRFileRequest = new requestModel.uploadAgentDiscountQRFile(req);
    let requestContext = {
      ...uploadQRFileRequest,
  };

    logger.logInfo(`uploadAgentDiscountQRFile() :: Request Object :: ${uploadQRFileRequest}`);

    let validateRequest = validate.uploadAgentDiscountQRFile(uploadQRFileRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `uploadAgentDiscountQRFile() Error:: Invalid Request :: ${JSON.stringify(
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

        let uploadQRFileDBResult = await agentDiscountService.uploadAgentDiscountQRFile(
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
        // logger.logInfo(`newBookingDBResult :: Error :: ${errUploadACKFile}`);
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

module.exports = agentDiscount;
