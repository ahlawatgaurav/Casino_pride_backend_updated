const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const reportsService = {

    generateReportsByUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsByUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_generate_reports_by_user(
        :userId
        )`,
        {
            userId:resolvedResult.userId,
        }
      );

      // logger.logInfo(
      //   `generateReportsByUser() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateReportsByUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
      } 
     else if (err.sqlState && err.sqlState == constant.errorCode.noBookingForUser) {
        errorCode = constant.errorCode.noBookingForUser;
        errorMessage = constant.errorMessage.noBookingForUser;
      } 
    else  if (err.sqlState && err.sqlState == constant.errorCode.noBillForUser) {
        errorCode = constant.errorCode.noBillForUser;
        errorMessage = constant.errorMessage.noBillForUser;
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
    generateReportsByBillDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsByBillDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_generate_reports_by_day(
        :billDate
        )`,
        {
            billDate:resolvedResult.billDate,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateReportsByBillDate() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBillForDate) {
        errorCode = constant.errorCode.noBillForDate;
        errorMessage = constant.errorMessage.noBillForDate;
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
    generateReportsByFutureDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsByFutureDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_generate_reports_by_future_date(
        :futureDate
        )`,
        {
            futureDate:resolvedResult.futureDate,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateReportsByFutureDate() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
    generateReportsByShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsByShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_generate_reports_by_shifts(
        :billDate,
        :shiftId
        )`,
        {
            billDate:resolvedResult.billDate,
            shiftId:resolvedResult.shiftId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateReportsByShift() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBookingForShift) {
        errorCode = constant.errorCode.noBookingForShift;
        errorMessage = constant.errorMessage.noBookingForShift;
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
    uploadReportFile: async (functionContext, resolvedResult,FileURL) => {
    let logger = functionContext.logger;

    logger.logInfo("uploadReportFile() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_upload_reports(
        :reportTypeId,
        :reportFile
        )`,
        {
            reportTypeId:resolvedResult.reportTypeId,
            reportFile:FileURL,
        }
      );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`uploadReportFile() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
  generateNoShowReport: async (functionContext,resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateNoShowReport() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_fetch_no_show_list(
        :eventDate
      )`,{
        eventDate:resolvedResult.eventDate,
      });


      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateNoShowReport() :: Error :: ${JSON.stringify(err)}`);

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
  cashierReport: async (functionContext,resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("cashierReport() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_calculate_payment_total_on_payment_types(
        :date
      )`,{
        date:resolvedResult.date,
      });

      // logger.logInfo(
      //   `cashierReport() :: DB :: Returned Result :: ${JSON.stringify(
      //     rows[0][0][0]
      //   )}`
      // );
      // return rows[0][0] ? rows[0][0] : null;
      return {
        ...rows[0][0][0] ? rows[0][0][0] : null,
        ...rows[0][1][0] ? rows[0][1][0] : null,
        ...rows[0][2][0] ? rows[0][2][0] : null,
        ...rows[0][3][0] ? rows[0][3][0] : null,
        ...rows[0][4][0] ? rows[0][4][0] : null,
        ...rows[0][5][0] ? rows[0][5][0] : null,
        ...rows[0][6][0] ? rows[0][6][0] : null,
        ...rows[0][7][0] ? rows[0][7][0] : null,
        ...rows[0][8][0] ? rows[0][8][0] : null,
        ...rows[0][9][0] ? rows[0][9][0] : null,
      };
    } catch (err) {
      logger.logInfo(`cashierReport() :: Error :: ${JSON.stringify(err)}`);

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
  cashierReportShiftWise: async (functionContext,resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("cashierReportShiftWise() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_calculate_payment_total_on_payment_types_shift_wise(
        :date,
        :shiftId
      )`,{
        date:resolvedResult.date,
        shiftId:resolvedResult.shiftId,
      });

      // return rows[0][0] ? rows[0][0] : null;
      return {
        ...rows[0][0][0] ? rows[0][0][0] : null,
        ...rows[0][1][0] ? rows[0][1][0] : null,
        ...rows[0][2][0] ? rows[0][2][0] : null,
        ...rows[0][3][0] ? rows[0][3][0] : null,
        ...rows[0][4][0] ? rows[0][4][0] : null,
        ...rows[0][5][0] ? rows[0][5][0] : null,
        ...rows[0][6][0] ? rows[0][6][0] : null,
        ...rows[0][7][0] ? rows[0][7][0] : null,
        ...rows[0][8][0] ? rows[0][8][0] : null,
        ...rows[0][9][0] ? rows[0][9][0] : null,
      };
    } catch (err) {
      logger.logInfo(`cashierReportShiftWise() :: Error :: ${JSON.stringify(err)}`);

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
  generateReportsByDateRange: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsByDateRange() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_generate_reports_by_date_range(
        :fromDate,
        :toDate
        )`,
        {
            fromDate:resolvedResult.fromDate,
            toDate:resolvedResult.toDate,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateReportsByDateRange() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBillForDateRange) {
        errorCode = constant.errorCode.noBillForDateRange;
        errorMessage = constant.errorMessage.noBillForDateRange;
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
  generateReportsForAgentSettlement: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsForAgentSettlement() :: DB :: Invoked !");
	// console.log("update date-->>" , resolvedResult.settlementUpdateDate)
    console.log({
      // createdOn: bl.CreatedOn,
      updateParam: resolvedResult.settlementUpdateDate,
      settlementParam: resolvedResult.settlementDate
    });
	  //console.log("sett;ement date -->>" , resolvedResult.settlementDate);
    try {
      let rows = await dbconfig.knex.raw(
        `CALL generate_reports_for_agent_settlement(
        :userId,
        :userType,
        :settlementUpdateDate,
        :settlementDate,
	:settlementMonth
        )`,
        {
            userId:resolvedResult.userId,
            userType:resolvedResult.userType,
            settlementUpdateDate:resolvedResult.settlementUpdateDate,
            settlementDate:resolvedResult.settlementDate,
		settlementMonth:resolvedResult.settlementMonth // agent settlement new
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
	    console.log(err);
      logger.logInfo(`generateReportsForAgentSettlement() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
      } 
     else if (err.sqlState && err.sqlState == constant.errorCode.noBookingForUser) {
        errorCode = constant.errorCode.noBookingForUser;
        errorMessage = constant.errorMessage.noBookingForUser;
      } 
    else  if (err.sqlState && err.sqlState == constant.errorCode.noBillForUser) {
        errorCode = constant.errorCode.noBillForUser;
        errorMessage = constant.errorMessage.noBillForUser;
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
  generateReportsForAgentSettlementForSettlementUpdateDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("generateReportsForAgentSettlementForSettlementUpdateDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL generate_reports_for_agent_settlement_for_settlementUpdate_date(
        :userId,
        :userType,
        :settlementUpdateDate,
        :settlementMonth,
        :settlementFromDate
        )`,
        {
            userId:resolvedResult.userId,
            userType:resolvedResult.userType,
            settlementUpdateDate:resolvedResult.settlementUpdateDate,
            settlementMonth:resolvedResult.settlementMonth,
            settlementFromDate:resolvedResult.settlementFromDate || null,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`generateReportsForAgentSettlementForSettlementUpdateDate() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
      } 
     else if (err.sqlState && err.sqlState == constant.errorCode.noBookingForUser) {
        errorCode = constant.errorCode.noBookingForUser;
        errorMessage = constant.errorMessage.noBookingForUser;
      } 
    else  if (err.sqlState && err.sqlState == constant.errorCode.noBillForUser) {
        errorCode = constant.errorCode.noBillForUser;
        errorMessage = constant.errorMessage.noBillForUser;
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

  // API JSON report: packages sold by category (source) between bill dates
  packagesSoldByCategory: async (functionContext, resolvedResult) => {
    const logger = functionContext.logger;
    logger.logInfo("packagesSoldByCategory() :: DB :: Invoked !");

    try {
      const fromDate = resolvedResult.fromDate;
      const toDate = resolvedResult.toDate;

      const rows = await dbconfig.knex("billing as bl")
        .join("bookings as b", "b.Id", "bl.BookingId")
        .join("users as u", "u.Id", "b.UserId")
        .leftJoin("categorymaster as cm", "cm.idCategoryMaster", "u.CategoryId")
        .where("bl.IsActive", 1)
        .andWhere("bl.BillDate", ">=", fromDate)
        .andWhere("bl.BillDate", "<=", toDate)
        .andWhere((qb) => {
          qb.whereNull("bl.IsVoid").orWhere("bl.IsVoid", 0);
        })
        .select(
          "bl.Id as BillId",
          "bl.BookingId",
          "bl.BillDate",
          "bl.PackageId",
          "bl.PackageGuestCount",
          "bl.TotalGuestCount as PaxCount",
          "b.NumOfKids as ChildrenCount",
          "u.CategoryId",
          "cm.Category as CategoryName"
        );

      const safeParseIdList = (value) => {
        if (value === null || value === undefined) return [];
        // value looks like: [1,3] or ["1","3"] or "1,3"
        const s = String(value).trim();
        const normalized = s.replace(/^\[/, "").replace(/\]$/, "").replace(/\"/g, "");
        if (!normalized) return [];
        return normalized
          .split(",")
          .map((x) => Number(String(x).trim()))
          .filter((n) => Number.isFinite(n) && n > 0);
      };

      // Gather all packageIds across the date range so we can map -> PackageName
      const allPackageIds = new Set();
      for (const r of rows || []) {
        for (const pid of safeParseIdList(r.PackageId)) allPackageIds.add(pid);
      }

      const packageIdArr = Array.from(allPackageIds);
      const packageNameById = new Map();
      if (packageIdArr.length) {
        const pkgs = await dbconfig.knex("packages")
          .select("Id", "PackageName")
          .whereIn("Id", packageIdArr)
          .where("IsActive", 1)
          .where("IsPackageEnabled", 1);
        (pkgs || []).forEach((p) => packageNameById.set(Number(p.Id), p.PackageName));
      }

      // Aggregate per category
      const categoryMap = new Map(); // key: CategoryId (number|null) -> aggregate row
      const packageColumnsSet = new Set();

      for (const r of rows || []) {
        const categoryId = r.CategoryId !== undefined && r.CategoryId !== null ? Number(r.CategoryId) : 0;
        const categoryName = r.CategoryName || "Unknown";

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            CategoryId: categoryId,
            CategoryName: categoryName,
            PaxCount: 0,
            ChildrenCount: 0,
            Packages: {},
          });
        }

        const agg = categoryMap.get(categoryId);
        agg.PaxCount += Number(r.PaxCount || 0);
        agg.ChildrenCount += Number(r.ChildrenCount || 0);

        const pids = safeParseIdList(r.PackageId);
        for (const pid of pids) {
          const name = packageNameById.get(pid) || `Package_${pid}`;
          packageColumnsSet.add(name);
          agg.Packages[name] = (agg.Packages[name] || 0) + 1;
        }
      }

      // Ensure every row has all package columns with 0, for stable FE rendering
      const packageColumns = Array.from(packageColumnsSet).sort((a, b) => String(a).localeCompare(String(b)));
      const rowsOut = Array.from(categoryMap.values()).map((row) => {
        for (const col of packageColumns) {
          if (row.Packages[col] === undefined) row.Packages[col] = 0;
        }
        return row;
      });

      // Sort rows by CategoryName
      rowsOut.sort((a, b) => String(a.CategoryName).localeCompare(String(b.CategoryName)));

      return {
        fromDate,
        toDate,
        packageColumns,
        rows: rowsOut,
      };
    } catch (err) {
      logger.logInfo(`packagesSoldByCategory() :: Error :: ${JSON.stringify(err)}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },

};

module.exports = reportsService;
