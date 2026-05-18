require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();

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
const paymentsController = require("./controllers/payments");
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

app.post("/api/billing/addPayments", paymentsController.addPaymentDetails);
app.post("/api/billing/addPaymentsAgentPanel", paymentsController.addPaymentDetailsAgent);
app.use(middleware.validateRequest);

const routes = require("./routes/index");
app.use("/api/billing", routes);

const billingRoutes = require("./routes/index");
app.use("/api/billing", billingRoutes);

async function startAuthServer(log) {
  try {
    log.logInfo(`startAuthServer Invoked()`);
    // await appLib.fetchDBSettings(log, middleware.settings, config);

    app.listen(process.env.BILLING_PORT, () => {
      log.logInfo(
        "BILLING SERVER running on port " + process.env.BILLING_PORT
      );
      console.log(
        "BILLING running on port " + process.env.BILLING_PORT
      );
    });
  } catch (errFetchDBSettings) {
    log.logInfo("Error occured in starting AUTH SERVER. Need immediate check.");
  }
}
module.exports = app;