const router = require("express").Router();
const applib = require("applib");

// controllers
const userController = require("../controllers/users");
const websiteDiscountController = require("../controllers/websiteDiscounts")
const couponController = require("../controllers/coupons")
const packageController = require("../controllers/packages")
const panelDiscountController = require("../controllers/panelDiscounts")
const futureBookingDateController = require("../controllers/futureBookingDate")
const outletsController = require("../controllers/outlets")
const shiftsController = require("../controllers/shifts")
const agentsettlementController = require("../controllers/agentSettlement")
const mappingURLController = require("../controllers/mappingURL")
const agentDiscountController = require("../controllers/agentDiscounts")

//user routes
router.post("/user",applib.validateToken, userController.addUser);
router.put("/user",applib.validateToken, userController.updateUser);
router.delete("/user",applib.validateToken, userController.deleteUser);
router.get("/user",applib.validateToken, userController.getUser);
router.get("/addQRLink",applib.validateToken, userController.addQRLink);
router.get("/getUserById", userController.getUserById);
router.get("/getUserByPhone", userController.getUserByPhone);
router.put("/countDriverBookings", userController.countDriverBookings);
router.post("/uploadQRFile",applib.validateToken, userController.uploadQRFile);

router.get("/hello", () => 'Hello');


//website discount routes
// router.post("/websiteDiscount",applib.validateToken, websiteDiscountController.addWebsiteDiscount);
// router.put("/websiteDiscount",applib.validateToken, websiteDiscountController.updateWebsiteDiscount);
// router.delete("/websiteDiscount",applib.validateToken, websiteDiscountController.deleteWebsiteDiscount);
router.post("/websiteDiscount", websiteDiscountController.addWebsiteDiscount);
router.put("/websiteDiscount", websiteDiscountController.updateWebsiteDiscount);
router.delete("/websiteDiscount", websiteDiscountController.deleteWebsiteDiscount);
// router.get("/websiteDiscount",applib.validateToken, websiteDiscountController.fetchWebsiteDiscount);
router.get("/websiteDiscount", websiteDiscountController.fetchWebsiteDiscount);
router.get("/enabledWebsiteDiscount", websiteDiscountController.fetchEnabledWebsiteDiscount);


//coupons
// router.get("/coupon",applib.validateToken, couponController.fetchCoupons);
router.get("/coupon", couponController.fetchCoupons);
// router.delete("/coupon",applib.validateToken, couponController.deleteCoupon);
router.delete("/coupon", couponController.deleteCoupon);
// router.get("/couponByInitial",applib.validateToken, couponController.getCouponByInitial);
router.get("/couponByInitial", couponController.getCouponByInitial);
// router.post("/coupon",applib.validateToken, couponController.addCoupon);
// router.put("/coupon",applib.validateToken, couponController.updateCoupon);
router.post("/coupon", couponController.addCoupon);
router.put("/coupon", couponController.updateCoupon);
// router.patch("/usedCoupon",applib.validateToken, couponController.updateUsedCoupons);
router.patch("/usedCoupon", couponController.updateUsedCoupons);


//Packages
router.get("/package",applib.validateToken, packageController.fetchPackages);
router.post("/package",applib.validateToken, packageController.addPackage);
router.put("/package",applib.validateToken, packageController.updatePackage);
router.delete("/package",applib.validateToken, packageController.deletePackage);
router.get("/getPackageDetails",applib.validateToken, packageController.getPackageDetails);

//panel discount routes
router.post("/panelDiscount",applib.validateToken, panelDiscountController.addPanelDiscount);
router.put("/panelDiscount",applib.validateToken, panelDiscountController.updatePanelDiscount);
router.delete("/panelDiscount",applib.validateToken, panelDiscountController.deletePanelDiscount);
router.get("/panelDiscount",applib.validateToken, panelDiscountController.fetchPanelDiscount);
router.get("/enabledPanelDiscounts",applib.validateToken, panelDiscountController.getEnabledPanelDiscounts);


//Future Booking date routes
// router.post("/futureBookingDate",applib.validateToken, futureBookingDateController.addUpdateFutureBookingDate);
router.post("/futureBookingDate", futureBookingDateController.addUpdateFutureBookingDate);
// router.get("/futureBookingDate",applib.validateToken, futureBookingDateController.fetchFutureBookingDate);
router.get("/futureBookingDate", futureBookingDateController.fetchFutureBookingDate);


//Outlet
router.post("/openOutlet",applib.validateToken, outletsController.openOutlet);
router.post("/closeOutlet",applib.validateToken, outletsController.closeOutlet);
router.get("/checkCurrentOutlet",applib.validateToken, outletsController.checkCurrentOutlet);
router.get("/checkActiveOutlet",applib.validateToken, outletsController.checkActiveOutlet);

//shifts
router.get("/checkShiftForUser",applib.validateToken, shiftsController.checkShiftForUser);
router.post("/openShift",applib.validateToken, shiftsController.openShift);
router.post("/closeShift",applib.validateToken, shiftsController.closeShift);
router.post("/reopenShift",applib.validateToken, shiftsController.reopenShift);
router.get("/recentShiftForOutlet",applib.validateToken, shiftsController.recentShiftForOutlet);

//Agent Settlements
router.post("/addUpdateAgentSettlement", agentsettlementController.addUpdateAgentSettlement);
router.put("/agentMonthlySettlement",applib.validateToken, agentsettlementController.agentMonthlySettlement);
router.get("/getAgentSettlements",applib.validateToken, agentsettlementController.getAgentSettlements);


//Url mapping Settlements
router.post("/shortenURL",mappingURLController.shortenURL);
router.get("/getLongURL", mappingURLController.getLongURL);


//Agent Discount QR
router.post("/agentDiscounts",applib.validateToken, agentDiscountController.addAgentDiscount);
router.put("/agentDiscounts",applib.validateToken, agentDiscountController.updateAgentDiscount);
router.get("/agentDiscounts",applib.validateToken, agentDiscountController.getAgentDiscount);
router.get("/agentDiscountsUsingDiscountCode",applib.validateToken, agentDiscountController.getAgentDiscountUsingDiscountCode);
router.post("/uploadAgentDiscountQRFile",applib.validateToken, agentDiscountController.uploadAgentDiscountQRFile);



module.exports = router;