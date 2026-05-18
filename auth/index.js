// require("dotenv").config({ path: __dirname + "/.env" });

// const express = require("express");
// const app = express();

// const cors = require("cors");
// const bodyParser = require("body-parser");

// // project packages
// const appLib = require("applib");
// const middleware = require("middleware");

// //project constants
// const logger = new appLib.Logger(null);

// //routes



// startAuthServer(logger);

// async function startAuthServer(log) {
//   try {
//     log.logInfo(`startAuthServer Invoked()`);
//     // await appLib.fetchDBSettings(log, middleware.settings, config);

//     app.listen(process.env.AUTH_PORT, () => {
//       log.logInfo("AUTH SERVER running on port " + process.env.AUTH_PORT);
//       console.log("AUTH SERVER running on port " + process.env.AUTH_PORT);
//     });
//   } catch (errFetchDBSettings) {
//     log.logInfo("Error occured in starting AUTH SERVER. Need immediate check.");
//   }
// }

// app.use(cors());

// app.use(function (_req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ type: "application/json" }));

// app.use(middleware.validateRequest);

// const authRoutes = require("./routes/index");
// app.use("/api/auth", authRoutes);


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

const authRoutes = require("./routes/index");
app.use("/api/auth", authRoutes);

async function startAuthServer(log) {
  try {
    log.logInfo(`startAuthServer Invoked()`);
    // await appLib.fetchDBSettings(log, middleware.settings, config);

    app.listen(process.env.AUTH_PORT, () => {
      log.logInfo("AUTH SERVER running on port " + process.env.AUTH_PORT);
      console.log("AUTH SERVER running on port " + process.env.AUTH_PORT);
    });
  } catch (errFetchDBSettings) {
    log.logInfo("Error occured in starting AUTH SERVER. Need immediate check.");
  }
}
module.exports = app;
