const joi = require("joi");

//Booking validation
module.exports.addBillingDetails = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
    packageId: joi.string().required(),
    packageGuestCount: joi.string().required(),
    packageWeekdayPrice: joi.string().required(),
    packageWeekendPrice: joi.string().required(),
    totalGuestCount: joi.number().required(),
    teensCount: joi.number().required(),
    bookingDate: joi.date().required(),
    billingDate: joi.date().required(),
    actualAmount: joi.number().required(),
    amountAfterDiscount: joi.number().required(),
    discount: joi.number().optional().allow(0),
    // billNumber: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getBillingDetails = (requestParams) => {
  let joiSchema = joi.object({
    billId: joi.number().optional().allow(0),
    userId: joi.number().optional().allow(0),
    billingDate: joi.string().optional().allow(null),
    futureDate: joi.string().optional().allow(null),
    shiftId: joi.number().optional().allow(0),
    isBookingWebsite: joi.number().optional().allow(0),
    fromDate: joi.string().optional().allow(null),
    toDate: joi.string().optional().allow(null),
    // billNumber: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.uploadBillFile = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.updateBillingDetails = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.voidBill = (requestParams) => {
  let joiSchema = joi.object({
    bookingId: joi.number().required(),
    voidBillReason: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateBillIdForVoid = (requestParams) => {
  let joiSchema = joi.object({
    voidBillId: joi.number().required(),
    bookingId: joi.number().required(),
    newBillId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.sendBillMail = (requestParams) => {
  let joiSchema = joi.object({
    receiverMail: joi.string().required(),
    amount: joi.number().required(),
    billFile: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateItemDetailsBill = (requestParams) => {
  let joiSchema = joi.object({
    billId: joi.string().required(),
    updatedItemDetails: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.noShowGuestList = (requestParams) => {
  let joiSchema = joi.object({
    eventDate: joi.string().optional().allow(null),
  });
  return joiSchema.validate(requestParams);
};

//Payments
module.exports.addPaymentDetails = (requestParams) => {
  let joiSchema = joi.object({
    transactionId: joi.string().required(),
    paymentMode: joi.string().optional().allow(null),
    paymentStatus: joi.string().required(),
    bankCode:joi.string().optional().allow(null),
    field1:joi.string().optional().allow(null),
    UPIID:joi.string().optional().allow(null),
    firstname:joi.string().optional().allow(null),
    amount: joi.number().required(),
    bookingId: joi.string().optional()
  });
  return joiSchema.validate(requestParams);
};
module.exports.updatePaymentDetails = (requestParams) => {
  let joiSchema = joi.object({
    paymentId: joi.number().required(),
    paymentRef: joi.string().required(),
    paymentMode:joi.string().optional().allow(null),
    paymentStatus: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateBookingId = (requestParams) => {
  let joiSchema = joi.object({
    paymentId: joi.number().required(),
    transactionId: joi.string().required(),
    bookingId:joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//reports
module.exports.generateReports = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().optional().allow(0),
    userType: joi.number().optional().allow(0),
    billDate: joi.string().optional().allow(null),
    futureDate: joi.string().optional().allow(null),
    shiftId: joi.number().optional().allow(0),
    reportTypeId: joi.number().optional().allow(0),
    fromDate: joi.string().optional().allow(null),
    toDate: joi.string().optional().allow(null),
    isSettlementReport :joi.number().optional().allow(0),
    settlementDate :joi.string().optional().allow(null),
    settlementUpdateDate :joi.string().optional().allow(null),
    isAgentPanel: joi.number().optional().allow(0),
	  userTypeRole:joi.number().optional().allow(0),
	  settlementMonth:joi.string().optional().allow(null) // agent settlement
  });
  return joiSchema.validate(requestParams);
};
module.exports.generateNoShowReport = (requestParams) => {
  let joiSchema = joi.object({
    eventDate: joi.string().optional().allow(null),
    reportTypeId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.cashierReport = (requestParams) => {
  let joiSchema = joi.object({
    date: joi.string().optional().allow(null),
    reportTypeId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.cashierReportShiftWise = (requestParams) => {
  let joiSchema = joi.object({
    date: joi.string().required(),
    shiftId: joi.number().required(),
    reportTypeId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
