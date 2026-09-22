const applib = require("applib");
const reportsService = require("../services/reports");

const reportsController = {
  getAgentReport: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo("getAgentReport() invoked!!");

    try {
      const { startDate, endDate, categoryId, agentId } = req.query;

      const functionContext = {
        logger,
        params: {
          startDate: startDate || null,
          endDate: endDate || null,
          categoryId: categoryId ? Number(categoryId) : null,
          agentId: agentId ? Number(agentId) : null,
        },
      };

      reportsService.getAgentReport(functionContext, (result) => {
        if (result.status) {
          res.status(200).json(result.response);
        } else {
          res.status(500).json({ message: result.error || "Failed to fetch report" });
        }
      });
    } catch (error) {
      logger.logError("getAgentReport() :: Error :: " + error);
      res.status(500).json({ message: error.message });
    }
  },

  getAgentsForFilter: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    logger.logInfo("getAgentsForFilter() invoked!!");

    try {
      const { categoryId } = req.query;

      const functionContext = {
        logger,
        params: { categoryId: categoryId ? Number(categoryId) : null },
      };

      reportsService.getAgentsForFilter(functionContext, (result) => {
        if (result.status) {
          res.status(200).json(result.response);
        } else {
          res.status(500).json({ message: result.error || "Failed to fetch agents" });
        }
      });
    } catch (error) {
      logger.logError("getAgentsForFilter() :: Error :: " + error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = reportsController;
