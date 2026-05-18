const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");
const momentTimezone = require("moment-timezone");
const billingService = {
  getPackageItemDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getPackageItemDetails() :: DB :: Invoked !");
    try {
      const stringWithoutBrackets = resolvedResult.packageId.slice(1, -1);
      const arrayFromString = stringWithoutBrackets.split(",");
      const stringWithoutBrackets2 = resolvedResult.packageGuestCount.slice(
        1,
        -1
      );
      const arrayFromString2 = stringWithoutBrackets2.split(",");

      //Weekday Package Prices
      const stringWithoutBracketsWD = resolvedResult.packageWeekdayPrice.slice(
        1,
        -1
      );
      const arrayFromStringWD = stringWithoutBracketsWD.split(",");

      //Weekend Package Prices
      const stringWithoutBracketsWK = resolvedResult.packageWeekendPrice.slice(
        1,
        -1
      );
      const arrayFromStringWK = stringWithoutBracketsWK.split(",");

      const result = [];
      for (let index = 0; index < arrayFromString.length; index++) {
        const element = arrayFromString[index];
        let rows = await dbconfig.knex.raw(
          `CALL usp_get_package_item_details(
          :packageId
      )`,
          {
            packageId: element,
          }
        );

        // console.log('rows[0][0][0]',rows[0][0][0]);
        // console.log('rows[0][0][1]',rows[0][0][1]);
        result.push({ ...rows[0][0] });
      }

      const billingDate = new Date(resolvedResult.billingDate);
      const dayOfWeek = billingDate.getDay();

      //remove the key index using flatmap to convert into one single array of objects
      const results = result.flatMap((item) => {
        const keys = Object.keys(item);
        return keys.map((key) => item[key]);
      });

      // Create a map to group objects by ItemTax
      const groupedByItemTax = new Map();

      if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        console.log("weekend-->");
        results.forEach((item) => {
          // Extract PackageId from the item
          const convertedPackageId = item.PackageId.toString(); // Convert to string to match arrayFromString elements
          // Find the index of the matching PackageId in arrayFromString
          const index = arrayFromString.findIndex(
            (element) => element === convertedPackageId
          );
          const result = arrayFromString2[index];

          const weekendPackage = arrayFromStringWK[index];
          if (
            item.IsDeductable == 1 &&
            resolvedResult.actualAmount - resolvedResult.amountAfterDiscount >
              0 &&
            resolvedResult.totalGuestCount - resolvedResult.teensCount != 0
          ) {
            const A1 =
              weekendPackage - (resolvedResult.discount / 100) * weekendPackage;
            const A2 = weekendPackage - A1;
            const P1 = item.ItemWeekendPrice - A2;
            const P2 = P1 / ((100 + item.ItemTax) / 100);
            const Tax1 = P1 - P2;
            const {
              ItemTax,
              Id,
              ItemName,
              ItemWeekendPrice,
              // ItemWeekendRate,
              ItemTaxName,
              IsDeductable,
              TaxDiffWeekend,
              PackageId,
            } = item;
            // const processedItemName = ItemName.map((name) => name.replace(/'/g, ''));
            if (!groupedByItemTax.has(ItemTax)) {
              groupedByItemTax.set(ItemTax, {
                ItemTax,
                ItemId: [Id],
                ItemName: [ItemName],
                Price: [ItemWeekendPrice],
                Rate: [P2],
                ItemTaxName: [ItemTaxName],
                TaxDiff: [TaxDiffWeekend],
                TaxBifurcation: [Tax1],
                IsDeductable: [IsDeductable],
                PackageId: [PackageId],
              });
            } else {
              groupedByItemTax.get(ItemTax).ItemName.push(ItemName);
              groupedByItemTax.get(ItemTax).ItemId.push(Id);
              groupedByItemTax.get(ItemTax).Price.push(ItemWeekendPrice);
              groupedByItemTax.get(ItemTax).Rate.push(P2);
              groupedByItemTax.get(ItemTax).ItemTaxName.push(ItemTaxName);
              groupedByItemTax.get(ItemTax).TaxDiff.push(TaxDiffWeekend);
              groupedByItemTax.get(ItemTax).TaxBifurcation.push(Tax1);
              groupedByItemTax.get(ItemTax).IsDeductable.push(IsDeductable);
              groupedByItemTax.get(ItemTax).PackageId.push(PackageId);
            }
            // }
          } else {
            const {
              ItemTax,
              Id,
              ItemName,
              ItemWeekendPrice,
              ItemWeekendRate,
              ItemTaxName,
              IsDeductable,
              TaxDiffWeekend,
              PackageId,
            } = item;
            // const processedItemName = ItemName.map((name) => name.replace(/'/g, ''));
            if (!groupedByItemTax.has(ItemTax)) {
              groupedByItemTax.set(ItemTax, {
                ItemTax,
                ItemId: [Id],
                ItemName: [ItemName],
                Price: [ItemWeekendPrice],
                Rate: [ItemWeekendRate],
                ItemTaxName: [ItemTaxName],
                TaxDiff: [TaxDiffWeekend],
                IsDeductable: [IsDeductable],
                PackageId: [PackageId],
              });
            } else {
              groupedByItemTax.get(ItemTax).ItemName.push(ItemName);
              groupedByItemTax.get(ItemTax).ItemId.push(Id);
              groupedByItemTax.get(ItemTax).Price.push(ItemWeekendPrice);
              groupedByItemTax.get(ItemTax).Rate.push(ItemWeekendRate);
              groupedByItemTax.get(ItemTax).ItemTaxName.push(ItemTaxName);
              groupedByItemTax.get(ItemTax).TaxDiff.push(TaxDiffWeekend);
              groupedByItemTax.get(ItemTax).IsDeductable.push(IsDeductable);
              groupedByItemTax.get(ItemTax).PackageId.push(PackageId);
            }
          }
        });
      } else {
        results.forEach((item) => {
          // Extract PackageId from the item
          const convertedPackageId = item.PackageId.toString(); // Convert to string to match arrayFromString elements
          // Find the index of the matching PackageId in arrayFromString
          const index = arrayFromString.findIndex(
            (element) => element === convertedPackageId
          );
          const result = arrayFromString2[index];

          const weekdayPackage = arrayFromStringWD[index];
          if (
            item.IsDeductable == 1 &&
            resolvedResult.actualAmount - resolvedResult.amountAfterDiscount >
              0 &&
            resolvedResult.totalGuestCount - resolvedResult.teensCount != 0
          ) {
            //calculating 10% on weekday package price
            const A1 =
              weekdayPackage - (resolvedResult.discount / 100) * weekdayPackage;
            const A2 = weekdayPackage - A1;
            const P1 = item.ItemWeekdayPrice - A2;
            const P2 = P1 / ((100 + item.ItemTax) / 100);
            const Tax1 = P1 - P2;
            const {
              ItemTax,
              Id,
              ItemName,
              ItemWeekdayPrice,
              // ItemWeekdayRate,
              ItemTaxName,
              TaxDiffWeekday,
              IsDeductable,
              PackageId,
            } = item;
            if (!groupedByItemTax.has(ItemTax)) {
              groupedByItemTax.set(ItemTax, {
                ItemTax,
                ItemId: [Id],
                ItemName: [ItemName],
                Price: [ItemWeekdayPrice],
                Rate: [P2],
                ItemTaxName: [ItemTaxName],
                TaxDiff: [TaxDiffWeekday],
                TaxBifurcation: [Tax1],
                IsDeductable: [IsDeductable],
                PackageId: [PackageId],
              });
            } else {
              groupedByItemTax.get(ItemTax).ItemName.push(ItemName);
              groupedByItemTax.get(ItemTax).ItemId.push(Id);
              groupedByItemTax.get(ItemTax).Price.push(ItemWeekdayPrice);
              groupedByItemTax.get(ItemTax).Rate.push(P2);
              groupedByItemTax.get(ItemTax).ItemTaxName.push(ItemTaxName);
              groupedByItemTax.get(ItemTax).TaxDiff.push(TaxDiffWeekday);
              groupedByItemTax.get(ItemTax).TaxBifurcation.push(Tax1);
              groupedByItemTax.get(ItemTax).IsDeductable.push(IsDeductable);
              groupedByItemTax.get(ItemTax).PackageId.push(PackageId);
            }
            // }
          } else {
            const {
              ItemTax,
              Id,
              ItemName,
              ItemWeekdayPrice,
              ItemWeekdayRate,
              ItemTaxName,
              TaxDiffWeekday,
              IsDeductable,
              PackageId,
            } = item;
            if (!groupedByItemTax.has(ItemTax)) {
              groupedByItemTax.set(ItemTax, {
                ItemTax,
                ItemId: [Id],
                ItemName: [ItemName],
                Price: [ItemWeekdayPrice],
                Rate: [ItemWeekdayRate],
                ItemTaxName: [ItemTaxName],
                TaxDiff: [TaxDiffWeekday],
                IsDeductable: [IsDeductable],
                PackageId: [PackageId],
              });
            } else {
              groupedByItemTax.get(ItemTax).ItemName.push(ItemName);
              groupedByItemTax.get(ItemTax).ItemId.push(Id);
              groupedByItemTax.get(ItemTax).Price.push(ItemWeekdayPrice);
              groupedByItemTax.get(ItemTax).Rate.push(ItemWeekdayRate);
              groupedByItemTax.get(ItemTax).ItemTaxName.push(ItemTaxName);
              groupedByItemTax.get(ItemTax).TaxDiff.push(TaxDiffWeekday);
              groupedByItemTax.get(ItemTax).IsDeductable.push(IsDeductable);
              groupedByItemTax.get(ItemTax).PackageId.push(PackageId);
            }
          }
        });
      }
      // Extract the grouped values as an array
      const resulting = [...groupedByItemTax.values()];

      const GuestCount = resolvedResult.packageGuestCount.slice(1, -1);
      const PackageGuestCount = GuestCount.split(",");
      const data = {
        packageGuestCount: PackageGuestCount,
      };

      // Use map to convert elements to numbers
      data.packageGuestCount = data.packageGuestCount.map(Number);
      resulting.forEach((item) => {
        item.packageGuestCount = data.packageGuestCount;
      });

      return resulting;
    } catch (err) {
      logger.logInfo(
        `getPackageItemDetails() :: Error :: ${JSON.stringify(err)}`
      );

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

  getPrevBill: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("newBooking() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_prev_bill()`);

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`getPrevBill() :: Error :: ${JSON.stringify(err)}`);

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

  addBillingDetails: async (
    functionContext,
    resolvedResult,
    ItemDetails,
    getPrevBillDBResult
  ) => {
    let logger = functionContext.logger;

    logger.logInfo("newBooking() :: DB :: Invoked !");

    try {
      const result = [];
      //checking if total guest count minus teens count is zero if its zero (i.e. in case when only one teens go) then there are no item details so is empty object
      if (resolvedResult.totalGuestCount - resolvedResult.teensCount === 0) {
        if (getPrevBillDBResult != null) {
          //checking if billing table is empty or not
          // Get the current date
          // const currentDate = momentTimezone().tz("Asia/Kolkata").format("YYYY-MM-DD");
          const currentDate = momentTimezone().tz("Asia/Kolkata");
          const prevDate = momentTimezone(getPrevBillDBResult?.BillDate).format(
            "YYYY-MM-DD"
          );
          if (
            currentDate.month() === 3 &&
            currentDate.date() === 1 &&
            momentTimezone(prevDate).month() === 2 &&
            momentTimezone(prevDate).date() == 31
          ) {
            let rows = await dbconfig.knex.raw(
              `CALL usp_add_billing_details(
              :bookingId,
              :packageId,
              :packageGuestCount,
              :totalGuestCount,
              :billingDate,
              :billNumber,
              :itemDetails
              )`,
              {
                bookingId: resolvedResult.bookingId,
                packageId: resolvedResult.packageId,
                packageGuestCount: resolvedResult.packageGuestCount,
                totalGuestCount: resolvedResult.totalGuestCount,
                billingDate: resolvedResult.billingDate,
                // billNumber:
                //   getPrevBillDBResult?.BillNumber === undefined
                //     ? 1
                //     : getPrevBillDBResult?.BillNumber + 1,
                billNumber: 1,
                itemDetails: JSON.stringify({}),
              }
            );

            //  result.push({...rows[0][0][0]})
            return rows[0][0][0] ? rows[0][0][0] : null;
          } else {
            let rows = await dbconfig.knex.raw(
              `CALL usp_add_billing_details(
              :bookingId,
              :packageId,
              :packageGuestCount,
              :totalGuestCount,
              :billingDate,
              :billNumber,
              :itemDetails
              )`,
              {
                bookingId: resolvedResult.bookingId,
                packageId: resolvedResult.packageId,
                packageGuestCount: resolvedResult.packageGuestCount,
                totalGuestCount: resolvedResult.totalGuestCount,
                billingDate: resolvedResult.billingDate,
                billNumber:
                  getPrevBillDBResult?.BillNumber === undefined
                    ? 1
                    : getPrevBillDBResult?.BillNumber + 1,
                itemDetails: JSON.stringify({}),
              }
            );

            //  result.push({...rows[0][0][0]})
            return rows[0][0][0] ? rows[0][0][0] : null;
          }
        } else {
          let rows = await dbconfig.knex.raw(
            `CALL usp_add_billing_details(
            :bookingId,
            :packageId,
            :packageGuestCount,
            :totalGuestCount,
            :billingDate,
            :billNumber,
            :itemDetails
            )`,
            {
              bookingId: resolvedResult.bookingId,
              packageId: resolvedResult.packageId,
              packageGuestCount: resolvedResult.packageGuestCount,
              totalGuestCount: resolvedResult.totalGuestCount,
              billingDate: resolvedResult.billingDate,
              billNumber:
                getPrevBillDBResult?.BillNumber === undefined
                  ? 1
                  : getPrevBillDBResult?.BillNumber + 1,
              itemDetails: JSON.stringify({}),
            }
          );

          //  result.push({...rows[0][0][0]})
          return rows[0][0][0] ? rows[0][0][0] : null;
        }
      } else {
        if (getPrevBillDBResult != null) {
          // Get the current date
          // const currentDate = momentTimezone().tz("Asia/Kolkata").format("YYYY-MM-DD");
          const currentDate = momentTimezone().tz("Asia/Kolkata");
          const prevDate = momentTimezone(getPrevBillDBResult.BillDate).format(
            "YYYY-MM-DD"
          );
		console.log("lakra cyrrent ",currentDate);
		console.log("lakra prev" , prevDate);
          if (
            currentDate.month() === 3 &&
            currentDate.date() === 1 &&
            momentTimezone(prevDate).month() === 2 &&
            momentTimezone(prevDate).date() == 31
          ) {
            // for (let index = 0; index < ItemDetails.length; index++) {
            //   const element = ItemDetails[index];
            let rows = await dbconfig.knex.raw(
              `CALL usp_add_billing_details(
            :bookingId,
            :packageId,
            :packageGuestCount,
            :totalGuestCount,
            :billingDate,
            :billNumber,
            :itemDetails
            )`,
              {
                bookingId: resolvedResult.bookingId,
                packageId: resolvedResult.packageId,
                packageGuestCount: resolvedResult.packageGuestCount,
                totalGuestCount: resolvedResult.totalGuestCount,
                billingDate: resolvedResult.billingDate,
                // billNumber:
                //   getPrevBillDBResult?.BillNumber === undefined
                //     ? 1
                //     : getPrevBillDBResult?.BillNumber + 1,
                billNumber: 1,
                itemDetails: JSON.stringify(ItemDetails),
              }
            );

            //  result.push({...rows[0][0][0]})

            // }
            return rows[0][0][0] ? rows[0][0][0] : null;
          } else {
            // for (let index = 0; index < ItemDetails.length; index++) {
            //   const element = ItemDetails[index];
            let rows = await dbconfig.knex.raw(
              `CALL usp_add_billing_details(
            :bookingId,
            :packageId,
            :packageGuestCount,
            :totalGuestCount,
            :billingDate,
            :billNumber,
            :itemDetails
            )`,
              {
                bookingId: resolvedResult.bookingId,
                packageId: resolvedResult.packageId,
                packageGuestCount: resolvedResult.packageGuestCount,
                totalGuestCount: resolvedResult.totalGuestCount,
                billingDate: resolvedResult.billingDate,
                billNumber:
                  getPrevBillDBResult?.BillNumber === undefined
                    ? 1
                    : getPrevBillDBResult?.BillNumber + 1,
                itemDetails: JSON.stringify(ItemDetails),
              }
            );

            //  result.push({...rows[0][0][0]})

            // }
            return rows[0][0][0] ? rows[0][0][0] : null;
          }
        } else {
          // for (let index = 0; index < ItemDetails.length; index++) {
          //   const element = ItemDetails[index];
          let rows = await dbconfig.knex.raw(
            `CALL usp_add_billing_details(
          :bookingId,
          :packageId,
          :packageGuestCount,
          :totalGuestCount,
          :billingDate,
          :billNumber,
          :itemDetails
          )`,
            {
              bookingId: resolvedResult.bookingId,
              packageId: resolvedResult.packageId,
              packageGuestCount: resolvedResult.packageGuestCount,
              totalGuestCount: resolvedResult.totalGuestCount,
              billingDate: resolvedResult.billingDate,
              billNumber:
                getPrevBillDBResult?.BillNumber === undefined
                  ? 1
                  : getPrevBillDBResult?.BillNumber + 1,
              itemDetails: JSON.stringify(ItemDetails),
            }
          );

          //  result.push({...rows[0][0][0]})

          // }
          return rows[0][0][0] ? rows[0][0][0] : null;
        }
      }

      // return result;
    } catch (err) {
      logger.logInfo(`addBillingDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  getBillingDetails: async (functionContext) => {
    let logger = functionContext.logger;

    logger.logInfo("getBillingDetails() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_billing_details()`);

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getBillingDetails() :: Error :: ${JSON.stringify(err)}`);

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
  getBilliDetailsByBillId: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBilliDetailsByBillId() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_by_BillId(
        :billId
        )`,
        {
          billId: resolvedResult.billId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `getBilliDetailsById() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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

	// edited code start
//  getBillingDetailsByMOP: async (functionContext, resolvedResult) => {  
   // let logger = functionContext.logger;

   // logger.logInfo("getBillingDetailsByMOP() :: DB :: Invoked !");
   // logger.logInfo(`Method of Payment Received: ${resolvedResult.methodOfPayment}`);

   // try {
        // Ensure the methodOfPayment matches one of the valid database values
      //  const validPaymentModes = ["UPI", "CC", "CASH", "DC", "NB"];
      //  let PaymentMode = resolvedResult.methodOfPayment;

        // Convert any unsupported values (e.g., null) to a valid format
      //  if (!validPaymentModes.includes(PaymentMode)) {
         //   PaymentMode = null;
       // }

      //  let rows = await dbconfig.knex.raw(
          //  `CALL usp_get_billing_details_by_MOP(:PaymentMode)`, // Updated to match DB column
          //  {
           //     PaymentMode: PaymentMode, // Ensuring it matches `PaymentMode` column
         //   }
       // );

      //  logger.logInfo(`getBillingDetailsByMOP() :: DB Response :: ${JSON.stringify(rows)}`);

    //    return rows[0] ? rows[0] : [];
  //  } catch (err) {
      //  logger.logInfo(
         //   `getBillingDetailsByMOP() :: Error :: ${JSON.stringify(err)}`
       // );

       // let errorCode = constant.errorCode.dbError;
       // let errorMessage = constant.errorMessage.dbError;
      //  if (err.sqlState && err.sqlState == constant.errorCode.noBillingRecords) {
          //  errorCode = constant.errorCode.noBillingRecords;
         //   errorMessage = constant.errorMessage.noBillingRecords;
       // }

      //  functionContext.error = new errorModel.ErrorModel(
          //  errorMessage,
        //    errorCode
      //  );

    //    throw functionContext.error;
  //  }
//},
// edited code ends






  getBilliDetailsByBillDate: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBilliDetailsByBillDate() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_by_date(
        :billingDate
        )`,
        {
          billingDate: resolvedResult.billingDate,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `getBilliDetailsByBillDate() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBillForDate) {
        errorCode = constant.errorCode.noBillForDate;
        errorMessage = constant.errorMessage.noBillForDate;
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
  getBilliDetailsByShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBilliDetailsByShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_by_shift(
        :billingDate,
        :shiftId
        )`,
        {
          billingDate: resolvedResult.billingDate,
          shiftId: resolvedResult.shiftId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `getBilliDetailsByShift() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (
        err.sqlState &&
        err.sqlState == constant.errorCode.noBookingForShift
      ) {
        errorCode = constant.errorCode.noBookingForShift;
        errorMessage = constant.errorMessage.noBookingForShift;
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
  getBilliDetailsByUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBilliDetailsByUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_by_user(
        :userId
        )`,
        {
          userId: resolvedResult.userId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `getBilliDetailsByUser() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBookingForUser) {
        errorCode = constant.errorCode.noBookingForUser;
        errorMessage = constant.errorMessage.noBookingForUser;
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
  getBilliDetailsByAllFilters: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBilliDetailsByAllFilters() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_by_all_filters(
        :billingDate,
        :shiftId,
        :userId,
        :billId
        )`,
        {
          billingDate: resolvedResult.billingDate,
          shiftId: resolvedResult.shiftId,
          userId: resolvedResult.userId,
          billId: resolvedResult.billId,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `getBilliDetailsByAllFilters() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
  getBilliDetailsBookingWebsite: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getBilliDetailsByAllFilters() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_from_booking_website(
          :futureDate
        )`,
        {
          futureDate: resolvedResult.futureDate,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `getBilliDetailsByAllFilters() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
  uploadBillFile: async (functionContext, resolvedResult, fileURL) => {
    let logger = functionContext.logger;

    logger.logInfo("uploadBillFile() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_upload_bill(
        :bookingId,
        :billFile
        )`,
        {
          bookingId: resolvedResult.bookingId,
          // billFile:resolvedResult.fileUploadDetails,
          billFile: fileURL,
        }
      );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`uploadBillFile() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
  updateBillingDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateBillingDetails() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_bill(
        :bookingId
      )`,
        {
          bookingId: resolvedResult.bookingId,
        }
      );

      // logger.logInfo(
      //   `updateBillingDetails() :: DB :: Returned Result :: ${JSON.stringify(
      //     rows[0][0]
      //   )}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `updateBillingDetails() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  voidBill: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("voidBill() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_void_bill(
        :bookingId,
        :voidBillReason
      )`,
        {
          bookingId: resolvedResult.bookingId,
          voidBillReason: resolvedResult.voidBillReason,
        }
      );

      // logger.logInfo(
      //   `voidBill() :: DB :: Returned Result :: ${JSON.stringify(
      //     rows[0][0]
      //   )}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`voidBill() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBooking) {
        errorCode = constant.errorCode.noBooking;
        errorMessage = constant.errorMessage.noBooking;
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
  updateBillIdForVoid: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateBillIdForVoid() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_billId_for_void(
        :voidBillId,
        :bookingId,
        :newBillId
      )`,
        {
          voidBillId: resolvedResult.voidBillId,
          bookingId: resolvedResult.bookingId,
          newBillId: resolvedResult.newBillId,
        }
      );

      // logger.logInfo(
      //   `updateBillIdForVoid() :: DB :: Returned Result :: ${JSON.stringify(
      //     rows[0][0]
      //   )}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(
        `updateBillIdForVoid() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
  updateItemDetailsBill: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateItemDetailsBill() :: DB :: Invoked !");
    // try {
    //   console.log('resolvedResult>>',resolvedResult);
    //   console.log('resolvedResult.billId>>',resolvedResult.billId);
    //   console.log('resolvedResult.itemDetails>>',resolvedResult.itemDetails);
    //   const stringWithoutBracketsBillId = resolvedResult.billId.slice(1, -1);
    //   // const stringWithoutBrackets = resolvedResult.itemDetails.slice(1, -1);
    //   const arrayFromStringBillId = stringWithoutBracketsBillId.split(",");
    //   // const arrayFromString = stringWithoutBrackets.split(",");
    //   const result = [];
    //   console.log('arrayFromStringBillId>>',arrayFromStringBillId);
    //   console.log('arrayFromString>>',arrayFromString);
    //   for (let index = 0; index < arrayFromString.length; index++) {
    //     const element = arrayFromString[index];
    //     let rows = await dbconfig.knex.raw(
    //       `CALL usp_get_package_item_details(
    //       :billId,
    //       :itemDetails
    //   )`,
    //       {
    //         billId:element,
    //         itemDetails:element,
    //       }
    //     );

    //     // console.log('rows[0][0][0]',rows[0][0][0]);
    //     // console.log('rows[0][0][1]',rows[0][0][1]);
    //     result.push({ ...rows[0][0] });
    //     logger.logInfo(
    //       `addPackageItems() :: DB :: Returned Result :: ${JSON.stringify(
    //         rows[0][0]
    //       )}`
    //     );
    //   }
    // }
    try {
      // console.log('resolvedResult>>', resolvedResult);
      // console.log('resolvedResult.billId>>', resolvedResult.billId);
      // Replace single quotes with double quotes
      const jsonString = resolvedResult.updatedItemDetails.replace(/'/g, '"');

      // Parse the JSON string
      const jsonArray = JSON.parse(jsonString);

      const stringWithoutBracketsBillId = resolvedResult.billId.slice(1, -1);
      const arrayFromStringBillId = stringWithoutBracketsBillId.split(",");

      const result = [];

      for (let index = 0; index < arrayFromStringBillId.length; index++) {
        const billIdElement = arrayFromStringBillId[index];
        const itemDetailsElement = jsonArray[index];

        let rows = await dbconfig.knex.raw(
          `CALL usp_update_item_details_bill(
            :billId,
            :updatedItemDetails
          )`,
          {
            billId: billIdElement,
            updatedItemDetails: JSON.stringify(itemDetailsElement),
          }
        );

        result.push({ ...rows[0][0][0] });
        // logger.logInfo(
        //   `addPackageItems() :: DB :: Returned Result :: ${JSON.stringify(
        //     rows[0][0]
        //   )}`
        // );
      }
      return result;
    } catch (err) {
      logger.logInfo(
        `updateItemDetailsBill() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.noBill) {
        errorCode = constant.errorCode.noBill;
        errorMessage = constant.errorMessage.noBill;
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
  noShowGuestList: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("noShowGuestList() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_no_show_list(
        :eventDate
      )`,
        {
          eventDate: resolvedResult.eventDate,
        }
      );

      // logger.logInfo(
      //   `noShowGuestList() :: DB :: Returned Result :: ${JSON.stringify(
      //     rows[0][0]
      //   )}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`noShowGuestList() :: Error :: ${JSON.stringify(err)}`);

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
  fetchVoidBill: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchVoidBill() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_fetch_void_bill(
        
      )`);

      // logger.logInfo(
      //   `fetchVoidBill() :: DB :: Returned Result :: ${JSON.stringify(
      //     rows[0][0]
      //   )}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`fetchVoidBill() :: Error :: ${JSON.stringify(err)}`);

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
  billingListReportByShift: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("billingListReportByShift() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_billing_details_by_date_ranges(
        :fromDate,
        :toDate
        )`,
        {
          fromDate: resolvedResult.fromDate,
          toDate: resolvedResult.toDate,
        }
      );

      // logger.logInfo(
      //   `billingListReportByShift() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(
        `billingListReportByShift() :: Error :: ${JSON.stringify(err)}`
      );

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (
        err.sqlState &&
        err.sqlState == constant.errorCode.noBillForDateRange
      ) {
        errorCode = constant.errorCode.noBillForDateRange;
        errorMessage = constant.errorMessage.noBillForDateRange;
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

module.exports = billingService;
