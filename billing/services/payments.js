const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const PaymentDetailsService = {
 
    addPaymentDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addPaymentDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_payment_details(
        :transactionId,
        :paymentMode,
        :paymentStatus,
        :bankCode,
        :UPIId,
        :guestName,
        :amount,
        :bookingId
        )`,
        {
          transactionId: resolvedResult.transactionId,
          paymentMode: resolvedResult.paymentMode,
          paymentStatus: resolvedResult.paymentStatus,
          bankCode: resolvedResult.bankCode,
          UPIId: resolvedResult.UPIID,
          guestName: resolvedResult.firstname,
          amount: resolvedResult.amount,
          bookingId: +resolvedResult.bookingId
        }
      );

      // logger.logInfo(
      //   `addPaymentDetails() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addPaymentDetails() :: Error :: ${JSON.stringify(err)}`);

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
    updatePaymentDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updatePaymentDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_payment_details(
        :paymentId,
        :paymentRef,
        :paymentMode,
        :paymentStatus
        )`,
        {
          paymentId: resolvedResult.paymentId,
          paymentRef: resolvedResult.paymentRef,
          paymentMode: resolvedResult.paymentMode,
          paymentStatus: resolvedResult.paymentStatus,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updatePaymentDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      
      if (err.sqlState && err.sqlState == constant.errorCode.noPayment) {
        errorCode = constant.errorCode.noPayment;
        errorMessage = constant.errorMessage.noPayment;
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
  updateBookingId: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateBookingId() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_booking_id_payments(
        :paymentId,
        :transactionId,
        :bookingId
        )`,
        {
          paymentId: resolvedResult.paymentId,
          transactionId: resolvedResult.transactionId,
          bookingId: resolvedResult.bookingId
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateBookingId() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      
      if (err.sqlState && err.sqlState == constant.errorCode.noPayment) {
        errorCode = constant.errorCode.noPayment;
        errorMessage = constant.errorMessage.noPayment;
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
  updatePaymentDetailsforBookings: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updatePaymentDetailsforBookings() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_payment_details_in_bookings(
        :bookingId,
        :paymentMode,
        :bankCode,
        :UPIId,
        :guestName,
        :amount
        )`,
        {
          bookingId: resolvedResult.BookingId,
          paymentMode: resolvedResult.PaymentMode,
          bankCode: resolvedResult.BankCode,
          UPIId: resolvedResult.UPIId,
          guestName: resolvedResult.GuestName,
          amount: resolvedResult.Amount
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updatePaymentDetailsforBookings() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      
      if (err.sqlState && err.sqlState == constant.errorCode.noPayment) {
        errorCode = constant.errorCode.noPayment;
        errorMessage = constant.errorMessage.noPayment;
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
};

module.exports = PaymentDetailsService;
