const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");
const { CRMPanelURL } = require("../utils/settings");
const axios = require('axios');


const bookingService = {
  
  newBooking: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("newBooking() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_new_booking(
        :guestName,
        :address,
        :countryCode,
        :phone,
        :email,
        :dob,
        :country,
        :state,
        :city,
        :GSTNumber,
        :governmentId,
        :totalGuestCount,
        :numOfTeens,
        :discountId,
        :panelDiscountId,
        :couponId,
        :referredBy,
        :settledByCompany,
        :agentPanelDiscount,
        :localAgentName,
        :localAgentId,
        :travelAgentName,
        :travelAgentId,
        :packageId,
        :packageName,
        :packageGuestCount,
        :packageWeekdayPrice,
        :packageWeekendPrice,
        :userId,
        :userTypeId,
        :isBookingWebsite,
        :bookingDate,
        :futureDate,
        :shiftId,
        :teensPrice,
        :teensRate,
        :teensTax,
        :teensTaxName,
        :teensTaxBifurcation,
        :actualAmount,
        :amountAfterDiscount,
        :payAtCounter,
        :paymentMode,
        :cashAmount,
        :cardAmount,
        :UPIAmount,
        :UPIId,
        :cardHoldersName,
        :cardNumber,
        :cardType,
        :isActive,
        :bookingCommission
        )`,
        {
            guestName:resolvedResult.guestName,
            address:resolvedResult.address,
            countryCode:resolvedResult.countryCode,
            phone:resolvedResult.phone,
            email:resolvedResult.email,
            dob:resolvedResult.dob,
            country:resolvedResult.country,
            state:resolvedResult.state,
            city:resolvedResult.city,
            GSTNumber:resolvedResult.GSTNumber,
            governmentId:resolvedResult.governmentId,
            totalGuestCount:resolvedResult.totalGuestCount,
            // numOfKids:resolvedResult.numOfKids,
            numOfTeens:resolvedResult.numOfTeens,
            discountId:resolvedResult.discountId,
            panelDiscountId:resolvedResult.panelDiscountId,
            couponId:resolvedResult.couponId,
            referredBy:resolvedResult.referredBy,
            settledByCompany:resolvedResult.settledByCompany,
            agentPanelDiscount:resolvedResult.agentPanelDiscount,
            localAgentName:resolvedResult.localAgentName,
            localAgentId:resolvedResult.localAgentId,
            travelAgentName:resolvedResult.travelAgentName,
            travelAgentId:resolvedResult.travelAgentId,
            packageId:resolvedResult.packageId,
            packageName:resolvedResult.packageName,
            packageGuestCount:resolvedResult.packageGuestCount,
            packageWeekdayPrice:resolvedResult.packageWeekdayPrice,
            packageWeekendPrice:resolvedResult.packageWeekendPrice,
            userId:resolvedResult.userId,
            userTypeId:resolvedResult.userTypeId,
            isBookingWebsite:resolvedResult.isBookingWebsite,
            bookingDate:resolvedResult.bookingDate,
            futureDate:resolvedResult.futureDate,
            shiftId:resolvedResult.shiftId,
            teensPrice:resolvedResult.teensPrice,
            teensRate:resolvedResult.teensRate,
            teensTax:resolvedResult.teensTax,
            teensTaxName:resolvedResult.teensTaxName,
            teensTaxBifurcation:resolvedResult.TeensTaxBifurcation,
            actualAmount:resolvedResult.actualAmount,
            amountAfterDiscount:resolvedResult.amountAfterDiscount,
            payAtCounter:resolvedResult.payAtCounter,
            paymentMode:resolvedResult.paymentMode,
            cashAmount:resolvedResult.cashAmount,
            cardAmount:resolvedResult.cardAmount,
            UPIAmount:resolvedResult.UPIAmount,
            UPIId:resolvedResult.UPIId,
            cardHoldersName:resolvedResult.cardHoldersName,
            cardNumber:resolvedResult.cardNumber,
            cardType:resolvedResult.cardType,
            isActive:resolvedResult.isActive,
            bookingCommission: resolvedResult.bookingCommission,
        }
      );

      // logger.logInfo(
      //   `newBooking() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`newBooking() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
      } 
    else  if (err.sqlState && err.sqlState == constant.errorCode.noUserType) {
        errorCode = constant.errorCode.noUserType;
        errorMessage = constant.errorMessage.noUserType;
      } 
    else  if (err.sqlState && err.sqlState == constant.errorCode.noPackage) {
        errorCode = constant.errorCode.noPackage;
        errorMessage = constant.errorMessage.noPackage;
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
  disableBooking: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("disableBooking() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_disable_booking(:bookingId)`, {
        bookingId: resolvedResult.bookingId,
      });

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`disableBooking() :: DB :: Error :: ${JSON.stringify(err)}`);
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
  enableBooking: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("enableBooking() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_enable_booking(:bookingId)`, {
        bookingId: resolvedResult.bookingId,
      });

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`enableBooking() :: DB :: Error :: ${JSON.stringify(err)}`);
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
      let rows = await dbconfig.knex.raw(`CALL usp_get_user_bookings_by_phone(:phone)`, {
        phone: "+91"  + resolvedResult.phone,
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
  checkBannedUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("checkBannedUser() :: DB :: Invoked !");
    const phone = resolvedResult.phone.includes("+91") ? resolvedResult.phone.replace("+91", "") : resolvedResult.phone;
    try {
      let user = await axios.get(`${CRMPanelURL}/api/customer/fetchbannedcustomersusingmobile?Phone=${phone}`, {
        headers: {
          authorization: process.env.CRM_AUTH,
          appVersion: process.env.CRM_APP_VERSION
        }
      })
      .then((response) => {
        return response.data?.Details;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
      return user ?  user : null;
    } catch (err) {
      logger.logInfo(`checkBannedUser() :: DB :: Error :: ${JSON.stringify(err)}`);
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
  getBookingDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBookingDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_booking_details(
        :bookingId
        )`,
        {
          bookingId:resolvedResult.bookingId,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`getBookingDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  fetchBookings: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchBookings() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_bookings(
        :futureDate
        )`,
        {
          futureDate:resolvedResult.futureDate,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getBookingDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBookingExists) {
        errorCode = constant.errorCode.noBookingExists;
        errorMessage = constant.errorMessage.noBookingExists;
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
  displayPackages: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("displayPackages() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_display_enabled_packages()`
       
      );


      // return rows[0][0] ? rows[0][0] : null;
      return {
        packageDetails: rows[0][0] ? rows[0][0] : null,
        packageItemDetails: rows[0][1] ? rows[0][1] : null,
      };
    } catch (err) {
      logger.logInfo(`displayPackages() :: Error :: ${JSON.stringify(err)}`);

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
  uploadACKFile: async (functionContext, resolvedResult,fileURL) => {
    let logger = functionContext.logger;

    logger.logInfo("uploadACKFile() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_upload_acknowledgement(
        :bookingId,
        :ackFile
        )`,
        {
            bookingId:resolvedResult.bookingId,
            // ackFile:resolvedResult.fileUploadDetails,
            ackFile:fileURL,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`uploadACKFile() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  updateBooking: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateBooking() :: DB :: Invoked !");

    console.log({resolvedResult})
    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_booking(
        :bookingId,
        :guestName,
        :address,
        :dob,
        :country,
        :state,
        :city,
        :GSTNumber,
        :governmentId,
        :isActive,
        :totalGuestCount,
        :numOfTeens,
        :packageId,
        :packageName,
        :packageGuestCount,
        :packageWeekdayPrice,
        :packageWeekendPrice,
        :shiftId,
        :teensPrice,
        :teensRate,
        :teensTax,
        :teensTaxName,
        :teensTaxBifurcation,
        :actualAmount,
        :amountAfterDiscount,
        :paymentMode,
        :cashAmount,
        :cardAmount,
        :UPIAmount
        )`,
        {
            bookingId:resolvedResult.bookingId,
            guestName:resolvedResult.guestName,
            address:resolvedResult.address,
            dob:resolvedResult.dob,
            country:resolvedResult.country,
            state:resolvedResult.state,
            city:resolvedResult.city,
            GSTNumber:resolvedResult.GSTNumber,
            governmentId:resolvedResult.governmentId,
            isActive:resolvedResult.isActive,
            totalGuestCount:resolvedResult.totalGuestCount,
            numOfTeens:resolvedResult.numOfTeens,
            packageId:resolvedResult.packageId,
            packageName:resolvedResult.packageName,
            packageGuestCount:resolvedResult.packageGuestCount,
            packageWeekdayPrice:resolvedResult.packageWeekdayPrice,
            packageWeekendPrice:resolvedResult.packageWeekendPrice,
            shiftId:resolvedResult.shiftId,
            teensPrice:resolvedResult.teensPrice,
            teensRate:resolvedResult.teensRate,
            teensTax:resolvedResult.teensTax,
            teensTaxName:resolvedResult.teensTaxName,
            teensTaxBifurcation:resolvedResult.TeensTaxBifurcation,
            actualAmount:resolvedResult.actualAmount,
            amountAfterDiscount:resolvedResult.amountAfterDiscount,
            paymentMode:resolvedResult.paymentMode,
            cashAmount:resolvedResult.cashAmount,
            cardAmount:resolvedResult.cardAmount,
            UPIAmount:resolvedResult.UPIAmount,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateBooking() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  getBookingsForUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBookingsForUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_user_bookings(
        :userId
        )`,
        {
          userId:resolvedResult.userId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getBookingsForUser() :: Error :: ${JSON.stringify(err)}`);

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
  getBookingsForUserByDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBookingsForUserByDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_user_bookings_by_date(
        :userId,
        :date
        )`,
        {
          userId:resolvedResult.userId,
          date:resolvedResult.date,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getBookingsForUserByDate() :: Error :: ${JSON.stringify(err)}`);

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
  updateBookingForPayAtCounter: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateBookingForPayAtCounter() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_booking_details_for_pay_at_counter(
        :bookingId,
        :paymentMode,
        :cashAmount,
        :cardAmount,
        :UPIAmount,
        :UPIId,
        :cardHoldersName,
        :cardNumber,
        :cardType,
        :settleByCompany
        )`,
        {
            bookingId:resolvedResult.bookingId,
            paymentMode:resolvedResult.paymentMode,
            cashAmount:resolvedResult.cashAmount,
            cardAmount:resolvedResult.cardAmount,
            UPIAmount:resolvedResult.UPIAmount,
            UPIId:resolvedResult.UPIId,
            cardHoldersName:resolvedResult.cardHoldersName,
            cardNumber:resolvedResult.cardNumber,
            cardType:resolvedResult.cardType,
            settleByCompany:resolvedResult.settleByCompany,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateBookingForPayAtCounter() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  updateShiftForBooking: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateShiftForBooking() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_shift_for_bookings(
        :bookingId,
        :shiftId
        )`,
        {
            bookingId:resolvedResult.bookingId,
            shiftId:resolvedResult.shiftTypeId,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updateShiftForBooking() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  SendPaymentLinkToCustomer: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("SendPaymentLinkToCustomer() :: DB :: Invoked !");

    try {

      
    } catch (err) {
      logger.logInfo(`updateShiftForBooking() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  addPaymentLinkToDB: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addPaymentLinkToDB() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.table("PaymentLinks").insert({
        ShortCode: resolvedResult.shortCode,
        Url: resolvedResult.longUrl,
        BookingId: resolvedResult.bookingId,
        phone: resolvedResult.phone,
      });
      return rows[0];
    } catch (err) {
      logger.logInfo(`addPaymentLinkToDB() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  getBookingLink: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getBookingLink() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.table("PaymentLinks").select("*").where({
        ShortCode: resolvedResult.shortCode
      }).first();

      return rows ? rows : null;
    } catch (err) {
      logger.logInfo(`getBookingLink() :: DB :: Error :: ${JSON.stringify(err)}`);
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
};

module.exports = bookingService;
