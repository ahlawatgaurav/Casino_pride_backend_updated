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
const categoryDiscountService = require("../../coreservice/services/categoryDiscount");
const axios = require("axios");
// require("dotenv").config({ path: __dirname + "/.env" });
const path = require("path");
const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.local";

dotenv.config({
  path: path.join(__dirname, envFile),
});

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

function normalizeKidsFields(item) {
  if (!item || typeof item !== "object") return item;
  const numOfKids = Number(item?.NumOfKids ?? item?.numOfKids ?? item?.NumOfTeens ?? 0);
  const hasKids = Number(item?.HasKids ?? item?.hasKids ?? (numOfKids > 0 ? 1 : 0));
  item.NumOfKids = numOfKids;
  item.HasKids = hasKids > 0 ? 1 : 0;
  return item;
}

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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
      const startMoment = momentTimezone(momentTimezone
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
        const DiscountTeensPrice = (newBookingRequest.teensPrice - (newBookingRequest.discount / 100) * (newBookingRequest.teensPrice))

        //excluding the teens Tax to get teensRate
        const TeensRate = (DiscountTeensPrice / ((100 + newBookingRequest.teensTax) / 100))

        let BookingCommission = 0;
        const __actualAmtForComm = numberValue(newBookingRequest?.actualAmount);
        const __discountPercentGiven = __actualAmtForComm > 0 ? ((__actualAmtForComm - numberValue(newBookingRequest?.amountAfterDiscount)) / __actualAmtForComm) * 100 : 0;
        const TotalCommissionPercentage = 15 - __discountPercentGiven;

        if (TotalCommissionPercentage > 0) {
          BookingCommission = (newBookingRequest?.amountAfterDiscount * (TotalCommissionPercentage / 100));
        }

        //showing Teens Tax bifurcation
        const TeensTaxBifurcation = DiscountTeensPrice - TeensRate

        newBookingRequest.bookingCommission = BookingCommission;

        // Update teensRate in newBookingRequest
        newBookingRequest.teensRate = TeensRate;
        //Update Teens Tax Bifurcation
        newBookingRequest.TeensTaxBifurcation = TeensTaxBifurcation;

        let newBookingDBResult = await bookingService.newBooking(
          functionContext,
          newBookingRequest
        );
        newBookingDBResult = normalizeKidsFields(newBookingDBResult);
        response(functionContext, responseObj, newBookingDBResult);
      }
      else {
        const TeensTaxBifurcation = newBookingRequest.teensPrice - newBookingRequest.teensRate;

        let BookingCommission = 0;
        const __actualAmtForComm = numberValue(newBookingRequest?.actualAmount);
        const __discountPercentGiven = __actualAmtForComm > 0 ? ((__actualAmtForComm - numberValue(newBookingRequest?.amountAfterDiscount)) / __actualAmtForComm) * 100 : 0;
        const TotalCommissionPercentage = 15 - __discountPercentGiven;

        if (TotalCommissionPercentage > 0) {
          BookingCommission = (newBookingRequest?.amountAfterDiscount * (TotalCommissionPercentage / 100));
        }

        newBookingRequest.bookingCommission = BookingCommission;
        //Update Teens Tax Bifurcation
        newBookingRequest.TeensTaxBifurcation = TeensTaxBifurcation;
        let newBookingDBResult = await bookingService.newBooking(
          functionContext,
          newBookingRequest
        );
        newBookingDBResult = normalizeKidsFields(newBookingDBResult);
        response(functionContext, responseObj, newBookingDBResult)
      }
    } catch (errNewBooking) {
      console.error("CRITICAL: newBooking Error ::", errNewBooking);
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
      getBookingDetailsDBResult = normalizeKidsFields(getBookingDetailsDBResult);
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
          Key: "casinopridefiles/" + getBookingDetailsDBResult.ACKFile,
        });
        getBookingDetailsDBResult.ACKFile = imageUrl;
        response(functionContext, responseObj, getBookingDetailsDBResult);
      }
      else {
        response(functionContext, responseObj, getBookingDetailsDBResult);
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

      // Enriching bookings with CategoryName
      let categories = [];
      try {
        categories = await userService.getAllCategories(functionContext);
      } catch (catErr) {
        logger.logInfo(`fetchBookings() :: Category Fetch Error :: ${JSON.stringify(catErr)}`);
      }

      const categoryMap = new Map(); // CategoryId -> CategoryName
      if (categories && Array.isArray(categories)) {
        console.log(`Booking Debug: Fetched ${categories.length} categories.`);
        categories.forEach(cat => {
          categoryMap.set(String(cat.Id), cat.Name);
        });
      }

      // Identify unique UserIDs from bookings
      let userIds = [];
      if (fetchBookingsDBResult && Array.isArray(fetchBookingsDBResult)) {
        userIds = [...new Set(fetchBookingsDBResult.map(item => item.UserId))];
      }
      console.log(`Booking Debug: Found unique UserIDs: ${JSON.stringify(userIds)}`);

      const userCategoryMap = new Map(); // UserId -> CategoryName

      // Fetch users to get their CategoryId - SEQUENTIAL to avoid connection pool exhaustion
      if (userIds.length > 0) {
        for (const userId of userIds) {
          try {
            const user = await userService.getUserById(functionContext, { userId: userId });
            console.log(`Booking Debug: User ID ${userId} -> CategoryId: ${user?.CategoryId}`);

            if (user && user.CategoryId != null) {
              const catIdStr = String(user.CategoryId);
              const catName = categoryMap.get(catIdStr) || "-";
              console.log(`Booking Debug: Mapped CategoryId ${catIdStr} to Name: ${catName}`);
              userCategoryMap.set(userId, catName);
            } else {
              console.log(`Booking Debug: User ID ${userId} has no CategoryId (or null).`);
            }
          } catch (err) {
            // Ignore error for individual user fetch
            logger.logInfo(`fetchBookings() :: Individual User Fetch Error (UserId: ${userId}) :: ${JSON.stringify(err)}`);
          }
        }
      }





      //Sending Package Price according to discount / weekend weekday
      if (fetchBookingsDBResult && Array.isArray(fetchBookingsDBResult)) {
        // --- DATA DEBUGGING INJECTION ---
        if (fetchBookingsDBResult.length > 0) {
          const debugInfo = {
            CategoriesFetchedCount: categories ? categories.length : 0,
            UserCategoryMapSize: userCategoryMap.size,
            SampleUserId: fetchBookingsDBResult[0].UserId,
            SampleUserCatName: userCategoryMap.get(fetchBookingsDBResult[0].UserId),
            UserIdsList: JSON.stringify(userIds),
            CategoriesSample: categories && categories.length > 0 ? JSON.stringify(categories[0]) : "None"
          };
          fetchBookingsDBResult[0].DebugInfo = debugInfo;
        }
        // --------------------------------

        for (const item of fetchBookingsDBResult) {
          normalizeKidsFields(item);

          // Add CategoryName from userCategoryMap
          if (userCategoryMap && userCategoryMap.has(item.UserId)) {
            item.CategoryName = userCategoryMap.get(item.UserId);
          } else {
            item.CategoryName = "-";
          }

          const bookingDate = new Date(item?.FutureDate);
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item?.PackageWeekdayPrice)

          item.PackageWeekendPrice = JSON.parse(item?.PackageWeekendPrice)

          const FinalPrice = []
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];

                const A1 = (JSON.parse(element) - (item.PanelDiscount / 100) * (JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else {
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.PanelDiscount / 100) * (JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else if (item?.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];

                const A1 = (JSON.parse(element) - (item.CouponDiscount / 100) * (JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else {
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.CouponDiscount / 100) * (JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else if (item?.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];

                const A1 = (JSON.parse(element) - (item.WebsiteDiscount / 100) * (JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else {
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.WebsiteDiscount / 100) * (JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else if (item?.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              for (let index = 0; index < item?.PackageWeekendPrice?.length; index++) {
                const element = item.PackageWeekendPrice[index];

                const A1 = (JSON.parse(element) - (item.AgentPanelDiscount / 100) * (JSON.parse(element)))
                FinalPrice.push(A1)
              }
            }
            else {
              for (let index = 0; index < item?.PackageWeekdayPrice?.length; index++) {
                const element = item.PackageWeekdayPrice[index];
                const A1 = (JSON.parse(element) - (item.AgentPanelDiscount / 100) * (JSON.parse(element)))
                // FinalPrice = [...A1]
                FinalPrice.push(A1)
              }
            }
          }
          else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) { //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            }
            else {
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
            else {
              fetchBookingsDBResult[
                index
              ].ACKFile = null;
            }

          }
        );

      }


      // CLONE RESULT to ensure it is a plain mutable object and bypass potential "RowDataPacket" restrictions or model strictness
      let finalResponseData = JSON.parse(JSON.stringify(fetchBookingsDBResult));

      if (finalResponseData && Array.isArray(finalResponseData) && finalResponseData.length > 0) {
        // RE-INJECT DEBUG INFO into the cloned object
        const debugInfo = {
          CategoriesFetchedCount: categories ? categories.length : 0,
          UserCategoryMapSize: userCategoryMap.size,
          SampleUserId: fetchBookingsDBResult[0].UserId,
          SampleUserCatName: userCategoryMap.get(fetchBookingsDBResult[0].UserId),
          UserIdsList: JSON.stringify(userIds),
          CategoriesSample: categories && categories.length > 0 ? JSON.stringify(categories[0]) : "None"
        };
        finalResponseData[0].DebugInfo = debugInfo;
      }

      response(functionContext, responseObj, finalResponseData);
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
      const categoryId = req.query?.categoryId ? Number(req.query.categoryId) : null;
      const visibilityTarget =
        req.query?.visibilityTarget || req.query?.target || null;
      let displayPackagesDBResult = await bookingService.displayPackages(
        functionContext,
        { categoryId, visibilityTarget }

      );
      response(functionContext, responseObj, displayPackagesDBResult);
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

  displayPackagesEnabled: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`displayPackagesEnabled() invoked!!`);

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
      const categoryId = req.query?.categoryId ? Number(req.query.categoryId) : null;
      const visibilityTarget =
        req.query?.visibilityTarget || req.query?.target || null;
      const result = await bookingService.displayPackagesEnabled(functionContext, {
        categoryId,
        visibilityTarget,
      });
      response(functionContext, responseObj, result);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `displayPackagesEnabled :: Error :: ${JSON.stringify(err)}`
      );
      response(functionContext, responseObj, null);
    }
  },

  displayPackagesForCategory: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`displayPackagesForCategory() invoked!!`);

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
      const categoryId = req.query?.categoryId ? Number(req.query.categoryId) : null;
      let result = await bookingService.displayPackages(functionContext, {
        categoryId,
      });
      response(functionContext, responseObj, result);
    } catch (err) {
      if (!err.ErrorMessage && !err.ErrorCode) {
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `displayPackagesForCategory :: Error :: ${JSON.stringify(err)}`
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
          Key: "casinopridefiles/" + uploadACKFileDBResult.ACKFile,
        });
        uploadACKFileDBResult.ACKFile = imageUrl;
        response(functionContext, responseObj, uploadACKFileDBResult);
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

      const TeensTaxBifurcation = updateBookingRequest.teensPrice - updateBookingRequest.teensRate;
      //Update Teens Tax Bifurcation
      updateBookingRequest.TeensTaxBifurcation = TeensTaxBifurcation;

      const __actualAmtForComm = numberValue(updateBookingRequest?.actualAmount);
      const __discountPercentGiven = __actualAmtForComm > 0 ? ((__actualAmtForComm - numberValue(updateBookingRequest?.amountAfterDiscount)) / __actualAmtForComm) * 100 : 0;
      const __editCommPct = 15 - __discountPercentGiven;
      const __editBookingCommission = __editCommPct > 0 ? (numberValue(updateBookingRequest?.amountAfterDiscount) * (__editCommPct / 100)) : 0;

      let updateBookingDBResult = await bookingService.updateBooking(
        functionContext,
        updateBookingRequest
      );
      //persist recomputed commission (usp_update_booking does not touch BookingCommision)
      await bookingService.updateBookingCommission(
        functionContext,
        updateBookingRequest.bookingId,
        __editBookingCommission
      );
      response(functionContext, responseObj, updateBookingDBResult)
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

          response(functionContext, responseObj, null);
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
        if (Array.isArray(getBookingsForUserDBResult)) {
          getBookingsForUserDBResult = getBookingsForUserDBResult.map((booking) =>
            normalizeKidsFields(booking)
          );
        } else {
          getBookingsForUserDBResult = normalizeKidsFields(getBookingsForUserDBResult);
        }
        if (getBookingsForUserDBResult.ACKFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });

          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + getBookingsForUserDBResult.ACKFile,
          });
          getBookingsForUserDBResult.ACKFile = imageUrl;
          response(functionContext, responseObj, getBookingsForUserDBResult);
        }
        else {
          response(functionContext, responseObj, getBookingsForUserDBResult);
        }
      }
      else {
        let getBookingsForUserDBResult = await bookingService.getBookingsForUser(
          functionContext,
          getBookingsForUserRequest
        );
        if (Array.isArray(getBookingsForUserDBResult)) {
          getBookingsForUserDBResult = getBookingsForUserDBResult.map((booking) =>
            normalizeKidsFields(booking)
          );
        } else {
          getBookingsForUserDBResult = normalizeKidsFields(getBookingsForUserDBResult);
        }
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
            Key: "casinopridefiles/" + getBookingsForUserDBResult.ACKFile,
          });
          getBookingsForUserDBResult.ACKFile = imageUrl;
          response(functionContext, responseObj, getBookingsForUserDBResult);
        }
        else {
          response(functionContext, responseObj, getBookingsForUserDBResult);
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
    res.json({ acknowledgementLink })
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
      response(functionContext, responseObj, updateBookingDBResult);
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
      response(functionContext, responseObj, updateShiftForBookingDBResult);
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

      let paymentLinkId = await bookingService.addPaymentLinkToDB(functionContext, { shortCode, longUrl, ...SendPaymentLinkToCustomerRequest });
      // let SendPaymentLinkToCustomerDBResult = await bookingService.SendPaymentLinkToCustomer(
      //   functionContext,
      //   SendPaymentLinkToCustomerRequest
      // );
      response(functionContext, responseObj, {
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
  updateCommission: async (req, res) => {
    const { bookingId, bookingCommission } = req.body;
    if (!bookingId || bookingCommission === undefined || bookingCommission === null) {
      return res.json({ status: false, error: "bookingId and bookingCommission required" });
    }
    try {
      const functionContext = { logger: { logInfo: () => {} } };
      await bookingService.updateCommission(functionContext, bookingId, bookingCommission);
      res.json({ status: true, message: "Commission updated" });
    } catch (err) {
      res.json({ status: false, error: err.message });
    }
  },

  sendSMS: async (req, res) => {
    const { phone, shortUrl } = req.body;
    if (!phone || !shortUrl) {
      return res.json({ status: false, error: "phone and shortUrl required" });
    }
    const text = `Dear%20Sir,%0AGreetings%20from%20Casino%20Pride%0AWe%20would%20love%20to%20inform%20you%20that%20we%20have%20received%20your%20booking%20for%20${shortUrl}%20Kindly%20follow%20the%20link%20and%20show%20the%20QR%20code%20to%20the%20Front%20Office%20at%20the%20time%20of%20your%20arrival%20for%20hassle%20free%20entry.%0APlease%20make%20sure%20that%20people%20are%20above%2021%20years%20of%20age%20and%20are%20following%20the%20dress%20code%20that%20is%20smart%20casuals%20or%20formals.%20For%20men%20slippers,%20shorts,%20cut%20sleeves%20and%20caps%20are%20not%20allowed.%0APlease%20note%20that%20the%20booking%20amount%20is%20not%20refundable%20or%20transferable.%0AWe%20would%20love%20to%20have%20you%20onboard%20Casino%20Pride.%0ALet%27s%20play%20with%20PRIDE%20!!%0AThanks%20%26%20Regards%0A24x7%20helpline%20-%209158885000%0ATeam%20Casino%20Pride%20-%20CPGOAA`;
    const apiUrl = `https://commnestsms.com/api/push.json?apikey=635cd8e64fddd&route=transactional&sender=CPGOAA&mobileno=${phone}&text=${text}`;
    try {
      const smsRes = await axios.get(apiUrl);
      res.json({ status: true, data: smsRes.data });
    } catch (err) {
      res.json({ status: false, error: err.message });
    }
  },
};

module.exports = bookingController;
