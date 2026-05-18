const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken, sendBookingConfirmationMail } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const bookingService = require("../services/booking");

const validate = require("../utils/validation");

const FileUploadFunction = require("../utils/fileUpload").FileUploadFunction;
const fs = require("fs")
const nodemailer = require("nodemailer");
const emailCreds = require("../utils/settings").EmailCreds
const AWS = require("aws-sdk");
const { billingInternalMails, CRMPanelURL } = require("../utils/settings");
const userService = require("../../coreservice/services/users");
require("dotenv").config({ path: __dirname + "/.env" });

function generateHash(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Ensure positive hash
  hash = hash >>> 0;

  // Convert to base 36 (alphanumeric) and truncate
  return hash.toString(36).slice(0, 10);
}
const bookingController = {

  newBooking: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`newBooking() invoked!!`);

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
      name: "newBooking",
      model: new responseModel.newBooking(),
    };

    let newBookingRequest = new requestModel.newBooking(req);
    let getUserRequest = new requestModel.getUserById(req);

    logger.logInfo(`newBooking() :: Request Object :: ${newBookingRequest}`);

    let validateRequest = validate.newBooking(newBookingRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `newBooking() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    //TODO: to be fixed later
  
    // let bannedUserResult = await bookingService.checkBannedUser(
    //   functionContext,
    //   newBookingRequest
    // );

    let bannedUserResult = false;


    if (bannedUserResult) {
      const startMoment =  momentTimezone(momentTimezone
      .utc(new Date(bannedUserResult?.BannedCustomers?.StartDate))
      .tz('Asia/Kolkata').format('YYYY-MM-DD') + ` ${bannedUserResult?.BannedCustomers?.StartTime}`);

      const endMoment = momentTimezone(momentTimezone
      .utc(new Date(bannedUserResult?.BannedCustomers?.EndDate))
      .tz('Asia/Kolkata').format('YYYY-MM-DD') + ` ${bannedUserResult?.BannedCustomers?.EndTime}`);

      const isBanned = momentTimezone
      .utc(new Date())
      .isBetween(
        startMoment, endMoment 
      );

      if (isBanned) {
        logger.logInfo(`BannedUser :: Error :: ${bannedUserResult}`);
        functionContext.error = new ErrorModel(
          errorMessage.userBanned,
          errorCode.userBanned
        );
        response(functionContext, responseObj, null);
      }
    }

    
    try {

      const user = await userService.getUserById(functionContext, getUserRequest);

      if (newBookingRequest.discount > 0) {
        //Applying discount percent on teensPrice
        const DiscountTeensPrice = (newBookingRequest.teensPrice - (newBookingRequest.discount/100)*(newBookingRequest.teensPrice))

        //excluding the teens Tax to get teensRate
        const TeensRate = (DiscountTeensPrice/((100+newBookingRequest.teensTax)/100))

        let BookingCommission = 0;
        const TotalCommissionPercentage = +user?.DiscountPercent - +newBookingRequest?.agentPanelDiscount;

        if(TotalCommissionPercentage > 0) {
          BookingCommission = (newBookingRequest?.amountAfterDiscount * (TotalCommissionPercentage/100));
        }

        //showing Teens Tax bifurcation
        const TeensTaxBifurcation = DiscountTeensPrice-TeensRate

        newBookingRequest.bookingCommission = BookingCommission;

          // Update teensRate in newBookingRequest
          newBookingRequest.teensRate = TeensRate;
          //Update Teens Tax Bifurcation
          newBookingRequest.TeensTaxBifurcation = TeensTaxBifurcation;

        let newBookingDBResult = await bookingService.newBooking(
        functionContext,
        newBookingRequest
      );
      response(functionContext, responseObj,newBookingDBResult);
      }
      else{
        const TeensTaxBifurcation = newBookingRequest.teensPrice-newBookingRequest.teensRate;

        let BookingCommission = 0;
        const TotalCommissionPercentage = +user?.DiscountPercent - +newBookingRequest?.agentPanelDiscount;

        if(TotalCommissionPercentage > 0) {
          BookingCommission = (newBookingRequest?.amountAfterDiscount * (TotalCommissionPercentage/100));
        }

        newBookingRequest.bookingCommission = BookingCommission;
        //Update Teens Tax Bifurcation
        newBookingRequest.TeensTaxBifurcation = TeensTaxBifurcation;
        let newBookingDBResult = await bookingService.newBooking(
          functionContext,
          newBookingRequest
        );
        response(functionContext, responseObj,newBookingDBResult)
      }
    } catch (errNewBooking) {
      if (!errNewBooking.ErrorMessage && !errNewBooking.ErrorCode) {
        logger.logInfo(`newBookingDBResult :: Error :: ${errNewBooking}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `newBookingDBResult :: Error :: ${JSON.stringify(errNewBooking)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  disableBooking: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`disableBooking() invoked!!`);
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
      name: "disableBooking",
      model: new responseModel.disableBooking(),
    };
    let getUserRequest = new requestModel.disableBooking(req);
    logger.logInfo(`disableBooking() :: Request Object :: ${getUserRequest}`);
    let validateRequest = validate.disableBooking(getUserRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `disableBooking() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getUserDBResult = await bookingService.disableBooking(
        functionContext,
        getUserRequest
      );
      response(functionContext, responseObj, getUserDBResult);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        logger.logInfo(`disableBooking :: Error :: ${err}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(`disableBooking :: Error :: ${JSON.stringify(err)}`);
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
      const getUserDBResult = await bookingService.getUserByPhone(
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
  getBookingLink: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`getBookingLink() invoked!!`);
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
      name: "getBookingLink",
      model: new responseModel.getBookingLink(),
    };
    let getUserRequest = new requestModel.getBookingLink(req);
    logger.logInfo(`getBookingLink() :: Request Object :: ${getUserRequest}`);
    let validateRequest = validate.getBookingLink(getUserRequest);
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getBookingLink() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    try {
      const getUserDBResult = await bookingService.getBookingLink(
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
  sendBookingInternalMail: async (req, res) => {
    
      let logger = new applib.Logger(req.originalUrl);
  
      logger.logInfo(`sendBookingInternalMail() invoked!!`);
  
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
        name: "sendBookingInternalMail",
        model: new responseModel.sendBookingInternalMail(),
      };
  
      let sendBookingMailRequest = new requestModel.sendBookingInternalMail(req);
  
  
      let validateRequest = validate.sendBookingInternalMail(sendBookingMailRequest);
  
      if (validateRequest.error) {
        functionContext.error = new ErrorModel(
          validateRequest.error.details[0]["message"],
          errorCode.invalidRequest
        );
        logger.logInfo(
          `sendBookingInternalMail() Error:: Invalid Request :: ${JSON.stringify(
            validateRequest
          )}`
        );
        response(functionContext, responseObj, null);
        return;
      }
  
      
      try {
        // let mailResponse = sendBookingConfirmationMail(sendBookingMailRequest, functionContext, responseObj);
      }
      catch (errSendBookingMail) {
        if (!errSendBookingMail.ErrorMessage && !errSendBookingMail.ErrorCode) {
          functionContext.error = new ErrorModel(
            errorMessage.applicationError,
            errorCode.applicationError
          );
        }
        logger.logInfo(
          `errSendBookingMail :: Error :: ${JSON.stringify(errSendBookingMail)}`
        );
        response(functionContext, responseObj, null);
      }
    
  },
  getBookingDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getBookingDetails() invoked!!`);

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
      name: "getBookingDetails",
      model: new responseModel.getBookingDetails(),
    };

    let getBookingDetailsRequest = new requestModel.getBookingDetails(req);

    logger.logInfo(`getBookingDetails() :: Request Object :: ${getBookingDetailsRequest}`);

    let validateRequest = validate.getBookingDetails(getBookingDetailsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getBookingDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let getBookingDetailsDBResult = await bookingService.getBookingDetails(
        functionContext,
        getBookingDetailsRequest
      );
      // console.log('getBookingDetailsDBResult.Image>>>',getBookingDetailsDBResult.ACKFile);
        if (getBookingDetailsDBResult.ACKFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
      
          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key:"casinopridefiles/" + getBookingDetailsDBResult.ACKFile,
          });
          getBookingDetailsDBResult.ACKFile = imageUrl;
            response(functionContext, responseObj,getBookingDetailsDBResult);
        }
        else{
          response(functionContext, responseObj,getBookingDetailsDBResult);
        }
    } catch (errGetBookingDetails) {
      if (!errGetBookingDetails.ErrorMessage && !errGetBookingDetails.ErrorCode) {
        // logger.logInfo(`getBookingDetails :: Error :: ${errGetBookingDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `getBookingDetails :: Error :: ${JSON.stringify(errGetBookingDetails)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  fetchBookings: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchBookings() invoked!!`);

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
      name: "fetchBookings",
      model: new responseModel.fetchBookings(),
    };

    let fetchBookingsRequest = new requestModel.fetchBookings(req);

    logger.logInfo(`fetchBookings() :: Request Object :: ${fetchBookingsRequest}`);

    let validateRequest = validate.fetchBookings(fetchBookingsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `fetchBookings() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let fetchBookingsDBResult = await bookingService.fetchBookings(
        functionContext,
        fetchBookingsRequest
      );
         //Sending Package Price according to discount / weekend weekday
         for (const item of fetchBookingsDBResult) {
          const bookingDate = new Date(item?.FutureDate);
          const dayOfWeek = bookingDate.getDay();
  
          item.PackageWeekdayPrice = JSON.parse(item?.PackageWeekdayPrice)
  
          item.PackageWeekendPrice = JSON.parse(item?.PackageWeekendPrice)
  
          const FinalPrice = []
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];
  
                const A1 = (JSON.parse(element) - (item.PanelDiscount/100)*(JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else{
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.PanelDiscount/100)*(JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else if (item?.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];
  
                const A1 = (JSON.parse(element) - (item.CouponDiscount/100)*(JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else{
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.CouponDiscount/100)*(JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else if (item?.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];
  
                const A1 = (JSON.parse(element) - (item.WebsiteDiscount/100)*(JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else{
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.WebsiteDiscount/100)*(JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else if (item?.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];
  
                const A1 = (JSON.parse(element) - (item.AgentPanelDiscount/100)*(JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else{
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.AgentPanelDiscount/100)*(JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else{
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            }
            else{
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice
      }
// Loop through each object in the array
      fetchBookingsDBResult.forEach(
        (item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
  if (item.ACKFile != null) {
    let imageUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: "casinopridefiles/" + item.ACKFile,
    });

    fetchBookingsDBResult[
      index
    ].ACKFile = imageUrl;
  }
  else{
    fetchBookingsDBResult[
      index
    ].ACKFile = null;
  }
         
        }
      );
  
      response(functionContext, responseObj,fetchBookingsDBResult);
    } catch (errFetchBookings) {
      if (!errFetchBookings.ErrorMessage && !errFetchBookings.ErrorCode) {
        // logger.logInfo(`fetchBookings :: Error :: ${errFetchBookings}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchBookings :: Error :: ${JSON.stringify(errFetchBookings)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  displayPackages: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`displayPackages() invoked!!`);

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
      name: "displayPackages",
      model: new responseModel.displayPackages(),
    };
    
    try {
      let displayPackagesDBResult = await bookingService.displayPackages(
        functionContext
      
      );
      response(functionContext, responseObj,displayPackagesDBResult);
    } catch (errDisplayPackages) {
      if (!errDisplayPackages.ErrorMessage && !errDisplayPackages.ErrorCode) {
        // logger.logInfo(`displayPackages :: Error :: ${errDisplayPackages}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `displayPackages :: Error :: ${JSON.stringify(errDisplayPackages)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  uploadACKFile: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`uploadACKFile() invoked!!`);

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
      name: "uploadACKFile",
      model: new responseModel.uploadACKFile(),
    };

    let uploadACKFileRequest = new requestModel.uploadACKFile(req);
    let requestContext = {
      ...uploadACKFileRequest,
  };

    logger.logInfo(`uploadACKFile() :: Request Object :: ${uploadACKFileRequest}`);

    let validateRequest = validate.uploadACKFile(uploadACKFileRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `uploadACKFile() Error:: Invalid Request :: ${JSON.stringify(
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
                  "ACKFile",
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

        let uploadACKFileDBResult = await bookingService.uploadACKFile(
          functionContext,
          uploadACKFileRequest,
          filename
        );
        uploadACKFileDBResult.Acknowledgement = uploadACKFileDBResult.ACKFile
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });
    
        let imageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key:"casinopridefiles/" + uploadACKFileDBResult.ACKFile,
        });
        uploadACKFileDBResult.ACKFile = imageUrl;
        response(functionContext, responseObj,uploadACKFileDBResult);
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
        `uploadACKFileDBResult :: Error :: ${JSON.stringify(errUploadACKFile)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateBooking: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateBooking() invoked!!`);

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
      name: "updateBooking",
      model: new responseModel.updateBooking(),
    };

    let updateBookingRequest = new requestModel.updateBooking(req);

    logger.logInfo(`updateBooking() :: Request Object :: ${updateBookingRequest}`);

    let validateRequest = validate.updateBooking(updateBookingRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateBooking() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      
      const TeensTaxBifurcation = updateBookingRequest.teensPrice-updateBookingRequest.teensRate;
        //Update Teens Tax Bifurcation
        updateBookingRequest.TeensTaxBifurcation = TeensTaxBifurcation;
        let updateBookingDBResult = await bookingService.updateBooking(
          functionContext,
          updateBookingRequest
        );
        response(functionContext, responseObj,updateBookingDBResult)
    } catch (errUpdateBooking) {
      if (!errUpdateBooking.ErrorMessage && !errUpdateBooking.ErrorCode) {
        // logger.logInfo(`updateBookingDBResult :: Error :: ${errUpdateBooking}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateBookingDBResult :: Error :: ${JSON.stringify(errUpdateBooking)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  sendACKMail: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`sendACKMail() invoked!!`);

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
      name: "sendACKMail",
      model: new responseModel.sendACKMail(),
    };

    let sendACKMailRequest = new requestModel.sendACKMail(req);

    logger.logInfo(`sendACKMail() :: Request Object :: ${sendACKMailRequest}`);

    let validateRequest = validate.sendACKMail(sendACKMailRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `sendACKMail() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    // try {
    //   let sendACKMailDBResult = await bookingService.sendACKMail(
    //     functionContext,
    //     sendACKMailRequest
    //   );
    //   response(functionContext, responseObj,sendACKMailDBResult);
    // } 
    try {
      logger.logInfo(`notifySellers() invoked!`);
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailCreds.username,
          pass: emailCreds.password,
        },
      });
  
      const mailOptions = {
        from: emailCreds.username,
        to: sendACKMailRequest.receiverEmail,
        subject: "Casino Pride Booking Acknowledgement",
        text: `Dear Sir,\n\nGreetings from Casino Pride\nWe would love to inform you that we have received your booking for ${sendACKMailRequest.ackFile}.\nPlease make sure that people are above 21 years of age and are following the dress code that is smart casuals or formals. For men slippers, shorts, cut sleeves, and caps are not allowed.\n\nPlease note that the booking amount is not refundable or transferable.\nWe would love to have you onboard Casino Pride.\n\nDo let us know your valuable feedback at feedback@casinoprideofficial.com\n\nLet's play with PRIDE !!\n\nThanks & Regards\n24x7 helpline - +919158885000\nTeam Casino Pride - CPGOAA`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("inside error=>", error);
          logger.logInfo(
            `notifyUsers() :: Email not sent :: Error :: ${error} !`
          );
          functionContext.error = new ErrorModel(error, "400");
          
          response(functionContext, responseObj,null);
        } else {
          // res.json({ status: "sent" });
          console.log("notifySellers>>Email sent:check it ", info.response);
  
          logger.logInfo(
            `notifySellers() :: Email sent :: Success :: ${info.response} !`
          );
          //   return info.response;
          response(functionContext, responseObj, {
            Status: "Email sent",
            SuccessCode: 200,
          });
          // res({
          //   Status: "Email sent",
          //   SuccessCode: 200,
          // });
        }
      });
    }
    catch (errSendACKMail) {
      if (!errSendACKMail.ErrorMessage && !errSendACKMail.ErrorCode) {
        // logger.logInfo(`sendACKMail :: Error :: ${errSendACKMail}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `sendACKMail :: Error :: ${JSON.stringify(errSendACKMail)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getBookingsForUser: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getBookingsForUser() invoked!!`);

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
      name: "getBookingsForUser",
      model: new responseModel.getBookingsForUser(),
    };

    let getBookingsForUserRequest = new requestModel.getBookingsForUser(req);

    logger.logInfo(`getBookingsForUser() :: Request Object :: ${getBookingsForUserRequest}`);

    let validateRequest = validate.getBookingsForUser(getBookingsForUserRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getBookingsForUser() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {

      if (getBookingsForUserRequest.date != null) {
        let getBookingsForUserDBResult = await bookingService.getBookingsForUserByDate(
          functionContext,
          getBookingsForUserRequest
        );
        if (getBookingsForUserDBResult.ACKFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
      
          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key:"casinopridefiles/" + getBookingsForUserDBResult.ACKFile,
          });
          getBookingsForUserDBResult.ACKFile = imageUrl;
            response(functionContext, responseObj,getBookingsForUserDBResult);
        }
        else{
          response(functionContext, responseObj,getBookingsForUserDBResult);
        }
      }
      else{
        let getBookingsForUserDBResult = await bookingService.getBookingsForUser(
          functionContext,
          getBookingsForUserRequest
        );
              // console.log('getBookingDetailsDBResult.Image>>>',getBookingDetailsDBResult.ACKFile);
              if (getBookingsForUserDBResult.ACKFile != null) {
                const s3 = new AWS.S3({
                  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                  signatureVersion: "v4",
                  region: "ap-south-1",
                });
            
                let imageUrl = s3.getSignedUrl("getObject", {
                  Bucket: process.env.AWS_S3_BUCKET_NAME,
                  Key:"casinopridefiles/" + getBookingsForUserDBResult.ACKFile,
                });
                getBookingsForUserDBResult.ACKFile = imageUrl;
                  response(functionContext, responseObj,getBookingsForUserDBResult);
              }
              else{
                response(functionContext, responseObj,getBookingsForUserDBResult);
              }
      }

    } catch (errGetBookingsForUser) {
      if (!errGetBookingsForUser.ErrorMessage && !errGetBookingsForUser.ErrorCode) {
        // logger.logInfo(`getBookingsForUser :: Error :: ${errGetBookingsForUser}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `getBookingsForUser :: Error :: ${JSON.stringify(errGetBookingsForUser)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getAcknowledgementLink: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getAcknowledgementLink() invoked!!`);

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
      name: "getAcknowledgementLink",
      model: new responseModel.getAcknowledgementLink(),
    };

    let getAcknowledgementLinkRequest = new requestModel.getAcknowledgementLink(req);

    logger.logInfo(`getBookingsForUser() :: Request Object :: ${getAcknowledgementLinkRequest}`);

    let validateRequest = validate.getAcknowledgementLink(getAcknowledgementLinkRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getAcknowledgementLink() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
    // const acknowledgementLink = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:4848/AcknowledgementDetails?BookingId=${getAcknowledgementLinkRequest.bookingId}`
    // const acknowledgementLink = `${process.env.BASE_URL}:${process.env.ADMIN_PORT}/AcknowledgementDetails?BookingId=${getAcknowledgementLinkRequest.bookingId}`
    const acknowledgementLink = `${process.env.JETTY_POS}/AcknowledgementDetails?BookingId=${getAcknowledgementLinkRequest.bookingId}`
    res.json({acknowledgementLink})
  },
  updateBookingForPayAtCounter: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateBookingForPayAtCounter() invoked!!`);

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
      name: "updateBookingForPayAtCounter",
      model: new responseModel.updateBookingForPayAtCounter(),
    };

    let updateBookingRequest = new requestModel.updateBookingForPayAtCounter(req);

    logger.logInfo(`updateBookingForPayAtCounter() :: Request Object :: ${updateBookingRequest}`);

    let validateRequest = validate.updateBookingForPayAtCounter(updateBookingRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateBookingForPayAtCounter() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updateBookingDBResult = await bookingService.updateBookingForPayAtCounter(
        functionContext,
        updateBookingRequest
      );
      response(functionContext, responseObj,updateBookingDBResult);
    } catch (errUpdateBooking) {
      if (!errUpdateBooking.ErrorMessage && !errUpdateBooking.ErrorCode) {
        // logger.logInfo(`updateBookingDBResult :: Error :: ${errUpdateBooking}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateBookingDBResult :: Error :: ${JSON.stringify(errUpdateBooking)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateShiftForBooking: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateShiftForBooking() invoked!!`);

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
      name: "updateShiftForBooking",
      model: new responseModel.updateShiftForBooking(),
    };

    let updateShiftForBookingRequest = new requestModel.updateShiftForBooking(req);

    logger.logInfo(`updateShiftForBooking() :: Request Object :: ${updateShiftForBookingRequest}`);

    let validateRequest = validate.updateShiftForBooking(updateShiftForBookingRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateShiftForBooking() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updateShiftForBookingDBResult = await bookingService.updateShiftForBooking(
        functionContext,
        updateShiftForBookingRequest
      );
      response(functionContext, responseObj,updateShiftForBookingDBResult);
    } catch (errUpdateShiftForBooking) {
      if (!errUpdateShiftForBooking.ErrorMessage && !errUpdateShiftForBooking.ErrorCode) {
        logger.logInfo(`updateShiftForBookingDBResult :: Error :: ${errUpdateShiftForBooking}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateShiftForBookingDBResult :: Error :: ${JSON.stringify(errUpdateShiftForBooking)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  SendPaymentLinkToCustomer: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`SendPaymentLinkToCustomer() invoked!!`);

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
      name: "SendPaymentLinkToCustomer",
      model: new responseModel.SendPaymentLinkToCustomer(),
    };

    let SendPaymentLinkToCustomerRequest = new requestModel.SendPaymentLinkToCustomer(req);

    logger.logInfo(`SendPaymentLinkToCustomer() :: Request Object :: ${SendPaymentLinkToCustomerRequest}`);

    let validateRequest = validate.SendPaymentLinkToCustomer(SendPaymentLinkToCustomerRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `SendPaymentLinkToCustomer() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let longUrl = `${process.env.WEBSITE_URL}/booking/${SendPaymentLinkToCustomerRequest.bookingId}`;
      let shortCode = generateHash(longUrl);
      const shortUrl = `${process.env.WEBSITE_URL}/u?code=${shortCode}`;

      let paymentLinkId = await bookingService.addPaymentLinkToDB(functionContext, {shortCode, longUrl, ...SendPaymentLinkToCustomerRequest});
      // let SendPaymentLinkToCustomerDBResult = await bookingService.SendPaymentLinkToCustomer(
      //   functionContext,
      //   SendPaymentLinkToCustomerRequest
      // );
      response(functionContext, responseObj,{
        shortCode, 
        Id: paymentLinkId,
        shortUrl
      });
    } catch (errUpdateShiftForBooking) {
      if (!errUpdateShiftForBooking.ErrorMessage && !errUpdateShiftForBooking.ErrorCode) {
        logger.logInfo(`updateShiftForBookingDBResult :: Error :: ${errUpdateShiftForBooking}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateShiftForBookingDBResult :: Error :: ${JSON.stringify(errUpdateShiftForBooking)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = bookingController;