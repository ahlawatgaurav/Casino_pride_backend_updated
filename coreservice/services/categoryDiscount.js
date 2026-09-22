const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const categoryDiscountService = {

  getAllCategories: async (functionContext) => {
    try {
      const rows = await dbconfig.knex.raw(
        `CALL usp_get_category_master()`
      );
      return rows[0][0];
    } catch (err) {
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },

  addCategory: async (functionContext, resolvedResult) => {
    try {
      const rows = await dbconfig.knex.raw(
        `CALL usp_add_category(
          :categoryName,
          :discountPercentage,
          :commissionPercentage,
          :description
        )`,
        {
          categoryName: resolvedResult.categoryName,
          discountPercentage: resolvedResult.discountPercentage,
          commissionPercentage: resolvedResult.commissionPercentage,
          description: resolvedResult.description
        }
      );

      return rows[0][0][0] || null;
    } catch (err) {
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },

  updateCategoryDiscount: async (functionContext, resolvedResult) => {
    try {
      console.log("DEBUG: updateCategoryDiscount Params ::", JSON.stringify(resolvedResult));
      const rows = await dbconfig.knex.raw(
        `CALL usp_update_category_discount(?, ?, ?, ?, ?, ?)`,
        [
          resolvedResult.categoryId,
          resolvedResult.categoryName,
          resolvedResult.discountPercentage,
          resolvedResult.commissionPercentage,
          resolvedResult.description,
          resolvedResult.isActive
        ]
      );

      return rows[0] || null;
    } catch (err) {
      console.error("CRITICAL: updateCategoryDiscount Service Error ::", err);
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },

};

module.exports = categoryDiscountService;
