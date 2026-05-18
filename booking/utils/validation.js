const joi = require("joi");

//Booking validation
module.exports.newBooking = (requestParams) => {
  let joiSchema = joi.object({
    guestName: joi.string().optional().allow(null),
    address: joi.string().optional().allow(null),
    countryCode: joi.string().optional().allow(null),
    phone: joi.string().optional().allow(null),
    email: joi.string().optional().allow(null),
    dob: joi.string().optional().allow(null),
    country: joi.string().optional().allow(null),
    state: joi.string().optional().allow(null),
    city: joi.string().optional().allow(null),
    GSTNumber: joi.string().optional().allow(null),
    governmentId: joi.string().optional().allow(null),
    totalGuestCount: joi.number().optional().allow(0),
    // numOfKids: joi.number().optional().allow(0),
    numOfTeens: joi.number().optional().allow(0),
    discountId: joi.number().optional().allow(0),
    panelDiscountId: joi.number().optional().allow(0),
    couponId: joi.number().optional().allow(0),
    discount: joi.number().optional().allow(0),
    referredBy: joi.string().optional().allow(null),
    settledByCompany: joi.number().optional().allow(0),
    agentPanelDiscount: joi.number().optional().allow(0),
    localAgentName: joi.string().optional().allow(null),
    localAgentId: joi.number().optional().allow(0),
    travelAgentName: joi.string().optional().allow(null),
    travelAgentId: joi.number().optional().allow(0),
    packageId: joi.string().optional().allow(null),
    packageName: joi.string().optional().allow(null),
    packageGuestCount: joi.string().optional().allow(null),
    packageWeekdayPrice: joi.string().optional().allow(null),
    packageWeekendPrice: joi.string().optional().allow(null),
    // ackFile: joi.number().optional().allow(0),
    userId: joi.number().optional().allow(0),
    userTypeId: joi.number().optional().allow(0),
    isBookingWebsite: joi.number().optional().allow(0),
    bookingDate: joi.string().optional().allow(null),
    futureDate: joi.string().optional().allow(null),
    shiftId: joi.number().optional().allow(0),
    teensPrice: joi.number().optional().allow(0),
    teensRate: joi.number().optional().allow(0),
    teensTax: joi.number().optional().allow(0),
    teensTaxName: joi.string().optional().allow(null),
    actualAmount: joi.number().optional().allow(0),
    amountAfterDiscount: joi.number().optional().allow(0),
    payAtCounter: joi.number().optional().allow(0),
    paymentMode: joi.string().optional().allow(null),
    cashAmount: joi.number().optional().allow(0),
    cardAmount: joi.number().optional().allow(0),
    UPIAmount: joi.number().optional().allow(0),
    UPIId: joi.string().optional().allow(null),
    cardHoldersName: joi.string().optional().allow(null),
    cardNumber: joi.string().optional().allow(null),
    cardType: joi.string().optional().allow(null),
    isActive: joi.number().required()

  });
  return joiSchema.validate(requestParams);
};
module.exports.checkBannedUser = (requestParams) => {
  let joiSchema = joi.object({
    phone: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getUserByPhone = (requestParams) => {
  let joiSchema = joi.object({
    phone: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getBookingLink = (requestParams) => {
  let joiSchema = joi.object({
    shortCode: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.disableBooking = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.sendBookingInternalMail = (requestParams) => {
  let joiSchema = joi.object({
    amount: joi.number().required(),
    packageName: joi.string().optional().allow(null),
    guestCount: joi.number().required(),
    eventDate: joi.string().optional().allow(null),
    bookingDate: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getBookingDetails = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.fetchBookings = (requestParams) => {
  let joiSchema = joi.object({
    futureDate: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
module.exports.uploadACKFile = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateBooking = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
    guestName: joi.string().optional().allow(null),
    address: joi.string().optional().allow(null),
    dob: joi.string().optional().allow(null),
    country: joi.string().optional().allow(null),
    state: joi.string().optional().allow(null),
    city: joi.string().optional().allow(null),
    GSTNumber: joi.string().optional().allow(null),
    governmentId: joi.string().optional().allow(null),
    isActive: joi.number().required(),
    totalGuestCount: joi.number().optional().allow(0),
    numOfTeens: joi.number().optional().allow(0),
    packageId: joi.string().optional().allow(null),
    packageName: joi.string().optional().allow(null),
    packageGuestCount: joi.string().optional().allow(null),
    packageWeekdayPrice: joi.string().optional().allow(null),
    packageWeekendPrice: joi.string().optional().allow(null),
    shiftId: joi.number().optional().allow(0),
    teensPrice: joi.number().optional().allow(0),
    teensRate: joi.number().optional().allow(0),
    teensTax: joi.number().optional().allow(0),
    teensTaxName: joi.string().optional().allow(null),
    actualAmount: joi.number().optional().allow(0),
    amountAfterDiscount: joi.number().optional().allow(0),
    paymentMode: joi.string().optional().allow(null),
    cashAmount: joi.number().optional().allow(0),
    cardAmount: joi.number().optional().allow(0),
    UPIAmount: joi.number().optional().allow(0),
  });
  return joiSchema.validate(requestParams);
};
module.exports.sendACKMail = (requestParams) => {
  let joiSchema = joi.object({
    receiverEmail: joi.string().required(),
    amount: joi.number().required(),
    ackFile: joi.string().required(),

  });
  return joiSchema.validate(requestParams);
};
module.exports.getBookingsForUser = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().required(),
    date: joi.date().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getAcknowledgementLink = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateBookingForPayAtCounter = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
    paymentMode: joi.string().optional().allow(null),
    cashAmount: joi.number().optional().allow(0),
    cardAmount: joi.number().optional().allow(0),
    UPIAmount: joi.number().optional().allow(0),
    UPIId: joi.string().optional().allow(null),
    cardHoldersName: joi.string().optional().allow(null),
    cardNumber: joi.string().optional().allow(null),
    cardType: joi.string().optional().allow(null),
    settleByCompany: joi.number().optional().allow(0)

  });
  return joiSchema.validate(requestParams);
};
module.exports.updateShiftForBooking = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
    shiftTypeId: joi.number().required(),

  });
  return joiSchema.validate(requestParams);
};
module.exports.SendPaymentLinkToCustomer = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
    phone: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};