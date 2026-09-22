const dbconfig = require("../config/database");

const AGENT_USER_TYPES = [4, 5, 6, 8, 11];

const toDateOnly = (value) => {
  if (!value) return null;
  return String(value).slice(0, 10);
};

const parseJsonList = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];

  const normalized = String(value).replace(/'/g, '"');
  try {
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    return normalized
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map((item) => item.replace(/^"|"$/g, "").trim())
      .filter(Boolean);
  }
};

const createPackageBreakdown = (rows, packageColumns) => {
  const breakdown = {};

  rows.forEach((row) => {
    if (!row.CategoryName) return;
    const source = row.CategoryName;

    if (!breakdown[source]) {
      breakdown[source] = { source };
      packageColumns.forEach((column) => {
        breakdown[source][column] = 0;
      });
    }

    const packageNames = parseJsonList(row.PackageName);
    const guestCounts = parseJsonList(row.PackageGuestCount);

    packageNames.forEach((packageName, index) => {
      const count = Number(guestCounts[index] || 0);
      if (!Number.isFinite(count)) return;
      const lowerName = String(packageName || "").toLowerCase();
      const matchedColumn = packageColumns.find(
        (col) =>
          lowerName === String(col).toLowerCase() ||
          lowerName.includes(String(col).toLowerCase()) ||
          String(col).toLowerCase().includes(lowerName)
      );
      if (matchedColumn) {
        breakdown[source][matchedColumn] = (breakdown[source][matchedColumn] || 0) + count;
      }
    });
  });

  return Object.values(breakdown).sort((a, b) =>
    String(a.source).localeCompare(String(b.source))
  );
};

const reportsService = {
  getAgentReport: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getAgentReport() :: DB :: Invoked !");

    try {
      const { startDate, endDate, categoryId, agentId } = functionContext.params;
      const fromDate = toDateOnly(startDate);
      const toDate = toDateOnly(endDate);

      let query = dbconfig.knex("bookings as b")
        .leftJoin("users as u", "b.TravelAgentId", "u.Id")
        .leftJoin("CategoryMaster as c", "u.CategoryId", "c.idCategoryMaster")
        .select(
          dbconfig.knex.raw("c.idCategoryMaster as CategoryId"),
          dbconfig.knex.raw("c.Category as CategoryName"),
          "u.Id as AgentId",
          "u.Name as AgentName",
          dbconfig.knex.raw("SUM(COALESCE(b.TotalGuestCount, 0)) as TotalHeadCount"),
          dbconfig.knex.raw("SUM(COALESCE(CAST(NULLIF(b.AmountAfterDiscount, '') AS DECIMAL(10,2)), 0)) as TotalRevenue"),
          dbconfig.knex.raw("COUNT(b.Id) as TotalBookings")
        )
        .where("b.IsActive", 1)
        .where("u.IsActive", 1)
        .whereIn("u.UserType", AGENT_USER_TYPES)
        .whereNotNull("b.TravelAgentId");

      if (fromDate) {
        query = query.where("b.BookingDate", ">=", fromDate);
      }
      if (toDate) {
        query = query.where("b.BookingDate", "<=", toDate);
      }
      if (categoryId) {
        query = query.where("u.CategoryId", categoryId);
      }
      if (agentId) {
        query = query.where("b.TravelAgentId", agentId);
      }

      query = query
        .groupBy("c.idCategoryMaster", "c.Category", "u.Id", "u.Name")
        .orderBy("c.Category")
        .orderBy("u.Name");

	      const rows = await query;

      let packageQuery = dbconfig.knex("bookings as b")
        .leftJoin("users as u", "b.TravelAgentId", "u.Id")
        .leftJoin("CategoryMaster as c", "u.CategoryId", "c.idCategoryMaster")
        .select(
          dbconfig.knex.raw("c.Category as CategoryName"),
          "b.PackageName",
          "b.PackageGuestCount"
        )
        .where("b.IsActive", 1)
        .where("u.IsActive", 1)
        .whereIn("u.UserType", AGENT_USER_TYPES)
        .whereNotNull("b.TravelAgentId");

      if (fromDate) {
        packageQuery = packageQuery.where("b.BookingDate", ">=", fromDate);
      }
      if (toDate) {
        packageQuery = packageQuery.where("b.BookingDate", "<=", toDate);
      }
      if (categoryId) {
        packageQuery = packageQuery.where("u.CategoryId", categoryId);
      }
      if (agentId) {
        packageQuery = packageQuery.where("b.TravelAgentId", agentId);
      }

      const packageRows = await packageQuery;

      const adminPackages = await dbconfig.knex("packages")
        .select("PackageName")
        .where("IsActive", 1)
        .where("IsPackageEnabled", 1)
        .orderBy("PackageName");
      const packageColumns = adminPackages.map((p) => p.PackageName);

	      const packageBreakdown = createPackageBreakdown(packageRows, packageColumns);

      // Build category-level totals
      const categoryTotals = {};
      const agents = [];

      rows.forEach((row) => {
        agents.push({
          categoryId: row.CategoryId,
          categoryName: row.CategoryName || "Unknown",
          agentId: row.AgentId,
          agentName: row.AgentName || "Unknown",
          headCount: Number(row.TotalHeadCount) || 0,
          revenue: Number(row.TotalRevenue) || 0,
          bookings: Number(row.TotalBookings) || 0,
        });

        const key = row.CategoryId || "unknown";
        if (!categoryTotals[key]) {
          categoryTotals[key] = {
            categoryId: row.CategoryId,
            categoryName: row.CategoryName || "Unknown",
            headCount: 0,
            revenue: 0,
            bookings: 0,
          };
        }
        categoryTotals[key].headCount += Number(row.TotalHeadCount) || 0;
        categoryTotals[key].revenue += Number(row.TotalRevenue) || 0;
        categoryTotals[key].bookings += Number(row.TotalBookings) || 0;
      });

      const totals = {
        headCount: agents.reduce((s, a) => s + a.headCount, 0),
        revenue: agents.reduce((s, a) => s + a.revenue, 0),
        bookings: agents.reduce((s, a) => s + a.bookings, 0),
      };

      resolvedResult({
        status: true,
        response: {
	          Details: {
	            agents,
	            categoryTotals: Object.values(categoryTotals),
	            packageBreakdown,
	            totals,
	          },
        },
      });
    } catch (error) {
      logger.logError("getAgentReport() :: DB :: Error :: " + error);
      resolvedResult({ status: false, error: error.message });
    }
  },

  getAgentsForFilter: async (functionContext, resolvedResult) => {
    let logger = functionContext.logger;
    logger.logInfo("getAgentsForFilter() :: DB :: Invoked !");

    try {
      const { categoryId } = functionContext.params;

      let query = dbconfig.knex("users")
        .select("Id", "Name", "CategoryId")
        .where("IsActive", 1)
        .where("IsUserEnabled", 1)
        .whereIn("UserType", AGENT_USER_TYPES);

      if (categoryId) {
        query = query.where("CategoryId", categoryId);
      }

      const rows = await query.orderBy("Name");

      resolvedResult({ status: true, response: { Details: rows } });
    } catch (error) {
      logger.logError("getAgentsForFilter() :: DB :: Error :: " + error);
      resolvedResult({ status: false, error: error.message });
    }
  },
};

module.exports = reportsService;
