// const express = require("express")
// const router = express.Router()
// const applib = require("applib")

// router.get("/check", (req, res) => {
//     console.log("req", req);
//     console.log("Success");
//     applib.SendHttpResponse({ Status: "Success" }, { StatusCode: 200 });
//   });
  
//   module.exports = router;

const router = require("express").Router();
const applib = require("applib");

const authController = require("../controllers/auth");
const userController = require("../controllers/user");

router.post("/validateuser", userController.validateUser);
router.post("/login", authController.login);
router.post("/logout",applib.validateToken,authController.logout)
router.get("/checkIP",authController.checkIP)
// router.post("/logout",authController.logout)

module.exports = router;
