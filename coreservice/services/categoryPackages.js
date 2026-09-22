const dbconfig = require("../config/database");
const errorModel = require("../models/error");
const constant = require("../utils/constant");

const ensureVisibilityColumns = async () => {
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

const categoryPackagesService = {
  /**
   * Returns all globally enabled packages with category-specific enablement applied.
   * Whitelist behavior: hide packages unless explicitly enabled for this category (COALESCE to 0).
   */
  getCategoryPackages: async (functionContext, resolvedResult) => {
    const logger = functionContext.logger;
    logger.logInfo("getCategoryPackages() :: DB :: Invoked !");

    try {
      const categoryId = Number(resolvedResult.categoryId);
      await ensureVisibilityColumns();

      const rows = await dbconfig.knex("packages as p")
        .leftJoin("CategoryPackages as cp", function () {
          this.on("cp.PackageId", "p.Id").andOn(
            "cp.CategoryId",
            dbconfig.knex.raw("?", [categoryId])
          );
        })
        .where({ "p.IsActive": 1 })
        .select(
          "p.Id",
          "p.PackageName",
          "p.IsPackageEnabled",
          "p.IsActive",
          dbconfig.knex.raw("COALESCE(cp.IsEnabled, 0) as CategoryIsEnabled"),
          dbconfig.knex.raw("COALESCE(cp.ShowInAgentPanel, cp.IsEnabled, 0) as ShowInAgentPanel"),
          dbconfig.knex.raw("COALESCE(cp.ShowInWebsite, 0) as ShowInWebsite")
        )
        .orderBy("p.PackageName", "asc");

      return rows || [];
    } catch (err) {
      logger.logInfo(`getCategoryPackages() :: Error :: ${JSON.stringify(err)}`);
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },

  /**
   * Stores category-package mapping using "whitelist" strategy.
   * ShowInAgentPanel and ShowInWebsite independently control package surfaces.
   */
  updateCategoryPackages: async (functionContext, resolvedResult) => {
    const logger = functionContext.logger;
    logger.logInfo("updateCategoryPackages() :: DB :: Invoked !");

    const categoryId = Number(resolvedResult.categoryId);
    const packages = Array.isArray(resolvedResult.packages)
      ? resolvedResult.packages
      : [];

    const enabled = packages
      .map((p) => ({
        packageId: Number(p.packageId),
        showInAgentPanel: Number(p.showInAgentPanel ?? p.isEnabled ?? 0),
        showInWebsite: Number(p.showInWebsite ?? 0),
      }))
      .filter((p) => p.packageId > 0);

    try {
      await ensureVisibilityColumns();
      await dbconfig.knex.transaction(async (trx) => {
        // Remove all rows for this category, then re-insert only packages visible anywhere.
        await trx("CategoryPackages").where({ CategoryId: categoryId }).del();

        const visible = enabled.filter(
          (d) => d.showInAgentPanel === 1 || d.showInWebsite === 1
        );

        if (visible.length) {
          await trx("CategoryPackages").insert(
            visible.map((d) => ({
              CategoryId: categoryId,
              PackageId: d.packageId,
              IsEnabled: d.showInAgentPanel === 1 ? 1 : 0,
              ShowInAgentPanel: d.showInAgentPanel === 1 ? 1 : 0,
              ShowInWebsite: d.showInWebsite === 1 ? 1 : 0,
            }))
          );
        }
      });

      return {
        CategoryId: categoryId,
        AgentPanelCount: enabled.filter((p) => p.showInAgentPanel === 1).length,
        WebsiteCount: enabled.filter((p) => p.showInWebsite === 1).length,
      };
    } catch (err) {
      logger.logInfo(
        `updateCategoryPackages() :: Error :: ${JSON.stringify(err)}`
      );
      functionContext.error = new errorModel.ErrorModel(
        constant.errorMessage.dbError,
        constant.errorCode.dbError
      );
      throw functionContext.error;
    }
  },
};

module.exports = categoryPackagesService;
