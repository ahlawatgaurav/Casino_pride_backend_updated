let logger = require("./logger").LoggerModel
let constant = require("./constant");
let jwt = require("jsonwebtoken");

exports.SendHttpResponse = function (functionContext, response) {
    let httpResponseType = constant.ErrorCode.Success;
    functionContext.res.writeHead(httpResponseType, {
      "Content-Type": "application/json",
    });
    functionContext.responseText = JSON.stringify(response);
    functionContext.res.end(functionContext.responseText);
  };
  
  module.exports.fetchDBSettings = async function (
    logger,
    settings,
    databaseModule
  ) {
    try {
      logger.logInfo("fetchDBSettings()");
      let rows = await databaseModule.knex.raw(`CALL usp_get_app_settings`);
      var dbSettingsValue = rows[0][0];
      settings.APP_KEY = getValue(dbSettingsValue, "APP_KEY");
      settings.APP_SECRET = getValue(dbSettingsValue, "APP_SECRET");
      return;
    } catch (errGetSettingsFromDB) {
      throw errGetSettingsFromDB;
    }
  };
  
  function getValue(requestArray, key) {
    var requestArrayLength = requestArray ? requestArray.length : 0;
    for (
      var requestArrayCount = 0;
      requestArrayCount < requestArrayLength;
      requestArrayCount++
    ) {
      if (
        requestArray[requestArrayCount].key.toLowerCase() === key.toLowerCase()
      ) {
        return requestArray[requestArrayCount].value;
      }
    }
    return null;
  }
  module.exports.validateToken = async (req, res, next) => {
    try {
      // Extract the token from the request headers
      const token = req.headers.authtoken;
  
      if (!token) {
        return res.status(401).json({ error: "Authorization token missing" });
      }
  
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ errorCode: 401, message: "Invalid token" });
    }
  };
  module.exports.Logger = logger;
