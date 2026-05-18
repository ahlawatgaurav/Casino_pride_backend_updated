const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const mappingURLService = require("../services/mappingURL");

const validate = require("../utils/validation");
const constant = require("../utils/constant");
const AWS = require("aws-sdk");
require("dotenv").config({ path: __dirname + "/.env" });

const mappingURLController = {
  shortenURL: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`shortenURL() invoked!!`);

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
      name: "shortenURL",
      model: new responseModel.shortenURL(),
    };

    let shortenURLRequest = new requestModel.shortenURL(req);

    logger.logInfo(`shortenURL() :: Request Object :: ${shortenURLRequest}`);

    let validateRequest = validate.shortenURL(shortenURLRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `shortenURL() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
    // Generate a short code (you may use a library for this)
      let shortenURLDBResult = await mappingURLService.shortenURL(
        functionContext,
        shortenURLRequest
      );
        // const shortUrl = `http://13-235-27-91:5858/p/${shortenURLDBResult.ShortCode}`;
        // const shortUrl = `http://13.235.27.91:5858/p/${shortenURLDBResult.ShortCode}`;
        const shortUrl = `${process.env.WEBSITE_URL}/p?code=${shortenURLDBResult.ShortCode}`;
        // const shortUrl = `http://localhost:3000/p/${shortenURLDBResult.ShortCode}`;
        res.json({shortUrl})
    //   response(functionContext, responseObj,shortenURLDBResult);
    } catch (errShortenURL) {
      if (!errShortenURL.ErrorMessage && !errShortenURL.ErrorCode) {
        // logger.logInfo(`errShortenURL :: Error :: ${errShortenURL}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `errShortenURL :: Error :: ${JSON.stringify(errShortenURL)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getLongURL: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getLongURL() invoked!!`);

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
      name: "getLongURL",
      model: new responseModel.getLongURL(),
    };

    let getLongURLRequest = new requestModel.getLongURL(req);

    logger.logInfo(`getLongURL() :: Request Object :: ${getLongURLRequest}`);

    let validateRequest = validate.getLongURL(getLongURLRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getLongURL() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let getLongURLDBResult = await mappingURLService.getLongURL(
        functionContext,
        getLongURLRequest
      );
      if (getLongURLDBResult.LongURL != null) {
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });
    
        let imageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key:"casinopridefiles/" + getLongURLDBResult.LongURL,
        });
        getLongURLDBResult.LongURL = imageUrl;
          // response(functionContext, responseObj,getLongURLDBResult);
          const longUrl = getLongURLDBResult.LongURL;
          res.json(longUrl)
      }
      else{
        // response(functionContext, responseObj,getLongURLDBResult);
        const longUrl = getLongURLDBResult.LongURL;
        res.json(longUrl)
      }
      const longUrl = getLongURLDBResult.LongURL;
    
      // res.redirect(JSON.stringify(longUrl))
    //   response(functionContext, responseObj,getLongURLDBResult);
    } catch (errGetLongURL) {
      if (!errGetLongURL.ErrorMessage && !errGetLongURL.ErrorCode) {
        // logger.logInfo(`getLongURLDBResult :: Error :: ${errGetLongURL}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `getLongURLDBResult :: Error :: ${JSON.stringify(errGetLongURL)}`
      );
      response(functionContext, responseObj, null);
    }
  },

};

module.exports = mappingURLController;