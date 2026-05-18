const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const PaymentDetailsService = require("../services/payments");

const validate = require("../utils/validation");
const { sendBookingConfirmationMail } = require("../../booking/utils/helper");
const { disableBooking, enableBooking } = require("../../booking/services/booking");
require("dotenv").config({ path: __dirname + "/.env" });

const PaymentDetailsController = {
  addPaymentDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addPaymentDetails() invoked!!`);

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
      name: "addPaymentDetails",
      model: new responseModel.addPaymentDetails(),
    };
  
    let addPaymentDetailsRequest = new requestModel.addPaymentDetails(req);
    logger.logInfo(`addPaymentDetails() :: Request Object :: ${addPaymentDetailsRequest}`);
    addPaymentDetailsRequest.amount  = parseFloat(addPaymentDetailsRequest?.amount)
    if (addPaymentDetailsRequest?.paymentMode == "UPI") {
      addPaymentDetailsRequest.UPIID = addPaymentDetailsRequest.field1
    }
    else{
      if (addPaymentDetailsRequest?.bankCode == 'PHONEPE' || addPaymentDetailsRequest?.bankCode == 'PAYTM') {
        addPaymentDetailsRequest.paymentMode = "UPI"
        addPaymentDetailsRequest.UPIID = null
      }
      else{
      addPaymentDetailsRequest.UPIID = null
      }
    }
    let validateRequest = validate.addPaymentDetails(addPaymentDetailsRequest);
    
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addPaymentDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let addPaymentDetailsDBResult = await PaymentDetailsService.addPaymentDetails(
        functionContext,
        addPaymentDetailsRequest
      );
      if (addPaymentDetailsRequest?.paymentStatus == "failure" || addPaymentDetailsRequest?.paymentStatus =="Bounced") {
        // const failureRedirect = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:5858/PaymentFailure`
        await disableBooking(functionContext, {bookingId:addPaymentDetailsRequest.bookingId});
        const failureRedirect = `${process.env.BASE_URL}/PaymentFailure`
        res.redirect(402,failureRedirect)
      }
      else{

        if(addPaymentDetailsRequest?.paymentStatus == "success") {
          await enableBooking(functionContext, {bookingId:addPaymentDetailsRequest.bookingId});
        }
      // const redirectTo = "https://www.google.com/search?q=speed+test&oq=&gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIGCAAQRRg5MgYIARBFGDsyDQgCEAAYgwEYsQMYgAQyDQgDEAAYgwEYsQMYgAQyDQgEEAAYgwEYsQMYgAQyBggFEEUYQTIGCAYQRRg9MgQIBxAF0gEIMzE4M2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8"
      // const redirectTo = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:5858/SendAck?TransactionId=${addPaymentDetailsDBResult.TransactionId},PaymentId=${addPaymentDetailsDBResult.Id}`
      const redirectTo = `${process.env.BASE_URL}/SendAck?TransactionId=${addPaymentDetailsDBResult.TransactionId},PaymentId=${addPaymentDetailsDBResult.Id}`
      // const redirectTo = `http://localhost:3000/SendAck?TransactionId=${addPaymentDetailsDBResult.TransactionId},PaymentId=${addPaymentDetailsDBResult.Id}`
      // const redirectTo = `http://localhost:3000/`
      // Perform the redirect
      res.redirect(303, redirectTo);
      // response(functionContext, responseObj,addPaymentDetailsDBResult);
      }
    } catch (errAddPaymentDetails) {
      if (!errAddPaymentDetails.ErrorMessage && !errAddPaymentDetails.ErrorCode) {
        // logger.logInfo(`addPaymentDetailsDBResult :: Error :: ${errAddPaymentDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addPaymentDetailsDBResult :: Error :: ${JSON.stringify(errAddPaymentDetails)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  addPaymentDetailsAgent: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo(`addPaymentDetails() invoked!!`);

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
      name: "addPaymentDetails",
      model: new responseModel.addPaymentDetails(),
    };
  
    let addPaymentDetailsRequest = new requestModel.addPaymentDetails(req);
    logger.logInfo(`addPaymentDetails() :: Request Object :: ${addPaymentDetailsRequest}`);
    addPaymentDetailsRequest.amount  = parseFloat(addPaymentDetailsRequest?.amount)
    if (addPaymentDetailsRequest?.paymentMode == "UPI") {
      addPaymentDetailsRequest.UPIID = addPaymentDetailsRequest.field1
    }
    else{
      if (addPaymentDetailsRequest?.bankCode == 'PHONEPE' || addPaymentDetailsRequest?.bankCode == 'PAYTM') {
        addPaymentDetailsRequest.paymentMode = "UPI"
        addPaymentDetailsRequest.UPIID = null
      }
      else{
      addPaymentDetailsRequest.UPIID = null
      }
    }
    let validateRequest = validate.addPaymentDetails(addPaymentDetailsRequest);
    
    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addPaymentDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let addPaymentDetailsDBResult = await PaymentDetailsService.addPaymentDetails(
        functionContext,
        addPaymentDetailsRequest
      );
      if (addPaymentDetailsRequest?.paymentStatus == "failure" || addPaymentDetailsRequest?.paymentStatus =="Bounced") {
        // const failureRedirect = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:6868/PaymentFailure`
        await disableBooking(functionContext, {bookingId:addPaymentDetailsRequest.bookingId});
        const failureRedirect = `${process.env.AGENT_POS}/PaymentFailure`
        res.redirect(402,failureRedirect)
      }
      else{

        if(addPaymentDetailsRequest?.paymentStatus == "success") {
          await enableBooking(functionContext, {bookingId:addPaymentDetailsRequest.bookingId});
        }
        // const redirectTo = "https://www.google.com/search?q=speed+test&oq=&gs_lcrp=EgZjaHJvbWUqBggBEEUYOzIGCAAQRRg5MgYIARBFGDsyDQgCEAAYgwEYsQMYgAQyDQgDEAAYgwEYsQMYgAQyDQgEEAAYgwEYsQMYgAQyBggFEEUYQTIGCAYQRRg9MgQIBxAF0gEIMzE4M2owajeoAgCwAgA&sourceid=chrome&ie=UTF-8"
      // const redirectTo = `http://ec2-13-235-27-91.ap-south-1.compute.amazonaws.com:6868/SendAck?TransactionId=${addPaymentDetailsDBResult.TransactionId},PaymentId=${addPaymentDetailsDBResult.Id}`
      const redirectTo = `${process.env.AGENT_POS}/SendAck?TransactionId=${addPaymentDetailsDBResult.TransactionId},PaymentId=${addPaymentDetailsDBResult.Id}`
      // const redirectTo = `http://localhost:3000/SendAck?TransactionId=${addPaymentDetailsDBResult.TransactionId},PaymentId=${addPaymentDetailsDBResult.Id}`
      // Perform the redirect
      res.redirect(303, redirectTo);
      // response(functionContext, responseObj,addPaymentDetailsDBResult);
      }
    } catch (errAddPaymentDetails) {
      if (!errAddPaymentDetails.ErrorMessage && !errAddPaymentDetails.ErrorCode) {
        // logger.logInfo(`addPaymentDetailsDBResult :: Error :: ${errAddPaymentDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addPaymentDetailsDBResult :: Error :: ${JSON.stringify(errAddPaymentDetails)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updatePaymentDetails: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updatePaymentDetails() invoked!!`);

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
      name: "updatePaymentDetails",
      model: new responseModel.updatePaymentDetails(),
    };

    let addPaymentDetailsRequest = new requestModel.updatePaymentDetails(req);

    logger.logInfo(`updatePaymentDetails() :: Request Object :: ${addPaymentDetailsRequest}`);

    let validateRequest = validate.updatePaymentDetails(addPaymentDetailsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updatePaymentDetails() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addPaymentDetailsDBResult = await PaymentDetailsService.updatePaymentDetails(
        functionContext,
        addPaymentDetailsRequest
      );
      response(functionContext, responseObj,addPaymentDetailsDBResult);
    } catch (errAddPaymentDetails) {
      if (!errAddPaymentDetails.ErrorMessage && !errAddPaymentDetails.ErrorCode) {
        // logger.logInfo(`addPaymentDetailsDBResult :: Error :: ${errAddPaymentDetails}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addPaymentDetailsDBResult :: Error :: ${JSON.stringify(errAddPaymentDetails)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  updateBookingId: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`updateBookingId() invoked!!`);

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
      name: "updateBookingId",
      model: new responseModel.updateBookingId(),
    };

    let updateBookingIdRequest = new requestModel.updateBookingId(req);

    logger.logInfo(`updateBookingId() :: Request Object :: ${updateBookingIdRequest}`);

    let validateRequest = validate.updateBookingId(updateBookingIdRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `updateBookingId() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let updateBookingIdDBResult = await PaymentDetailsService.updateBookingId(
        functionContext,
        updateBookingIdRequest
      );
      let updatePaymentDetailsforBookingsDBResult = await PaymentDetailsService.updatePaymentDetailsforBookings(
        functionContext,
        updateBookingIdDBResult
      );

      const sendBookingMailRequest = {
        amount: updatePaymentDetailsforBookingsDBResult.AmountAfterDiscount, 
        packageName: JSON.parse(updatePaymentDetailsforBookingsDBResult.PackageName).join(", "),
        packageGuestCounts: JSON.parse(updatePaymentDetailsforBookingsDBResult.PackageGuestCount).join(", "),
        guestCount: updatePaymentDetailsforBookingsDBResult.TotalGuestCount,
        numOfTeens: updatePaymentDetailsforBookingsDBResult.NumOfTeens,
        fullName: updatePaymentDetailsforBookingsDBResult.FullName,
        email: updatePaymentDetailsforBookingsDBResult.Email,
        phone: updatePaymentDetailsforBookingsDBResult.Phone, 
        governmentId: updatePaymentDetailsforBookingsDBResult.GovernmentId,
        bookingDate: new Date(updatePaymentDetailsforBookingsDBResult.CreatedOn).toLocaleString("en-CA"),
        eventDate: updatePaymentDetailsforBookingsDBResult.FutureDate,
        transactionId: updateBookingIdDBResult.TransactionId
      }

      let mailResponse = sendBookingConfirmationMail(sendBookingMailRequest, functionContext, responseObj);


      response(functionContext, responseObj,updateBookingIdDBResult);
    } catch (errUpdateBookingId) {
      if (!errUpdateBookingId.ErrorMessage && !errUpdateBookingId.ErrorCode) {
        // logger.logInfo(`updateBookingIdDBResult :: Error :: ${errUpdateBookingId}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `updateBookingIdDBResult :: Error :: ${JSON.stringify(errUpdateBookingId)}`
      );
      response(functionContext, responseObj, null);
    }
  },

  
};

module.exports = PaymentDetailsController;
