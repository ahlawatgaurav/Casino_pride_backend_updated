const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");
const { CRMPanelURL } = require("../utils/settings");
const axios = require('axios');

const BOOKING_DATE_BLOCKS_TABLE = "BookingDateBlocks";

const ensureBookingDateBlocksTable = async () => {
  const exists = await dbconfig.knex.schema.hasTable(BOOKING_DATE_BLOCKS_TABLE);
  if (!exists) {
    await dbconfig.knex.schema.createTable(BOOKING_DATE_BLOCKS_TABLE, (table) => {
      table.increments("Id").primary();
      table.date("StartDate").notNullable();
      table.date("EndDate").notNullable();
      table.string("DateType", 30).notNullable();
      table.string("Reason", 255).nullable();
      table.integer("IsActive").notNullable().defaultTo(1);
      table.timestamp("CreatedAt").defaultTo(dbconfig.knex.fn.now());
      table.timestamp("UpdatedAt").defaultTo(dbconfig.knex.fn.now());
    });
  }
};

const getBlockedPeriodForDate = async (dateValue) => {
  if (!dateValue) return null;

  await ensureBookingDateBlocksTable();

  return dbconfig
    .knex(BOOKING_DATE_BLOCKS_TABLE)
    .select("Id", "StartDate", "EndDate", "DateType", "Reason")
    .where({ IsActive: 1 })
    .whereRaw("? BETWEEN StartDate AND EndDate", [dateValue])
    .first();
};

const toDateOnly = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getBookingWindow = async () => {
  const rows = await dbconfig.knex.raw(`CALL usp_fetch_future_booking_dates()`);
  const bookingWindow = rows?.[0]?.[0]?.[0] || null;

  return bookingWindow
    ? {
        startDate: toDateOnly(bookingWindow.StartDate),
        endDate: toDateOnly(bookingWindow.EndDate),
      }
    : null;
};

const validateBookingDateAvailability = async (functionContext, dateValue) => {
  const bookingDate = toDateOnly(dateValue);

  if (!bookingDate) {
    functionContext.error = new errorModel.ErrorModel(
      "Please select a valid booking date.",
      constant.errorCode.invalidRequest
    );
    throw functionContext.error;
  }

  const blockedPeriod = await getBlockedPeriodForDate(bookingDate);
  if (blockedPeriod) {
    const dateTypeLabel =
      blockedPeriod.DateType === "sold_out" ? "sold out" : "blacked out";
    functionContext.error = new errorModel.ErrorModel(
      `This date is ${dateTypeLabel}. Please contact admin.`,
      constant.errorCode.invalidRequest
    );
    throw functionContext.error;
  }

  const bookingWindow = await getBookingWindow();
  if (
    !bookingWindow?.startDate ||
    !bookingWindow?.endDate ||
    bookingWindow.startDate > bookingWindow.endDate
  ) {
    functionContext.error = new errorModel.ErrorModel(
      "Booking window is not configured correctly.",
      constant.errorCode.invalidRequest
    );
    throw functionContext.error;
  }

  if (
    bookingDate < bookingWindow.startDate ||
    bookingDate > bookingWindow.endDate
  ) {
    functionContext.error = new errorModel.ErrorModel(
      `Booking date must be between ${bookingWindow.startDate} and ${bookingWindow.endDate}.`,
      constant.errorCode.invalidRequest
    );
    throw functionContext.error;
  }

};

const ensureCategoryPackageVisibilityColumns = async () => {
  const hasAgentColumn = await dbconfig.knex.schema.hasColumn(
    "CategoryPackages",
    "ShowInAgentPanel"
  );
  const hasWebsiteColumn = await dbconfig.knex.schema.hasColumn(
    "CategoryPackages",
    "ShowInWebsite"
  );

  if (!hasAgentColumn || !hasWebsiteColumn) {
    await dbconfig.knex.schema.table("CategoryPackages", (table) => {
      if (!hasAgentColumn) {
        table.integer("ShowInAgentPanel").notNullable().defaultTo(0);
      }
      if (!hasWebsiteColumn) {
        table.integer("ShowInWebsite").notNullable().defaultTo(0);
      }
    });
  }

  if (!hasAgentColumn) {
    await dbconfig.knex("CategoryPackages")
      .where("IsEnabled", 1)
      .update({ ShowInAgentPanel: 1 });
  }
};

const getPackageVisibilityColumn = (visibilityTarget) => {
  return String(visibilityTarget || "agent").toLowerCase() === "website"
    ? "ShowInWebsite"
    : "ShowInAgentPanel";
};

