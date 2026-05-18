require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();

const middlewareExcept = (fn, except) =>
  (req, res, next) => {
    if (except.includes(req.path)) next();
    else fn(req, res, next);
  };

const cors = require("cors");
const bodyParser = require("body-parser");

// project packages
const appLib = require("applib");
const middleware = require("middleware");

//project constants
const logger = new appLib.Logger(null);

//file upload
const upload = require("./utils/fileUpload").FileUploadConfig;
app.use(upload.array("File"));

//routes

app.use(cors());

app.use(function (_req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

startAuthServer(logger);



app.use(middleware.validateRequest);
// app.use(middlewareExcept(middleware.validateRequest, ["/api/core/getUserByPhone"]));

// const routes = require("./routes/index");
// app.use("/api/core", routes);

const coreServiceRoutes = require("./routes/index");
app.use("/api/core", coreServiceRoutes);

async function startAuthServer(log) {
  try {
    log.logInfo(`startAuthServer Invoked()`);
    // await appLib.fetchDBSettings(log, middleware.settings, config);

    app.listen(process.env.CORESERVICE_PORT, () => {
      log.logInfo(
        "CORE SERVER running on port " + process.env.CORESERVICE_PORT
      );
      console.log(
        "CORESERVICE running on port " + process.env.CORESERVICE_PORT
      );
    });
  } catch (errFetchDBSettings) {
    log.logInfo("Error occured in starting AUTH SERVER. Need immediate check.");
  }
}
module.exports = app;
