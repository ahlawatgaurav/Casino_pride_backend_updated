const router = require("express").Router();
const applib = require("applib");

// controllers
const bookingController = require("../controllers/booking");


//Booking routes
// router.post("/newBooking",applib.validateToken, bookingController.newBooking);
router.post("/newBooking", bookingController.newBooking);
router.post("/SendPaymentLinkToCustomer", applib.validateToken,bookingController.SendPaymentLinkToCustomer);
router.get("/getUserByPhone",applib.validateToken, bookingController.getUserByPhone);
router.get("/getBookingLink", bookingController.getBookingLink);
router.post("/sendBookingInternalMail", bookingController.sendBookingInternalMail);
router.get("/getBookingDetails", bookingController.getBookingDetails);
router.get("/fetchBookings",applib.validateToken, bookingController.fetchBookings);
// router.get("/displayPackages",applib.validateToken, bookingController.displayPackages);
router.get("/displayPackages", bookingController.displayPackages);
router.put("/disableBooking", bookingController.disableBooking);
router.post("/uploadACKFile", bookingController.uploadACKFile);
router.put("/updateBooking", applib.validateToken,bookingController.updateBooking);
router.post("/sendACKMail", bookingController.sendACKMail);
router.get("/getBookingsForUser",applib.validateToken, bookingController.getBookingsForUser);
router.get("/getAcknowledgementLink", bookingController.getAcknowledgementLink);
router.put("/updateBookingForPayAtCounter", applib.validateToken,bookingController.updateBookingForPayAtCounter);
router.put("/updateShiftForBooking", applib.validateToken,bookingController.updateShiftForBooking);


module.exports = router;