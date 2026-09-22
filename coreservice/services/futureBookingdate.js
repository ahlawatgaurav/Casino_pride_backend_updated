const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const BLOCKED_DATES_TABLE = "BookingDateBlocks";

const ensureBlockedDatesTable = async () => {
  const exists = await dbconfig.knex.schema.hasTable(BLOCKED_DATES_TABLE);
  if (!exists) {
    await dbconfig.knex.schema.createTable(BLOCKED_DATES_TABLE, (table) => {
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

const futureBookingDateService = {
    fetchFutureBookingDate: async (functionContext) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchFutureBookingDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_future_booking_dates()`
      );

      // logger.logInfo(
      //   `fetchFutureBookingDate() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0][0])}`
      // );

      await ensureBlockedDatesTable();
      const bookingWindow = rows[0][0][0] ? rows[0][0][0] : null;
      const blockedDates = await dbconfig
        .knex(BLOCKED_DATES_TABLE)
        .select("Id", "StartDate", "EndDate", "DateType", "Reason", "IsActive")
        .where({ IsActive: 1 })
        .orderBy("StartDate", "asc");

      return {
        ...(bookingWindow || {}),
        BlockedDates: blockedDates || [],
      };
    } catch (err) {
      logger.logInfo(`fetchFutureBookingDate() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

     {
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
  
  addUpdateFutureBookingDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addUpdateFutureBookingDate() :: DB :: Invoked !");

    try {
      await ensureBlockedDatesTable();

      if (
        resolvedResult.dateType === "sold_out" ||
        resolvedResult.dateType === "black_out"
      ) {
        const payload = {
          StartDate: resolvedResult.startDate,
          EndDate: resolvedResult.endDate,
          DateType: resolvedResult.dateType,
          Reason: resolvedResult.reason,
          IsActive: 1,
        };
        const dbPayload = {
          ...payload,
          UpdatedAt: dbconfig.knex.fn.now(),
        };

        if (resolvedResult.blockedDateId) {
          await dbconfig
            .knex(BLOCKED_DATES_TABLE)
            .where({ Id: resolvedResult.blockedDateId })
            .update(dbPayload);
          return { Id: resolvedResult.blockedDateId, ...payload };
        }

        const insertedIds = await dbconfig.knex(BLOCKED_DATES_TABLE).insert({
          ...dbPayload,
          CreatedAt: dbconfig.knex.fn.now(),
        });

        return { Id: insertedIds[0], ...payload };
      }

      let rows = await dbconfig.knex.raw(
        `CALL usp_add_update_future_booking_date(
        :futureDateId,
        :startDate,
        :endDate
        )`,
        {
            futureDateId:resolvedResult.futureDateId,
            startDate:resolvedResult.startDate,
            endDate:resolvedResult.endDate,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addUpdateFutureBookingDate() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

   {
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

  deleteBlockedDatePeriod: async (functionContext, resolvedResult) => {
    const logger = functionContext.logger;
    logger.logInfo("deleteBlockedDatePeriod() :: DB :: Invoked !");

    try {
      await ensureBlockedDatesTable();
      const blockedDateId = Number(resolvedResult.blockedDateId);

      await dbconfig
        .knex(BLOCKED_DATES_TABLE)
        .where({ Id: blockedDateId })
        .update({ IsActive: 0, UpdatedAt: dbconfig.knex.fn.now() });

      return { Id: blockedDateId, IsActive: 0 };
    } catch (err) {
      logger.logInfo(
        `deleteBlockedDatePeriod() :: Error :: ${JSON.stringify(err)}`
      );

      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );

      throw functionContext.error;
    }
  },
 
};

module.exports = futureBookingDateService;
