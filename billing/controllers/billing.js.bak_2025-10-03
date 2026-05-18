const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const billingService = require("../services/billing");

const validate = require("../utils/validation");

const FileUploadFunction = require("../utils/fileUpload").FileUploadFunction;
const fs = require("fs");
const nodemailer = require("nodemailer");
const emailCreds = require("../utils/settings").EmailCreds;
const AWS = require("aws-sdk");

const billingController = {
  addBillingDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addBillingDetails() invoked!!`);

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
      name: "addBillingDetails",
      model: new responseModel.addBillingDetails(),
    };

    let addBillingDetailsRequest = new requestModel.addBillingDetails(req);

    // logger.logInfo(`addBillingDetails() :: Request Object :: ${addBillingDetailsRequest}`);

    let validateRequest = validate.addBillingDetails(addBillingDetailsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addBillingDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let getPackageItemDetailsDBResult =
        await billingService.getPackageItemDetails(
          functionContext,
          addBillingDetailsRequest
        );
      // response(functionContext, responseObj,getPackageItemDetailsDBResult);
      let addBillingDetailsDBResult = [];

      if (
        addBillingDetailsRequest.totalGuestCount -
          addBillingDetailsRequest.teensCount ==
        0
      ) {
        let getPrevBillDBResult = await billingService.getPrevBill(
          functionContext
        );
        let result = await billingService.addBillingDetails(
          functionContext,
          addBillingDetailsRequest,
          getPackageItemDetailsDBResult,
          getPrevBillDBResult
        );
        addBillingDetailsDBResult.push({ ...result });
      } else {
        for (
          let index = 0;
          index < getPackageItemDetailsDBResult.length;
          index++
        ) {
          const element = getPackageItemDetailsDBResult[index];
          let getPrevBillDBResult = await billingService.getPrevBill(
            functionContext
          );
          let result = await billingService.addBillingDetails(
            functionContext,
            addBillingDetailsRequest,
            element,
            getPrevBillDBResult
          );
          addBillingDetailsDBResult.push({ ...result });
        }
      }

      // parsing the ItemDetails to convert it
      for (const item of addBillingDetailsDBResult) {
        item.ItemDetails = JSON.parse(item.ItemDetails);
      }
      response(functionContext, responseObj, addBillingDetailsDBResult);
    } catch (errAddBillingDetails) {
      if (
        !errAddBillingDetails.ErrorMessage &&
        !errAddBillingDetails.ErrorCode
      ) {
        // logger.logInfo(`addBillingDetailsDBResult :: Error :: ${errAddBillingDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addBillingDetailsDBResult :: Error :: ${JSON.stringify(
          errAddBillingDetails
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getBillingDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`getBillingDetails() invoked!!`);

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
      name: "getBillingDetails",
      model: new responseModel.getBillingDetails(),
    };
    let getBillingDetailsRequest = new requestModel.getBillingDetails(req);

    // logger.logInfo(`getBillingDetails() :: Request Object :: ${getBillingDetailsRequest}`);

    let validateRequest = validate.getBillingDetails(getBillingDetailsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getBillingDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      if (
        getBillingDetailsRequest.billId == 0 &&
        getBillingDetailsRequest.billingDate == null &&
        getBillingDetailsRequest.shiftId == 0 &&
        getBillingDetailsRequest.userId == 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        
        let getBillingDetailsDBResult = await billingService.getBillingDetails(
          functionContext,
           getBillingDetailsRequest
        );
console.log('start billing',new Date(),getBillingDetailsDBResult.length)
        //Sending Package Price according to discount / weekend weekday
        for (const item of getBillingDetailsDBResult) {
          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }

        //parsing the ItemDetails to convert it
        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
 console.log('end billing',new Date())
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId != 0 &&
        getBillingDetailsRequest.billingDate == null &&
        getBillingDetailsRequest.shiftId == 0 &&
        getBillingDetailsRequest.userId == 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        let getBillingDetailsDBResult =
          await billingService.getBilliDetailsByBillId(
            functionContext,
            getBillingDetailsRequest
          );

        //Sending Package Price according to discount / weekend weekday
        for (const item of getBillingDetailsDBResult) {
          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }

        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId == 0 &&
        getBillingDetailsRequest.billingDate != null &&
        getBillingDetailsRequest.shiftId == 0 &&
        getBillingDetailsRequest.userId == 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        let getBillingDetailsDBResult =
          await billingService.getBilliDetailsByBillDate(
            functionContext,
            getBillingDetailsRequest
          );

        //Sending Package Price according to discount / weekend weekday
        for (const item of getBillingDetailsDBResult) {
          const bookingDate = new Date(item.FutureDate);
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }

        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId == 0 &&
        getBillingDetailsRequest.billingDate != null &&
        getBillingDetailsRequest.shiftId != 0 &&
        getBillingDetailsRequest.userId == 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        let getBillingDetailsDBResult =
          await billingService.getBilliDetailsByShift(
            functionContext,
            getBillingDetailsRequest
          );

        //Sending Package Price according to discount / weekend weekday
        for (const item of getBillingDetailsDBResult) {
          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }

        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId == 0 &&
        getBillingDetailsRequest.billingDate == null &&
        getBillingDetailsRequest.shiftId == 0 &&
        getBillingDetailsRequest.userId != 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        let getBillingDetailsDBResult =
          await billingService.getBilliDetailsByUser(
            functionContext,
            getBillingDetailsRequest
          );

        //sending Package price according to discount/weekday/weekend
        for (const item of getBillingDetailsDBResult) {
          // Check if discounts are not zero
          const hasDiscount =
            item.PanelDiscount !== 0 ||
            item.CouponDiscount !== 0 ||
            item.WebsiteDiscount !== 0 ||
            item.AgentPanelDiscount !== null;

          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }
        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId != 0 &&
        getBillingDetailsRequest.billingDate != null &&
        getBillingDetailsRequest.shiftId != 0 &&
        getBillingDetailsRequest.userId != 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        let getBillingDetailsDBResult =
          await billingService.getBilliDetailsByAllFilters(
            functionContext,
            getBillingDetailsRequest
          );

        for (const item of getBillingDetailsDBResult) {
          // Check if discounts are not zero
          const hasDiscount =
            item.PanelDiscount !== 0 ||
            item.CouponDiscount !== 0 ||
            item.WebsiteDiscount !== 0 ||
            item.AgentPanelDiscount !== null;

          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }
        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId == 0 &&
        getBillingDetailsRequest.billingDate == null &&
        getBillingDetailsRequest.shiftId == 0 &&
        getBillingDetailsRequest.userId == 0 &&
        getBillingDetailsRequest.isBookingWebsite == 1 &&
        getBillingDetailsRequest.futureDate != null &&
        getBillingDetailsRequest.fromDate == null &&
        getBillingDetailsRequest.toDate == null
      ) {
        let getBillingDetailsDBResult =
          await billingService.getBilliDetailsBookingWebsite(
            functionContext,
            getBillingDetailsRequest
          );

        for (const item of getBillingDetailsDBResult) {
          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }

        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      } else if (
        getBillingDetailsRequest.billId == 0 &&
        getBillingDetailsRequest.billingDate == null &&
        getBillingDetailsRequest.shiftId == 0 &&
        getBillingDetailsRequest.userId == 0 &&
        getBillingDetailsRequest.isBookingWebsite == 0 &&
        getBillingDetailsRequest.futureDate == null &&
        getBillingDetailsRequest.fromDate != null &&
        getBillingDetailsRequest.toDate != null
      ) {
        let getBillingDetailsDBResult =
          await billingService.billingListReportByShift(
            functionContext,
            getBillingDetailsRequest
          );
        //Sending Package Price according to discount / weekend weekday
        for (const item of getBillingDetailsDBResult) {
          const bookingDate = new Date(
            item.FutureDate
          );
          const dayOfWeek = bookingDate.getDay();

          item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

          item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

          const FinalPrice = [];
          if (item.PanelDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.PanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.CouponDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.CouponDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.WebsiteDiscount != 0) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.WebsiteDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else if (item.AgentPanelDiscount != null) {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              for (
                let index = 0;
                index < item.PackageWeekendPrice.length;
                index++
              ) {
                const element = item.PackageWeekendPrice[index];

                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                FinalPrice.push(A1);
              }
            } else {
              for (
                let index = 0;
                index < item.PackageWeekdayPrice.length;
                index++
              ) {
                const element = item.PackageWeekdayPrice[index];
                const A1 =
                  JSON.parse(element) -
                  (item.AgentPanelDiscount / 100) * JSON.parse(element);
                // FinalPrice = [...A1]
                FinalPrice.push(A1);
              }
            }
          } else {
            if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
              //is a weekend
              FinalPrice.push(...item.PackageWeekendPrice);
            } else {
              FinalPrice.push(...item.PackageWeekdayPrice);
            }
          }
          item.FinalPrice = FinalPrice;
        }

        for (const item of getBillingDetailsDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        getBillingDetailsDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });
            getBillingDetailsDBResult[index].BillingFile = imageUrl;
          } else {
            getBillingDetailsDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, getBillingDetailsDBResult);
      }
	
	// edited code start 
     // else if (
       // getBillingDetailsRequest.methodOfPayment != null &&
       // getBillingDetailsRequest.billId == 0 &&
       // getBillingDetailsRequest.billingDate == null &&
       // getBillingDetailsRequest.shiftId == 0 &&
       // getBillingDetailsRequest.userId == 0 &&
       // getBillingDetailsRequest.isBookingWebsite == 0 &&
       // getBillingDetailsRequest.futureDate == null &&
       // getBillingDetailsRequest.fromDate == null &&
       // getBillingDetailsRequest.toDate == null
     // ) {
      //  let getBillingDetailsDBResult = await billingService.getBillingDetailsByMOP(
        //  functionContext,
      //    getBillingDetailsRequest
    //    );

  //      response(functionContext, responseObj, getBillingDetailsDBResult);
