const applib = require("applib");
const momentTimezone = require("moment-timezone");
let jwt = require("jsonwebtoken");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const agentSettlementService = require("../services/agentSettlement");

const validate = require("../utils/validation");

const agentSettlementController = {
  addUpdateAgentSettlement: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`addUpdateAgentSettlement() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "addUpdateAgentSettlement",
      model: new responseModel.addUpdateAgentSettlement(),
    };

    let addUpdateAgentSettlementRequest = new requestModel.addUpdateAgentSettlement(req);

    logger.logInfo(`addUpdateAgentSettlement() :: Request Object :: ${addUpdateAgentSettlementRequest}`);

    let validateRequest = validate.addUpdateAgentSettlement(addUpdateAgentSettlementRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `addUpdateAgentSettlement() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let addUpdateAgentSettlementDBResult = await agentSettlementService.addUpdateAgentSettlement(
        functionContext,
        addUpdateAgentSettlementRequest
      );
      response(functionContext, responseObj,addUpdateAgentSettlementDBResult);
    } catch (errAddUpdateAgentSettlement) {
      if (!errAddUpdateAgentSettlement.ErrorMessage && !errAddUpdateAgentSettlement.ErrorCode) {
        // logger.logInfo(`addUpdateAgentSettlementDBResult :: Error :: ${errAddUpdateAgentSettlement}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `addUpdateAgentSettlementDBResult :: Error :: ${JSON.stringify(errAddUpdateAgentSettlement)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  agentMonthlySettlement: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`agentMonthlySettlement() invoked!!`);
	
    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "agentMonthlySettlement",
      model: new responseModel.agentMonthlySettlement(),
    };

    let agentMonthlySettlementRequest = new requestModel.agentMonthlySettlement(req);

    logger.logInfo(`agentMonthlySettlement() :: Request Object :: ${agentMonthlySettlementRequest}`);

    let validateRequest = validate.agentMonthlySettlement(agentMonthlySettlementRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `agentMonthlySettlement() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let agentMonthlySettlementDBResult = await agentSettlementService.agentMonthlySettlement(
        functionContext,
        agentMonthlySettlementRequest
      );
      response(functionContext, responseObj,agentMonthlySettlementDBResult);
    } catch (errAgentMonthlySettlement) {
	    
      if (!errAgentMonthlySettlement.ErrorMessage && !errAgentMonthlySettlement.ErrorCode) {
        // logger.logInfo(`agentMonthlySettlementDBResult :: Error :: ${errAgentMonthlySettlement}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `agentMonthlySettlementDBResult :: Error :: ${JSON.stringify(errAgentMonthlySettlement)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  getAgentSettlements: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
    var authorization = req.headers.authtoken,
    userId;

    logger.logInfo(`getAgentSettlements() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "getAgentSettlements",
      model: new responseModel.getAgentSettlements(),
    };

    let getAgentSettlementsRequest = new requestModel.getAgentSettlements(req);

    logger.logInfo(`getAgentSettlements() :: Request Object :: ${getAgentSettlementsRequest}`);

    let validateRequest = validate.getAgentSettlements(getAgentSettlementsRequest);

    userId = jwt.verify(authorization, process.env.JWT_SECRET_KEY)?.userId;

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `getAgentSettlements() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    
    try {
      let getAgentSettlementsDBResult = await agentSettlementService.getAgentSettlements(
        functionContext,
        {...getAgentSettlementsRequest, userId}
      );
      response(functionContext, responseObj,getAgentSettlementsDBResult);
    } catch (errGetAgentSettlements) {
      if (!errGetAgentSettlements.ErrorMessage && !errGetAgentSettlements.ErrorCode) {
        // logger.logInfo(`getAgentSettlementsDBResult :: Error :: ${errGetAgentSettlements}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `getAgentSettlementsDBResult :: Error :: ${JSON.stringify(errGetAgentSettlements)}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = agentSettlementController;
