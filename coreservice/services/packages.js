const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const packageService = {
    fetchPackages: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("fetchCoupons() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_fetch_package_details()`
      );

      // logger.logInfo(
      //   `fetchPackages() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      // return rows[0][0] ? rows[0][0] : null;
      let packageDetails = rows[0][0] ? rows[0][0] : null;

      // Attach assigned CategoryIds to each package (for edit prefill).
      if (packageDetails && packageDetails.length) {
        const mappingRows = await dbconfig.knex("CategoryPackages")
          .where({ IsEnabled: 1 })
          .select("PackageId", "CategoryId");
        const byPackage = {};
        mappingRows.forEach((m) => {
          (byPackage[m.PackageId] = byPackage[m.PackageId] || []).push(
            m.CategoryId
          );
        });
        packageDetails = packageDetails.map((p) => ({
          ...p,
          CategoryIds: byPackage[p.Id] || [],
        }));
      }

      return {
        packageDetails: packageDetails,
        packageItemDetails: rows[0][1] ? rows[0][1] : null,
      };
    } catch (err) {
      logger.logInfo(`fetchPackages() :: Error :: ${JSON.stringify(err)}`);

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
  addPackageDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addPackageDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_package_details(
        :packageName,
        :packageDescription,
        :packageWeekdayPrice,
        :packageWeekendPrice,
        :packageTeensPrice,
        :packageTeensRate,
        :packageTeensTax,
        :packageTeensTaxName,
        :numOfItems,
        :isPackageEnabled,
        :packageStartDate
        )`,
        {
            packageName:resolvedResult.packageName,
            packageDescription:resolvedResult.packageDescription,
            packageWeekdayPrice:resolvedResult.packageWeekdayPrice,
            seriesStart:resolvedResult.seriesStart,
            packageWeekendPrice:resolvedResult.packageWeekendPrice,
            packageWeekendPrice:resolvedResult.packageWeekendPrice,
            packageTeensPrice:resolvedResult.packageTeensPrice,
            packageTeensRate:resolvedResult.packageTeensRate,
            packageTeensTax:resolvedResult.packageTeensTax,
            packageTeensTaxName:resolvedResult.packageTeensTaxName,
            numOfItems:resolvedResult.numOfItems,
            isPackageEnabled:resolvedResult.isPackageEnabled,
            packageStartDate: resolvedResult.startDate,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addPackageDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.packageExists) {
        errorCode = constant.errorCode.packageExists;
        errorMessage = constant.errorMessage.packageExists;
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
  addPackageItems: async (functionContext, resolvedResult,packageDetails) => {
    let logger = functionContext.logger;

    logger.logInfo("addPackageItems() :: DB :: Invoked !");

    try {
      for (let index = 0; index < resolvedResult.packageItems.length; index++) {
        const element = resolvedResult.packageItems[index];
        let rows = await dbconfig.knex.raw(
          `CALL usp_add_items_details(
          :itemName,
          :itemWeekdayPrice,
          :itemWeekendPrice,
          :itemTax,
          :itemTaxName,
          :itemWeekdayRate,
          :itemWeekendRate,
          :taxDiffWeekday,
          :taxDiffWeekend,
          :isDeductable,
          :packageId
          )`,
          {
              itemName:element.itemName,
              itemWeekdayPrice:element.itemWeekdayPrice,
              itemWeekendPrice:element.itemWeekendPrice,
              itemTax:element.itemTax,
              itemTaxName:element.itemTaxName,
              itemWeekdayRate:element.itemWeekdayRate,
              itemWeekendRate:element.itemWeekendRate,
              taxDiffWeekday:element.taxDiffWeekday,
              taxDiffWeekend:element.taxDiffWeekend,
              isDeductable:element.isDeductable,
              packageId:packageDetails.Id
          }
        );
  

      }

     

      // return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addPackageItems() :: Error :: ${JSON.stringify(err)}`);

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
  getPackageById: async (functionContext, resolvedResult,packageDetails) => {
    let logger = functionContext.logger;

    logger.logInfo("getPackageById() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_package_by_Id(:packageId)`,{
          packageId:packageDetails.Id,
      }
      );



      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`getPackageById() :: Error :: ${JSON.stringify(err)}`);

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
  updatePackageDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updatePackageDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL update_package_details(
        :packageId,
        :packageRef,
        :packageName,
        :packageDescription,
        :packageWeekdayPrice,
        :packageWeekendPrice,
        :packageTeensPrice,
        :packageTeensRate,
        :packageTeensTax,
        :packageTeensTaxName,
        :numOfItems,
        :isPackageEnabled
        )`,
        {
            packageId:resolvedResult.packageId,
            packageRef:resolvedResult.packageRef,
            packageName:resolvedResult.packageName,
            packageDescription:resolvedResult.packageDescription,
            packageWeekdayPrice:resolvedResult.packageWeekdayPrice,
            // seriesStart:resolvedResult.seriesStart,
            packageWeekendPrice:resolvedResult.packageWeekendPrice,
            packageTeensPrice:resolvedResult.packageTeensPrice,
            packageTeensRate:resolvedResult.packageTeensRate,
            packageTeensTax:resolvedResult.packageTeensTax,
            packageTeensTaxName:resolvedResult.packageTeensTaxName,
            numOfItems:resolvedResult.numOfItems,
            isPackageEnabled:resolvedResult.isPackageEnabled,

        }
      );



      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updatePackageDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noPackageExists) {
        errorCode = constant.errorCode.noPackageExists;
        errorMessage = constant.errorMessage.noPackageExists;
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
  updatePackageItems: async (functionContext, resolvedResult,packageDetails) => {
    let logger = functionContext.logger;

    logger.logInfo("updatePackageItems() :: DB :: Invoked !");

    try {
      for (let index = 0; index < resolvedResult.packageItems.length; index++) {
        const element = resolvedResult.packageItems[index];
        let rows = await dbconfig.knex.raw(
          `CALL update_item_details(
          :itemId,
          :itemRef,
          :itemName,
          :itemWeekdayPrice,
          :itemWeekendPrice,
          :itemTax,
          :itemTaxName,
          :itemWeekdayRate,
          :itemWeekendRate,
          :taxDiffWeekday,
          :taxDiffWeekend,
          :isDeductable,
          :packageId
          )`,
          {
              itemId:element.itemId,
              itemRef:element.itemRef,
              itemName:element.itemName,
              itemWeekdayPrice:element.itemWeekdayPrice,
              itemWeekendPrice:element.itemWeekendPrice,
              itemTax:element.itemTax,
              itemTaxName:element.itemTaxName,
              itemWeekdayRate:element.itemWeekdayRate,
              itemWeekendRate:element.itemWeekendRate,
              taxDiffWeekday:element.taxDiffWeekday,
              taxDiffWeekend:element.taxDiffWeekend,
              isDeductable:element.isDeductable,
              packageId:packageDetails.Id,
              // isActive:element.isActive,
          }
        );
  

      }

     

      // return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updatePackageItems() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noPackageItemExists) {
        errorCode = constant.errorCode.noPackageItemExists;
        errorMessage = constant.errorMessage.noPackageItemExists;
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
  deletePackageDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deletePackageDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_delete_package(
        :packageId
        )`,
        {
            packageId:resolvedResult.packageId,
        }
      );



      return rows[0][0] ? rows[0][0] : null;
    } catch (err) {
      logger.logInfo(`deletePackageDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.invalidPackage) {
        errorCode = constant.errorCode.invalidPackage;
        errorMessage = constant.errorMessage.invalidPackage;
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
  getPackageDetails: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("getPackageDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_get_package_details(
        :packageId
        )`,
        {
            packageId:resolvedResult.packageId,
        }
      );



      // return rows[0][0] ? rows[0][0] : null;
      return {
        packageDetails: rows[0][0][0] ? rows[0][0][0] : null,
        packageItemDetails: rows[0][1] ? rows[0][1] : null,
      };
    } catch (err) {
      logger.logInfo(`getPackageDetails() :: Error :: ${JSON.stringify(err)}`);

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
  addPackageTeensDetails: async (functionContext, resolvedResult,packageDetails) => {
    let logger = functionContext.logger;

    logger.logInfo("addPackageTeensDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_teens_details(
        :packageId,
        :packageTeensPrice,
        :packageTeensRate,
        :packageTeensTax,
        :packageTeensTaxName
        )`,
        {
            packageId:packageDetails.Id,
            packageTeensPrice:resolvedResult.packageTeensPrice,
            packageTeensRate:resolvedResult.packageTeensRate,
            packageTeensTax:resolvedResult.packageTeensTax,
            packageTeensTaxName:resolvedResult.packageTeensTaxName,
        }
      );

  

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addPackageTeensDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.packageExists) {
        errorCode = constant.errorCode.packageExists;
        errorMessage = constant.errorMessage.packageExists;
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
  updatePackageTeensDetails: async (functionContext, resolvedResult,packageDetails) => {
    let logger = functionContext.logger;

    logger.logInfo("updatePackageTeensDetails() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_update_teens_details(
        :packageTeensId,
        :packageTeensRef,
        :packageId,
        :packageTeensPrice,
        :packageTeensRate,
        :packageTeensTax,
        :packageTeensTaxName
        )`,
        {
            packageTeensId:resolvedResult.packageTeensId,
            packageTeensRef:resolvedResult.packageTeensRef,
            packageId:packageDetails.Id,
            packageTeensPrice:resolvedResult.packageTeensPrice,
            packageTeensRate:resolvedResult.packageTeensRate,
            packageTeensTax:resolvedResult.packageTeensTax,
            packageTeensTaxName:resolvedResult.packageTeensTaxName,

        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`updatePackageTeensDetails() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noTeensPrice) {
        errorCode = constant.errorCode.noTeensPrice;
        errorMessage = constant.errorMessage.noTeensPrice;
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
  // ---- Package-level channel + category mapping (knex, no SP) ----
  setPackageChannels: async (functionContext, packageId, showInWebsite, showInAgentPanel) => {
    let logger = functionContext.logger;
    logger.logInfo("setPackageChannels() :: DB :: Invoked !");
    try {
      await dbconfig.knex("packages")
        .where({ Id: Number(packageId) })
        .update({
          ShowInWebsite: showInWebsite ? 1 : 0,
          ShowInAgentPanel: showInAgentPanel ? 1 : 0,
        });
    } catch (err) {
      logger.logInfo(`setPackageChannels() :: Error :: ${JSON.stringify(err)}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },
  // Replace the set of categories this package is assigned to (whitelist membership).
  setPackageCategories: async (functionContext, packageId, categoryIds) => {
    let logger = functionContext.logger;
    logger.logInfo("setPackageCategories() :: DB :: Invoked !");
    const pkgId = Number(packageId);
    const ids = Array.isArray(categoryIds)
      ? [...new Set(categoryIds.map((id) => Number(id)).filter((id) => id > 0))]
      : [];
    try {
      await dbconfig.knex.transaction(async (trx) => {
        await trx("CategoryPackages").where({ PackageId: pkgId }).del();
        if (ids.length) {
          await trx("CategoryPackages").insert(
            ids.map((cid) => ({
              CategoryId: cid,
              PackageId: pkgId,
              IsEnabled: 1,
              ShowInAgentPanel: 1,
              ShowInWebsite: 0,
            }))
          );
        }
      });
    } catch (err) {
      logger.logInfo(`setPackageCategories() :: Error :: ${JSON.stringify(err)}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },
  // Returns array of CategoryIds this package is assigned to (for edit prefill).
  getPackageCategories: async (functionContext, packageId) => {
    let logger = functionContext.logger;
    logger.logInfo("getPackageCategories() :: DB :: Invoked !");
    try {
      const rows = await dbconfig.knex("CategoryPackages")
        .where({ PackageId: Number(packageId), IsEnabled: 1 })
        .select("CategoryId");
      return rows.map((r) => r.CategoryId);
    } catch (err) {
      logger.logInfo(`getPackageCategories() :: Error :: ${JSON.stringify(err)}`);
      return [];
    }
  },
};

module.exports = packageService;