//      }
      // edit code ended





    } catch (errGetBillingDetails) {
      if (
        !errGetBillingDetails.ErrorMessage &&
        !errGetBillingDetails.ErrorCode
      ) {
        // logger.logInfo(`getBillingDetailsDBResult :: Error :: ${errGetBillingDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addBillingDetailsDBResult :: Error :: ${JSON.stringify(
          errGetBillingDetails
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  uploadBillFile: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`uploadBillFile() invoked!!`);

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
      name: "uploadBillFile",
      model: new responseModel.uploadBillFile(),
    };

    let uploadBillFileRequest = new requestModel.uploadBillFile(req);
    let requestContext = {
      ...uploadBillFileRequest,
    };

    // logger.logInfo(`uploadBillFile() :: Request Object :: ${uploadBillFileRequest}`);

    let validateRequest = validate.uploadBillFile(uploadBillFileRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `uploadBillFile() Error:: Invalid Request :: ${JSON.stringify(
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
                "BillFile",
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
        const { parse } = require("url");
        const path = require("path");

        // Parse the URL
        const parsedUrl = parse(url);

        // Extract the filename from the path
        const filename = path.basename(parsedUrl.pathname);
        let uploadBillFileDBResult = await billingService.uploadBillFile(
          functionContext,
          // uploadACKFileRequest
          requestContext,
          filename
        );
        //parsing the ItemDetails to convert it
        for (const item of uploadBillFileDBResult) {
          item.ItemDetails = JSON.parse(item.ItemDetails);
        }
        // Loop through each object in the array
        uploadBillFileDBResult.forEach((item, index) => {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });
          if (item.BillingFile != null) {
            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + item.BillingFile,
            });

            uploadBillFileDBResult[index].Bill = item.BillingFile;
            uploadBillFileDBResult[index].BillingFile = imageUrl;
          } else {
            uploadBillFileDBResult[index].Bill = null;
            uploadBillFileDBResult[index].BillingFile = null;
          }
        });
        response(functionContext, responseObj, uploadBillFileDBResult);
      }
    } catch (errUploadBillFile) {
      if (!errUploadBillFile.ErrorMessage && !errUploadBillFile.ErrorCode) {
        // logger.logInfo(`uploadBillFileDBResult :: Error :: ${errUploadBillFile}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `uploadBillFileDBResult :: Error :: ${JSON.stringify(
          errUploadBillFile
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateBillingDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateBillingDetails() invoked!!`);

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
      name: "updateBillingDetails",
      model: new responseModel.updateBillingDetails(),
    };

    let updateBillingDetailsRequest = new requestModel.updateBillingDetails(
      req
    );

    // logger.logInfo(`updateBillingDetails() :: Request Object :: ${updateBillingDetailsRequest}`);

    let validateRequest = validate.updateBillingDetails(
      updateBillingDetailsRequest
    );

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateBillingDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let updateBillingDetailsDBResult =
        await billingService.updateBillingDetails(
          functionContext,
          updateBillingDetailsRequest
        );
      // parsing the ItemDetails to convert it
      for (const item of updateBillingDetailsDBResult) {
        item.ItemDetails = JSON.parse(item.ItemDetails);
      }
      response(functionContext, responseObj, updateBillingDetailsDBResult);
    } catch (errUpdateBillingDetails) {
      if (
        !errUpdateBillingDetails.ErrorMessage &&
        !errUpdateBillingDetails.ErrorCode
      ) {
        // logger.logInfo(`updateBillingDetailsDBResult :: Error :: ${errUpdateBillingDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateBillingDetailsDBResult :: Error :: ${JSON.stringify(
          errUpdateBillingDetails
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  voidBill: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`voidBill() invoked!!`);

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
      name: "voidBill",
      model: new responseModel.voidBill(),
    };

    let voidBillRequest = new requestModel.voidBill(req);

    // logger.logInfo(`voidBill() :: Request Object :: ${voidBillRequest}`);

    let validateRequest = validate.voidBill(voidBillRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `voidBill() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let voidBillDBResult = await billingService.voidBill(
        functionContext,
        voidBillRequest
      );
      // parsing the ItemDetails to convert it
      for (const item of voidBillDBResult) {
        item.ItemDetails = JSON.parse(item.ItemDetails);
      }
      response(functionContext, responseObj, voidBillDBResult);
    } catch (errVoidBill) {
      if (!errVoidBill.ErrorMessage && !errVoidBill.ErrorCode) {
        // logger.logInfo(`voidBillDBResult :: Error :: ${errVoidBill}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `voidBillDBResult :: Error :: ${JSON.stringify(errVoidBill)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateBillIdForVoid: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateBillIdForVoid() invoked!!`);

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
      name: "updateBillIdForVoid",
      model: new responseModel.updateBillIdForVoid(),
    };

    let updateBillIdForVoidRequest = new requestModel.updateBillIdForVoid(req);

    // logger.logInfo(`updateBillIdForVoid() :: Request Object :: ${updateBillIdForVoidRequest}`);

    let validateRequest = validate.updateBillIdForVoid(
      updateBillIdForVoidRequest
    );

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateBillIdForVoid() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let updateBillIdForVoidDBResult =
        await billingService.updateBillIdForVoid(
          functionContext,
          updateBillIdForVoidRequest
        );
      // parsing the ItemDetails to convert it
      // for (const item of updateBillIdForVoidDBResult) {
      //   item.ItemDetails = JSON.parse(item.ItemDetails);
      // }
      const updatedResult = {
        ...updateBillIdForVoidDBResult,
        ItemDetails: JSON.parse(updateBillIdForVoidDBResult.ItemDetails),
      };
      response(functionContext, responseObj, updatedResult);
    } catch (errUpdateBillIdForVoid) {
      if (
        !errUpdateBillIdForVoid.ErrorMessage &&
        !errUpdateBillIdForVoid.ErrorCode
      ) {
        // logger.logInfo(`updateBillIdForVoidDBResult :: Error :: ${errUpdateBillIdForVoid}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateBillIdForVoidDBResult :: Error :: ${JSON.stringify(
          errUpdateBillIdForVoid
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  sendBillMail: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`sendBillMail() invoked!!`);

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
      name: "sendBillMail",
      model: new responseModel.sendBillMail(),
    };

    let sendBillMailRequest = new requestModel.sendBillMail(req);

    // logger.logInfo(`sendBillMail() :: Request Object :: ${sendBillMailRequest}`);

    let validateRequest = validate.sendBillMail(sendBillMailRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `sendBillMail() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      // logger.logInfo(`notifySellers() invoked!`);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailCreds.username,
          pass: emailCreds.password,
        },
      });

      const mailOptions = {
        from: emailCreds.username,
        to: sendBillMailRequest.receiverMail,
        subject: "Casino Pride Bill",
        text: `Thank you for choosing Casino Pride.\nView e-bill of Rs ${sendBillMailRequest.amount} at ${sendBillMailRequest.billFile}.\n\nLets Play with Pride!\nGood Luck\nCPGOAA`,
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
          // response(functionContext, {
          //   Status: "Email sent",
          //   SuccessCode: 200,
          // });
          response(functionContext, responseObj, {
            Status: "Email sent",
            SuccessCode: 200,
          });
        }
      });
    } catch (errSendBillMail) {
      if (!errSendBillMail.ErrorMessage && !errSendBillMail.ErrorCode) {
        // logger.logInfo(`errSendBillMail :: Error :: ${errSendBillMail}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `errSendBillMail :: Error :: ${JSON.stringify(errSendBillMail)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateItemDetailsBill: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateItemDetailsBill() invoked!!`);

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
      name: "updateItemDetailsBill",
      model: new responseModel.updateItemDetailsBill(),
    };

    let updateItemDetailsBillRequest = new requestModel.updateItemDetailsBill(
      req
    );

    // logger.logInfo(`updateItemDetailsBill() :: Request Object :: ${updateItemDetailsBillRequest}`);

    let validateRequest = validate.updateItemDetailsBill(
      updateItemDetailsBillRequest
    );

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateItemDetailsBill() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let updateItemDetailsBillDBResult =
        await billingService.updateItemDetailsBill(
          functionContext,
          updateItemDetailsBillRequest
        );
      // parsing the ItemDetails to convert it
      for (const item of updateItemDetailsBillDBResult) {
        item.ItemDetails = JSON.parse(item.ItemDetails);
      }
      for (const item of updateItemDetailsBillDBResult) {
        item.UpdatedItemDetails = JSON.parse(item.UpdatedItemDetails);
      }
      // const updatedResult = {
      //   ...updateBillIdForVoidDBResult,
      //   ItemDetails: JSON.parse(updateBillIdForVoidDBResult.ItemDetails),
      // };
      response(functionContext, responseObj, updateItemDetailsBillDBResult);
    } catch (errUpdateItemDetailsBill) {
      if (
        !errUpdateItemDetailsBill.ErrorMessage &&
        !errUpdateItemDetailsBill.ErrorCode
      ) {
        // logger.logInfo(`updateItemDetailsBillDBResult :: Error :: ${errUpdateItemDetailsBill}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateItemDetailsBillDBResult :: Error :: ${JSON.stringify(
          errUpdateItemDetailsBill
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  noShowGuestList: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`noShowGuestList() invoked!!`);

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
      name: "noShowGuestList",
      model: new responseModel.noShowGuestList(),
    };

    let noShowGuestListRequest = new requestModel.noShowGuestList(req);

    // logger.logInfo(`noShowGuestList() :: Request Object :: ${noShowGuestListRequest}`);

    let validateRequest = validate.noShowGuestList(noShowGuestListRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `noShowGuestList() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let noShowGuestListDBResult = await billingService.noShowGuestList(
        functionContext,
        noShowGuestListRequest
      );
      response(functionContext, responseObj, noShowGuestListDBResult);
    } catch (errNoShowGuestList) {
      if (!errNoShowGuestList.ErrorMessage && !errNoShowGuestList.ErrorCode) {
        // logger.logInfo(`noShowGuestListDBResult :: Error :: ${errNoShowGuestList}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `noShowGuestListDBResult :: Error :: ${JSON.stringify(
          errNoShowGuestList
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  fetchVoidBill: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`fetchVoidBill() invoked!!`);

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
      name: "fetchVoidBill",
      model: new responseModel.fetchVoidBill(),
    };

    try {
      let fetchVoidBillDBResult = await billingService.fetchVoidBill(
        functionContext
      );

      //Sending Package Price according to discount / weekend weekday
      for (const item of fetchVoidBillDBResult) {
        const bookingDate = new Date(
          item.FutureDate
        );
        const dayOfWeek = bookingDate.getDay();

        item.PackageWeekdayPrice = JSON.parse(item.PackageWeekdayPrice);

        item.PackageWeekendPrice = JSON.parse(item.PackageWeekendPrice);

        const FinalPrice = [];
        if (item.PanelDiscount != 0) {
          if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            //is a weekend
            for (
              let index = 0;
              index < item.PackageWeekendPrice.length;
              index++
            ) {
              const element = item.PackageWeekendPrice[index];

              const A1 =
                JSON.parse(element) -
                (item.PanelDiscount / 100) * JSON.parse(element);
              FinalPrice.push(A1);
            }
          } else {
            for (
              let index = 0;
              index < item.PackageWeekdayPrice.length;
              index++
            ) {
              const element = item.PackageWeekdayPrice[index];
              const A1 =
                JSON.parse(element) -
                (item.PanelDiscount / 100) * JSON.parse(element);
              // FinalPrice = [...A1]
              FinalPrice.push(A1);
            }
          }
        } else if (item.CouponDiscount != 0) {
          if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            //is a weekend
            for (
              let index = 0;
              index < item.PackageWeekendPrice.length;
              index++
            ) {
              const element = item.PackageWeekendPrice[index];

              const A1 =
                JSON.parse(element) -
                (item.CouponDiscount / 100) * JSON.parse(element);
              FinalPrice.push(A1);
            }
          } else {
            for (
              let index = 0;
              index < item.PackageWeekdayPrice.length;
              index++
            ) {
              const element = item.PackageWeekdayPrice[index];
              const A1 =
                JSON.parse(element) -
                (item.CouponDiscount / 100) * JSON.parse(element);
              // FinalPrice = [...A1]
              FinalPrice.push(A1);
            }
          }
        } else if (item.WebsiteDiscount != 0) {
          if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            //is a weekend
            for (
              let index = 0;
              index < item.PackageWeekendPrice.length;
              index++
            ) {
              const element = item.PackageWeekendPrice[index];

              const A1 =
                JSON.parse(element) -
                (item.WebsiteDiscount / 100) * JSON.parse(element);
              FinalPrice.push(A1);
            }
          } else {
            for (
              let index = 0;
              index < item.PackageWeekdayPrice.length;
              index++
            ) {
              const element = item.PackageWeekdayPrice[index];
              const A1 =
                JSON.parse(element) -
                (item.WebsiteDiscount / 100) * JSON.parse(element);
              // FinalPrice = [...A1]
              FinalPrice.push(A1);
            }
          }
        } else if (item.AgentPanelDiscount != null) {
          if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            //is a weekend
            for (
              let index = 0;
              index < item.PackageWeekendPrice.length;
              index++
            ) {
              const element = item.PackageWeekendPrice[index];

              const A1 =
                JSON.parse(element) -
                (item.AgentPanelDiscount / 100) * JSON.parse(element);
              FinalPrice.push(A1);
            }
          } else {
            for (
              let index = 0;
              index < item.PackageWeekdayPrice.length;
              index++
            ) {
              const element = item.PackageWeekdayPrice[index];
              const A1 =
                JSON.parse(element) -
                (item.AgentPanelDiscount / 100) * JSON.parse(element);
              // FinalPrice = [...A1]
              FinalPrice.push(A1);
            }
          }
        } else {
          if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
            //is a weekend
            FinalPrice.push(...item.PackageWeekendPrice);
          } else {
            FinalPrice.push(...item.PackageWeekdayPrice);
          }
        }
        item.FinalPrice = FinalPrice;
      }

      //parsing the ItemDetails to convert it
      for (const item of fetchVoidBillDBResult) {
        item.ItemDetails = JSON.parse(item.ItemDetails);
      }
      // Loop through each object in the array
      fetchVoidBillDBResult.forEach((item, index) => {
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });
        if (item.BillingFile != null) {
          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + item.BillingFile,
          });

          fetchVoidBillDBResult[index].BillingFile = imageUrl;
        } else {
          fetchVoidBillDBResult[index].BillingFile = null;
        }
      });
      response(functionContext, responseObj, fetchVoidBillDBResult);
    } catch (errFetchVoidBill) {
      if (!errFetchVoidBill.ErrorMessage && !errFetchVoidBill.ErrorCode) {
        // logger.logInfo(`fetchVoidBillDBResult :: Error :: ${errFetchVoidBill}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `fetchVoidBillDBResult :: Error :: ${JSON.stringify(errFetchVoidBill)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = billingController;