const getVisiblePackageIdsForCategory = async (categoryId, visibilityTarget) => {
  await ensureCategoryPackageVisibilityColumns();

  const visibilityColumn = getPackageVisibilityColumn(visibilityTarget);
  const query = dbconfig
    .knex("CategoryPackages")
    .select("PackageId")
    .where({ [visibilityColumn]: 1 });

  if (categoryId) {
    query.andWhere({ CategoryId: categoryId });
  }

  const enabledRows = await query;

  return new Set((enabledRows || []).map((r) => r.PackageId));
};

const bookingService = {
  
  newBooking: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("newBooking() :: DB :: Invoked !");

    try {
      // Business date must come from the OPEN outlet (the running business day),
      // not the terminal's clock. After midnight the 3rd shift still belongs to the
      // outlet's date, so bills/bookings stay on that date until the outlet closes.
      try {
        const __outletRes = await dbconfig.knex.raw(
          "SELECT DATE_FORMAT(`Date`,'%Y-%m-%d') AS d FROM outlets WHERE OutletStatus=1 ORDER BY Id DESC LIMIT 1"
        );
        const __outletDate = __outletRes && __outletRes[0] && __outletRes[0][0] ? __outletRes[0][0].d : null;
        if (__outletDate) {
          const __origBooking = resolvedResult.bookingDate ? String(resolvedResult.bookingDate).slice(0, 10) : null;
          const __origFuture = resolvedResult.futureDate ? String(resolvedResult.futureDate).slice(0, 10) : null;
          resolvedResult.bookingDate = __outletDate;
          if (!__origFuture || __origFuture === __origBooking) {
            resolvedResult.futureDate = __outletDate;
          }
        }
      } catch (__eOutlet) {
        logger.logInfo(`newBooking() :: outlet-date resolve skipped :: ${__eOutlet}`);
      }

      const selectedBookingDate =
        resolvedResult.futureDate || resolvedResult.bookingDate;

      await validateBookingDateAvailability(functionContext, selectedBookingDate);

      // Guard: same mobile number cannot create another lead within 24 hours.
      // Exempt internal staff (Admin/Manager/GRE/Accounts) and Call Centre users — only external agents are limited.
      const creatorUserType = Number(resolvedResult.userTypeId);
      const STAFF_USER_TYPES = [1, 2, 3, 7]; // Admin, Manager, GRE, Accounts
      let skipDuplicateCheck = STAFF_USER_TYPES.includes(creatorUserType);
      if (!skipDuplicateCheck) {
        const creatorId = resolvedResult.travelAgentId || resolvedResult.userId;
        if (creatorId) {
          const creator = await dbconfig
            .knex("users as u")
            .leftJoin("CategoryMaster as c", "u.CategoryId", "c.idCategoryMaster")
            .where("u.Id", Number(creatorId))
            .first("c.Category as CategoryName");
          const catName = String(creator?.CategoryName || "").toLowerCase();
          if (catName.includes("call center") || catName.includes("call centre")) {
            skipDuplicateCheck = true;
          }
        }
      }

      const phoneDigits = String(resolvedResult.phone || "").replace(/\D/g, "").slice(-10);
      if (!skipDuplicateCheck && phoneDigits.length >= 10) {
        const recent = await dbconfig.knex("bookings")
          .whereRaw(
            "RIGHT(REGEXP_REPLACE(COALESCE(Phone,''), '[^0-9]', ''), 10) = ?",
            [phoneDigits]
          )
          .andWhere("IsActive", 1)
          .andWhereRaw("CreatedOn >= DATE_SUB(NOW(), INTERVAL 24 HOUR)")
          .first("Id");
        if (recent) {
          logger.logInfo(
            `newBooking() :: Duplicate lead blocked for phone ending ${phoneDigits} (existing booking ${recent.Id})`
          );
          functionContext.error = new errorModel.ErrorModel(
            "A lead for this mobile number was already created in the last 24 hours. Please try again after 24 hours.",
            constant.errorCode.invalidRequest
          );
          throw functionContext.error;
        }
      }

      const bookingParams = {
        guestName: resolvedResult.guestName,
        address: resolvedResult.address,
        countryCode: resolvedResult.countryCode,
        phone: resolvedResult.phone,
        email: resolvedResult.email,
        dob: resolvedResult.dob,
        country: resolvedResult.country,
        state: resolvedResult.state,
        city: resolvedResult.city,
        GSTNumber: resolvedResult.GSTNumber,
        governmentId: resolvedResult.governmentId,
        totalGuestCount: resolvedResult.totalGuestCount,
        hasKids: resolvedResult.hasKids,
        numOfKids: resolvedResult.numOfKids,
        numOfTeens: resolvedResult.numOfTeens || resolvedResult.numOfKids || 0,
        discountId: resolvedResult.discountId,
        panelDiscountId: resolvedResult.panelDiscountId,
        couponId: resolvedResult.couponId,
        referredBy: resolvedResult.referredBy,
        settledByCompany: resolvedResult.settledByCompany,
        agentPanelDiscount: resolvedResult.agentPanelDiscount,
        localAgentName: resolvedResult.localAgentName,
        localAgentId: resolvedResult.localAgentId,
        travelAgentName: resolvedResult.travelAgentName,
        travelAgentId: resolvedResult.travelAgentId,
        packageId: resolvedResult.packageId,
        packageName: resolvedResult.packageName,
        packageGuestCount: resolvedResult.packageGuestCount,
        packageWeekdayPrice: resolvedResult.packageWeekdayPrice,
        packageWeekendPrice: resolvedResult.packageWeekendPrice,
        userId: resolvedResult.userId,
        userTypeId: resolvedResult.userTypeId,
        isBookingWebsite: resolvedResult.isBookingWebsite,
        bookingDate: resolvedResult.bookingDate || selectedBookingDate,
        futureDate: resolvedResult.futureDate || selectedBookingDate,
        shiftId: resolvedResult.shiftId,
        teensPrice: resolvedResult.teensPrice,
        teensRate: resolvedResult.teensRate,
        teensTax: resolvedResult.teensTax,
        teensTaxName: resolvedResult.teensTaxName,
        teensTaxBifurcation: resolvedResult.TeensTaxBifurcation,
        actualAmount: resolvedResult.actualAmount,
        amountAfterDiscount: resolvedResult.amountAfterDiscount,
        payAtCounter: resolvedResult.payAtCounter,
        paymentMode: resolvedResult.paymentMode,
        cashAmount: resolvedResult.cashAmount,
        cardAmount: resolvedResult.cardAmount,
        UPIAmount: resolvedResult.UPIAmount,
        UPIId: resolvedResult.UPIId,
        cardHoldersName: resolvedResult.cardHoldersName,
        cardNumber: resolvedResult.cardNumber,
        cardType: resolvedResult.cardType,
        isActive: resolvedResult.isActive,
        bookingCommission: resolvedResult.bookingCommission,
      };

      let rows;
      try {
        rows = await dbconfig.knex.raw(
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
          :hasKids,
          :numOfKids,
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
          bookingParams
        );
      } catch (dbErr) {
        // Backward compatibility for older DB procedure signatures without hasKids/numOfKids.
        const isProcArgMismatch =
          dbErr &&
          (dbErr.errno === 1318 ||
            (typeof dbErr.sqlMessage === "string" &&
              dbErr.sqlMessage.toLowerCase().includes("incorrect number of arguments")));

        if (isProcArgMismatch) {
          logger.logInfo("newBooking() :: Retrying with legacy usp_new_booking signature");
          rows = await dbconfig.knex.raw(
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
            bookingParams
          );
        } else {
          throw dbErr;
        }
      }

      // logger.logInfo(
      //   `newBooking() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      const createdBooking = rows[0][0][0] ? rows[0][0][0] : null;

      // Persist per-package discounts (call-centre) — SP doesn't handle this column.
      if (createdBooking?.Id && resolvedResult.packageDiscounts) {
        try {
          await dbconfig
            .knex("bookings")
            .where({ Id: createdBooking.Id })
            .update({ PackageDiscounts: resolvedResult.packageDiscounts });
        } catch (e) {
          logger.logInfo(`newBooking() :: PackageDiscounts save skipped :: ${e.message}`);
        }
      }

      return createdBooking;
    } catch (err) {
      if (err?.ErrorMessage && err?.ErrorCode) {
        functionContext.error = err;
        throw err;
      }

      logger.logInfo(`newBooking() :: Error :: ${JSON.stringify(err)}`);
      console.error("newBooking() :: Raw DB Error ::", {
        errno: err?.errno,
        code: err?.code,
        sqlState: err?.sqlState,
        sqlMessage: err?.sqlMessage,
        message: err?.message,
      });

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
      const phoneWithCode = "+91" + resolvedResult.phone;
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_user_bookings_by_phone(:phone)`,
        {
          phone: phoneWithCode,
        }
      );

      const user = rows[0][0][0] ? rows[0][0][0] : null;
      if (!user) return null;

      // Backward-compatible: some booking-focused SPs don't return CategoryId.
      // Fetch it directly from Users table so frontend can filter packages by category.
      if (user.CategoryId == null) {
        try {
          const catRow = await dbconfig.knex("users")
            .select("CategoryId")
            .where({ Phone: phoneWithCode })
            .first();
          if (catRow && catRow.CategoryId != null) {
            user.CategoryId = catRow.CategoryId;
          }
        } catch (catErr) {
          logger.logInfo(
            `getUserByPhone() :: CategoryId lookup failed :: ${JSON.stringify(
              catErr
            )}`
          );
        }
      }

      return user;
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
  displayPackages: async (functionContext, resolvedResult = {}) => {
    let logger = functionContext.logger;

    logger.logInfo("displayPackages() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_display_enabled_packages()`
       
      );


      const packageDetails = rows[0][0] ? rows[0][0] : null;
      const packageItemDetails = rows[0][1] ? rows[0][1] : null;

      const categoryId = resolvedResult?.categoryId ? Number(resolvedResult.categoryId) : null;
      if (!categoryId) {
        if (resolvedResult?.visibilityTarget) {
          const allowedIds = await getVisiblePackageIdsForCategory(
            null,
            resolvedResult.visibilityTarget
          );

          return {
            packageDetails: Array.isArray(packageDetails)
              ? packageDetails.filter((p) => allowedIds.has(p.Id))
              : packageDetails,
            packageItemDetails: Array.isArray(packageItemDetails)
              ? packageItemDetails.filter((i) => allowedIds.has(i.PackageId))
              : packageItemDetails,
          };
        }

        // Backward compatible behavior: if categoryId not provided, return everything.
        return {
          packageDetails: Array.isArray(packageDetails) ? packageDetails : (packageDetails || []),
          packageItemDetails: Array.isArray(packageItemDetails) ? packageItemDetails : (packageItemDetails || []),
        };
      }

      // Whitelist behavior: only show packages explicitly enabled for this surface.
      const allowedIds = await getVisiblePackageIdsForCategory(
        categoryId,
        resolvedResult?.visibilityTarget
      );

      const filteredPackageDetails = Array.isArray(packageDetails)
        ? packageDetails.filter((p) => allowedIds.has(p.Id))
        : packageDetails;

      const filteredPackageItemDetails = Array.isArray(packageItemDetails)
        ? packageItemDetails.filter((i) => allowedIds.has(i.PackageId))
        : packageItemDetails;

      return {
        packageDetails: filteredPackageDetails,
        packageItemDetails: filteredPackageItemDetails,
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

  displayPackagesEnabled: async (functionContext, resolvedResult = {}) => {
    const logger = functionContext.logger;
    logger.logInfo("displayPackagesEnabled() :: DB :: Invoked !");

    try {
      // Category whitelist (strict): show only packages enabled for the given categoryId.
      const categoryId = resolvedResult?.categoryId
        ? Number(resolvedResult.categoryId)
        : null;

      if (!categoryId) {
        return { packageDetails: [], packageItemDetails: [] };
      }

      const allowedIds = await getVisiblePackageIdsForCategory(
        categoryId,
        resolvedResult?.visibilityTarget
      );

      if (allowedIds.size === 0) {
        return { packageDetails: [], packageItemDetails: [] };
      }

      const rows = await dbconfig.knex.raw(`CALL usp_display_enabled_packages()`);

      const packageDetails = rows[0][0] ? rows[0][0] : [];
      const packageItemDetails = rows[0][1] ? rows[0][1] : [];

      const filteredPackageDetails = Array.isArray(packageDetails)
        ? packageDetails.filter((p) => allowedIds.has(p.Id))
        : [];

      const filteredPackageItemDetails = Array.isArray(packageItemDetails)
        ? packageItemDetails.filter((i) => allowedIds.has(i.PackageId))
        : [];

      return {
        packageDetails: filteredPackageDetails,
        packageItemDetails: filteredPackageItemDetails,
      };
    } catch (err) {
      logger.logInfo(
        `displayPackagesEnabled() :: Error :: ${JSON.stringify(err)}`
      );

      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
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
  updateBookingCommission: async (functionContext, bookingId, commission) => {
    try {
      await dbconfig.knex.raw(
        `UPDATE bookings SET BookingCommision = :commission WHERE Id = :bookingId`,
        { commission: commission, bookingId: bookingId }
      );
    } catch (err) {
      functionContext.logger.logInfo(
        `updateBookingCommission() :: Error :: ${JSON.stringify(err)}`
      );
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
