const router = require("express").Router();
const applib = require("applib");

// controllers
const billingController = require("../controllers/billing");
const reportsController = require("../controllers/reports");
const paymentsController = require("../controllers/payments");


//Billing routes
router.post("/addBillingDetails",applib.validateToken, billingController.addBillingDetails);
router.get("/getBillingDetails",applib.validateToken, billingController.getBillingDetails);
router.post("/uploadBillFile",applib.validateToken, billingController.uploadBillFile);
router.put("/updateBillingDetails",applib.validateToken, billingController.updateBillingDetails);
router.put("/voidBill",applib.validateToken, billingController.voidBill);
router.put("/updateBillIdForVoid",applib.validateToken, billingController.updateBillIdForVoid);
router.post("/sendBillMail", billingController.sendBillMail);
router.put("/updateItemDetailsBill",applib.validateToken, billingController.updateItemDetailsBill);
router.get("/noShowGuestList",applib.validateToken, billingController.noShowGuestList);
router.get("/fetchVoidBill",applib.validateToken, billingController.fetchVoidBill);


//Reports routes
router.post("/generateCSVReport",applib.validateToken, reportsController.generateReports);
router.get("/generateNoShowReport",applib.validateToken, reportsController.generateNoShowReport);
router.get("/cashierReport",applib.validateToken, reportsController.cashierReport);
router.get("/cashierReportShiftWise",applib.validateToken, reportsController.cashierReportShiftWise);

//Payments
// router.post("/payments",applib.validateToken, paymentsController.addPaymentDetails);
router.patch("/payments", paymentsController.updatePaymentDetails);
router.put("/updateBookingId", paymentsController.updateBookingId);

module.exports = router;
