const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const userService = {

  addUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("addUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_add_users(
        :firebaseUUID,
        :name,
        :address,
        :email,
        :phone,
        :userName,
        :password,
        :userType,
        :categoryId,
        :monthlySettlement,
        :QRLink,
        :NumOfBookings,
        :isUserEnabled,
        :isActive,
        :currentTs
        )`,
        {
          firebaseUUID: resolvedResult.firebaseUUID,
          name: resolvedResult.name,
          address: resolvedResult.address,
          email: resolvedResult.email,
          phone: resolvedResult.phone,
          userName: resolvedResult.userName,
          password: resolvedResult.password,
          userType: resolvedResult.userType,
          categoryId: resolvedResult.categoryId,
          monthlySettlement: resolvedResult.monthlySettlement,
          QRLink: resolvedResult.QRLink,
          NumOfBookings: resolvedResult.NumOfBookings,
          isUserEnabled: resolvedResult.isUserEnabled,
          isActive: resolvedResult.isActive,
          currentTs: functionContext.currentTs,
        }
      );

      // logger.logInfo(
      //   `addUser() :: DB :: Returned Result :: ${JSON.stringify(rows[0][0])}`
      // );

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.phoneExists) {
        errorCode = constant.errorCode.phoneExists;
        errorMessage = constant.errorMessage.phoneExists;
      } else if (err.sqlState && err.sqlState == constant.errorCode.emailExists) {
        errorCode = constant.errorCode.emailExists;
        errorMessage = constant.errorMessage.emailExists;
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
  updateUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("updateUser() :: DB :: Invoked !");

    try {
      const updateData = {
        Ref: resolvedResult.userRef,
        UUID: resolvedResult.firebaseUUID,
        Name: resolvedResult.name,
        Address: resolvedResult.address,
        Email: resolvedResult.email,
        Phone: resolvedResult.phone,
        Username: resolvedResult.userName,
        Password: resolvedResult.password,
        UserType: resolvedResult.userType,
        CategoryId: resolvedResult.categoryId,
        MonthlySettlement: resolvedResult.monthlySettlement,
        QRLink: resolvedResult.QRLink,
        NumOfBookings: resolvedResult.NumOfBookings,
        IsUserEnabled: resolvedResult.isUserEnabled,
        IsActive: resolvedResult.isActive,
        UpdatedOn: functionContext.currentTs,
      };

      if (resolvedResult.discountPercent !== undefined && resolvedResult.discountPercent !== null) {
        updateData.DiscountPercent = resolvedResult.discountPercent;
      }

      await dbconfig.knex("users").where({ Id: resolvedResult.userId }).update(updateData);

      const updated = await dbconfig.knex("users").where({ Id: resolvedResult.userId }).first();
      return updated || null;
    } catch (err) {
      logger.logInfo(`updateUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
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
  deleteUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("deleteUser() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_delete_user(
        :userId
        )`,
        {
          userId: resolvedResult.userId,
        }
      );



      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`deleteUser() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.invalidUserId) {
        errorCode = constant.errorCode.invalidUserId;
        errorMessage = constant.errorMessage.invalidUserId;
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
  getUser: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getUser() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_fetch_users(:userType)`, {
        userType: resolvedResult.userType,
      });

      let users = rows[0][0] ? rows[0][0] : null;

      if (resolvedResult.userType == 11 && users) {
        try {
          // Fetch categories to join CategoryName
          const catRows = await dbconfig.knex.raw(`CALL usp_get_category_master()`);
          const categories = catRows[0][0];

          if (categories) {
            users = users.map((user) => {
              const category = categories.find((c) => c.Id === user.CategoryId);
              return {
                ...user,
                CategoryName: category ? category.Name : "-",
                CategoryDiscount: category ? category.DiscountPercent : 0,
                CategoryCommission: category ? category.CommissionPercent : 0,
              };
            });
          }
        } catch (catErr) {
          logger.logInfo(`getUser() :: Category Join Error :: ${JSON.stringify(catErr)}`);
          // Continue without category details if it fails
        }
      }

      return users;
    } catch (err) {
      logger.logInfo(`getUser() :: DB :: Error :: ${JSON.stringify(err)}`);
      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      if (err.sqlState && err.sqlState == constant.errorCode.invalidUserType) {
        errorCode = constant.errorCode.invalidUserType;
        errorMessage = constant.errorMessage.invalidUserType;
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
  getUserById: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getUserById() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_user_by_Id(:userId)`, {
        userId: resolvedResult.userId,
      });

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`getUserById() :: DB :: Error :: ${JSON.stringify(err)}`);
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
  getAgentByUUID: async (functionContext, uuid) => {
    try {
      const agent = await dbconfig.knex("users")
        .select("Id", "Name", "Phone", "Email", "UUID", "UserType", "CategoryId", "QRLink", "IsUserEnabled")
        .where({ UUID: uuid, IsActive: 1 })
        .first();
      return agent || null;
    } catch (err) {
      const errorModel = require("../models/error");
      const constant = require("../utils/constants");
      functionContext.error = new errorModel.ErrorModel(constant.errorMessage.dbError, constant.errorCode.dbError);
      throw functionContext.error;
    }
  },
  usersByCategory: async (functionContext, resolvedResult) => {
    const logger = functionContext.logger;
    logger.logInfo("usersByCategory() :: DB :: Invoked !");

    try {
      const categoryId = Number(resolvedResult.categoryId);
      const includeInactive = Number(resolvedResult.includeInactive || 0);
      const q = resolvedResult.q ? String(resolvedResult.q).trim() : "";
      const page = Number(resolvedResult.page || 1);
      const pageSize = Number(resolvedResult.pageSize || 50);

      const baseQuery = dbconfig.knex("users as u")
        .leftJoin("CategoryMaster as cm", "cm.idCategoryMaster", "u.CategoryId")
        .where("u.CategoryId", categoryId);

      if (!includeInactive) {
        baseQuery.andWhere("u.IsActive", 1);
      }

      if (q) {
        baseQuery.andWhere((qb) => {
          qb.where("u.Name", "like", `%${q}%`)
            .orWhere("u.Phone", "like", `%${q}%`)
            .orWhere("u.Email", "like", `%${q}%`);
        });
      }

      const countRow = await baseQuery
        .clone()
        .clearSelect()
        .clearOrder()
        .count({ total: "*" })
        .first();
      const total = countRow ? Number(countRow.total || 0) : 0;

      const users = await baseQuery
        .clone()
        .select(
          "u.Id",
          "u.Name",
          "u.Phone",
          "u.Email",
          "u.IsUserEnabled",
          "u.UserType",
          "u.CategoryId",
          "u.IsActive",
          "cm.Category as CategoryName"
        )
        .orderByRaw("CASE WHEN u.Name IS NULL OR u.Name = '' THEN 1 ELSE 0 END, u.Name ASC, u.Id ASC")
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const category = users && users.length
        ? { CategoryId: categoryId, CategoryName: users[0].CategoryName || "-" }
        : (() => null)();

      // If there are no users, still fetch category name for UI header
      let categoryInfo = category;
      if (!categoryInfo) {
        const cm = await dbconfig.knex("CategoryMaster")
          .select("idCategoryMaster as CategoryId", "Category as CategoryName")
          .where("idCategoryMaster", categoryId)
          .first();
        categoryInfo = cm || { CategoryId: categoryId, CategoryName: "-" };
      }

      return {
        category: categoryInfo,
        users: users || [],
        total,
        page,
        pageSize,
      };
    } catch (err) {
      logger.logInfo(`usersByCategory() :: DB :: Error :: ${JSON.stringify(err)}`);

      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },
  getUserByPhone: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getUserByPhone() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_user_by_phone(:phone)`, {
        phone: resolvedResult.phone,
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
  addQRLink: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("addQRLink() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_add_QR_link(
        :userId,
        :qrLink
        )`, {
        userId: resolvedResult.userId,
        qrLink: resolvedResult.qrLink,
      });

      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`addQRLink() :: DB :: Error :: ${JSON.stringify(err)}`);
      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;
      // if (err.sqlState && err.sqlState == constant.errorCode.invalidUserType) {
      //   errorCode = constant.errorCode.invalidUserType;
      //   errorMessage = constant.errorMessage.invalidUserType;
      // } else {
      errorCode = constant.errorCode.dbError;
      errorMessage = constant.errorMessage.dbError;
      // }
      functionContext.error = new errorModel.ErrorModel(
        errorMessage,
        errorCode
      );
      throw functionContext.error;
    }
  },
  countDriverBookings: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;

    logger.logInfo("countDriverBookings() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_count_driver_bookings(
        :userId,
        :userType,
        :localAgentName
        )`,
        {
          userId: resolvedResult.userId,
          userType: resolvedResult.userType,
          localAgentName: resolvedResult.localAgentName,
        }
      );


      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`countDriverBookings() :: Error :: ${JSON.stringify(err)}`);

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
  uploadQRFile: async (functionContext, resolvedResult, fileURL) => {
    let logger = functionContext.logger;

    logger.logInfo("uploadQRFile() :: DB :: Invoked !");

    try {
      let rows = await dbconfig.knex.raw(
        `CALL usp_upload_QR_file_user(
        :userId,
        :qrFile
        )`,
        {
          userId: resolvedResult.userId,
          // ackFile:resolvedResult.fileUploadDetails,
          qrFile: fileURL,
        }
      );



      return rows[0][0][0] ? rows[0][0][0] : null;
    } catch (err) {
      logger.logInfo(`uploadQRFile() :: Error :: ${JSON.stringify(err)}`);

      let errorCode = constant.errorCode.dbError;
      let errorMessage = constant.errorMessage.dbError;

      if (err.sqlState && err.sqlState == constant.errorCode.noUser) {
        errorCode = constant.errorCode.noUser;
        errorMessage = constant.errorMessage.noUser;
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
  getAllCategories: async (functionContext) => {
    let logger = functionContext.logger;
    logger.logInfo("getAllCategories() :: DB :: Invoked !");
    try {
      let rows = await dbconfig.knex.raw(`CALL usp_get_category_master()`);
      return rows[0][0] ? rows[0][0] : [];
    } catch (err) {
      logger.logInfo(`getAllCategories() :: DB :: Error :: ${JSON.stringify(err)}`);
      // Return empty array on error to allow flow to continue without categories
      return [];
    }
  },
};

module.exports = userService;
