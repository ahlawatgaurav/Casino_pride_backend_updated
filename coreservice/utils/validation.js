const joi = require("joi");

//user validation
module.exports.addUser = (requestParams) => {
  let joiSchema = joi.object({
    firebaseUUID: joi.string().required(),
    name: joi.string().optional().allow(null),
    address: joi.string().optional().allow(null),
    email: joi.string().optional().allow(null),
    phone: joi.string().optional().allow(null),
    userName: joi.string().optional().allow(null),
    password: joi.string().optional().allow(null),
    userType: joi.number().required(),
    discountPercent: joi.number().optional().allow(0),
    monthlySettlement: joi.number().optional().allow(0),
    QRLink: joi.string().optional().allow(null),
    NumOfBookings: joi.number().optional().allow(0),
    isUserEnabled: joi.number().required(),
    isActive: joi.number().required(),

  });
  return joiSchema.validate(requestParams);
};
module.exports.updateUser = (requestParams) => {
  let joiSchema = joi.object({
    userId:joi.number().required(),
    userRef:joi.string().required(),
    firebaseUUID: joi.string().required(),
    name: joi.string().optional().allow(null),
    address: joi.string().optional().allow(null),
    email: joi.string().optional().allow(null),
    phone: joi.string().optional().allow(null),
    userName: joi.string().optional().allow(null),
    password: joi.string().optional().allow(null),
    userType: joi.number().required(),
    discountPercent: joi.number().optional().allow(0),
    monthlySettlement: joi.number().optional().allow(0),
    QRLink: joi.string().optional().allow(null),
    NumOfBookings: joi.number().optional().allow(0),
    isUserEnabled: joi.number().required(),
    isActive: joi.number().required(),

  });
  return joiSchema.validate(requestParams);
};

module.exports.deleteUser = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getUser = (requestParams) => {
  let joiSchema = joi.object({
    userType: joi.number().optional().allow(0),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getUserById = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getUserByPhone = (requestParams) => {
  let joiSchema = joi.object({
    phone: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.countDriverBookings = (requestParams) => {
  let joiSchema = joi.object({
    userId:joi.number().required(),
    userType: joi.number().required(),
    localAgentName: joi.string().optional().allow(null),

  });
  return joiSchema.validate(requestParams);
};
module.exports.addQRLink = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().required(),
    userType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//booking website
module.exports.addWebsiteDiscount = (requestParams) => {
  let joiSchema = joi.object({
    discountTitle:joi.string().required(),
    discountAmount:joi.number().required(),
    StartDate: joi.string().required(),
    EndDate: joi.string().required(),
    isDiscountEnabled: joi.number().required(),
    IsActive: joi.number().required()

  });
  return joiSchema.validate(requestParams);
};

module.exports.updateWebsiteDiscount = (requestParams) => {
  let joiSchema = joi.object({
    discountId:joi.number().required(),
    discountRef:joi.string().required(),
    discountTitle:joi.string().required(),
    discountAmount:joi.number().required(),
    StartDate: joi.string().required(),
    EndDate: joi.string().required(),
    isDiscountEnabled: joi.number().required(),
    IsActive:joi.number().required()
  });
  return joiSchema.validate(requestParams);
};
module.exports.deleteWebsiteDiscount = (requestParams) => {
  let joiSchema = joi.object({
    discountId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.uploadQRFile = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};


//coupon
module.exports.deleteCoupon = (requestParams) => {
  let joiSchema = joi.object({
    couponId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getCouponByInitial = (requestParams) => {
  let joiSchema = joi.object({
    initial: joi.string().required(),
    numeric: joi.number().required(),
    currentDate: joi.date().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.addCoupon = (requestParams) => {
  let joiSchema = joi.object({
    couponTitle: joi.string().required(),
    couponDiscount: joi.number().required(),
    initial: joi.string().required(),
    seriesStart: joi.string().required(),
    seriesEnd: joi.string().required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    totalCoupons: joi.number().required(),
    usedCoupons: joi.string().optional().allow(null),
    remainingCoupons: joi.number().required(),
    isCouponEnabled: joi.number().required(),
    isActive: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateCoupon = (requestParams) => {
  let joiSchema = joi.object({
    couponId: joi.number().required(),
    couponRef: joi.string().required(),
    couponTitle: joi.string().required(),
    couponDiscount: joi.number().required(),
    initial: joi.string().required(),
    seriesStart: joi.string().required(),
    seriesEnd: joi.string().required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    totalCoupons: joi.number().required(),
    usedCoupons: joi.string().optional().allow(null),
    remainingCoupons: joi.number().required(),
    isCouponEnabled: joi.number().required(),
    isActive: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateUsedCoupons = (requestParams) => {
  let joiSchema = joi.object({
    couponId: joi.number().required(),
    usedCoupons: joi.string().optional().allow(null),
    remainingCoupons: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.addPackage = (requestParams) => {
  let joiSchema = joi.object({
    packageName: joi.string().required(),
    packageDescription: joi.string().optional().allow(null),
    packageWeekdayPrice: joi.number().required(),
    packageWeekendPrice: joi.number().required(),
    packageTeensPrice: joi.number().required(),
    packageTeensRate: joi.number().required(),
    packageTeensTax: joi.number().required(),
    packageTeensTaxName: joi.string().required(),
    numOfItems: joi.number().required(),
    isPackageEnabled: joi.number().required(),
    packageItems: joi.array().required(),
    startDate: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updatePackage = (requestParams) => {
  let joiSchema = joi.object({
    packageId: joi.number().required(),
    packageRef: joi.string().required(),
    packageName: joi.string().required(),
    packageDescription: joi.string().optional().allow(null),
    packageWeekdayPrice: joi.number().required(),
    packageWeekendPrice: joi.number().required(),
    // packageTeensId: joi.number().required(),
    // packageTeensRef: joi.string().required(),
    packageTeensPrice: joi.number().required(),
    packageTeensRate: joi.number().required(),
    packageTeensTax: joi.number().required(),
    packageTeensTaxName: joi.string().required(),
    numOfItems: joi.number().required(),
    isPackageEnabled: joi.number().required(),
    packageItems: joi.array().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.deletePackage = (requestParams) => {
  let joiSchema = joi.object({
    packageId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getPackageDetails = (requestParams) => {
  let joiSchema = joi.object({
    packageId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

//booking panel
module.exports.addPanelDiscount = (requestParams) => {
  let joiSchema = joi.object({
    panelDiscountTitle:joi.string().required(),
    panelDiscountAmount:joi.number().required(),
    isDiscountEnabled: joi.number().required(),
    IsActive: joi.number().required()

  });
  return joiSchema.validate(requestParams);
};

module.exports.updatePanelDiscount = (requestParams) => {
  let joiSchema = joi.object({
    discountId:joi.number().required(),
    discountRef:joi.string().required(),
    discountTitle:joi.string().required(),
    discountAmount:joi.number().required(),
    isDiscountEnabled: joi.number().required(),
    IsActive:joi.number().required()
  });
  return joiSchema.validate(requestParams);
};

module.exports.deletePanelDiscount = (requestParams) => {
  let joiSchema = joi.object({
    discountId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};

module.exports.addUpdateFutureBookingDate = (requestParams) => {
  let joiSchema = joi.object({
    futureDateId: joi.number().required(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
  });
  return joiSchema.validate(requestParams);
};

//outlet
module.exports.openOutlet = (requestParams) => {
  let joiSchema = joi.object({
    outletDate: joi.date().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.closeOutlet = (requestParams) => {
  let joiSchema = joi.object({
    outletId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.checkCurrentOutlet = (requestParams) => {
  let joiSchema = joi.object({
    outletDate: joi.date().required(),
  });
  return joiSchema.validate(requestParams);
};

//Shift
module.exports.checkShiftForUser = (requestParams) => {
  let joiSchema = joi.object({
    outletDate: joi.date().required(),
    userId: joi.number().required(),
    userType: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.openShift = (requestParams) => {
  let joiSchema = joi.object({
    outletDate: joi.date().required(),
    shiftTypeId: joi.number().required(),
    userType: joi.number().required(),
    userId: joi.number().required(),
    openTime: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.closeShift = (requestParams) => {
  let joiSchema = joi.object({
    outletId: joi.number().required(),
    shiftId: joi.number().required(),
    closeTime: joi.string().required(),
    userTypeId: joi.number().required(),
    userId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.reopenShift = (requestParams) => {
  let joiSchema = joi.object({
    outletId: joi.number().required(),
    shiftId: joi.number().required(),
    reopenTime: joi.string().required(),
    userTypeId: joi.number().required(),
    userId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.recentShiftForOutlet = (requestParams) => {
  let joiSchema = joi.object({
    outletDate: joi.date().required(),
  });
  return joiSchema.validate(requestParams);
};

//Agent settlement
module.exports.addUpdateAgentSettlement = (requestParams) => {
  let joiSchema = joi.object({
    userId: joi.number().required(),
    userTypeId: joi.number().required(),
    agentName: joi.string().required(),
    settlementAmount: joi.number().required(),
    bookingDate: joi.date().required(),
    bookingId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.agentMonthlySettlement = (requestParams) => {
  let joiSchema = joi.object({
    id: joi.number().required(),
    userId: joi.number().required(),
    referenceNum: joi.string().required(),
    isSettled: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getAgentSettlements = (requestParams) => {
  let joiSchema = joi.object({
    bookingDate: joi.date().optional().allow(null),
    userTypeId: joi.number().optional().allow(0),
  });
  return joiSchema.validate(requestParams);
};

//URL mapping
module.exports.shortenURL = (requestParams) => {
  let joiSchema = joi.object({
    longURL: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getLongURL = (requestParams) => {
  let joiSchema = joi.object({
    shortCode: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};

//Agent Discount QR
module.exports.addAgentDiscount = (requestParams) => {
  let joiSchema = joi.object({
    agentDiscountPercent: joi.number().required(),
    userId: joi.number().required(),
    userTypeId: joi.number().required(),
    isAgentDiscountEnabled: joi.number().required(),
    isActive: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.updateAgentDiscount = (requestParams) => {
  let joiSchema = joi.object({
    agentDiscountId: joi.number().required(),
    agentDiscountRef: joi.string().required(),
    isAgentDiscountEnabled: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getAgentDiscount = (requestParams) => {
  let joiSchema = joi.object({
    agentDiscountId: joi.number().optional().allow(0),
    userId: joi.number().optional().allow(0),
  });
  return joiSchema.validate(requestParams);
};
module.exports.getAgentDiscountUsingDiscountCode = (requestParams) => {
  let joiSchema = joi.object({
    agentDiscountCode: joi.string().required(),
  });
  return joiSchema.validate(requestParams);
};
module.exports.uploadAgentDiscountQRFile = (requestParams) => {
  let joiSchema = joi.object({
    agentDiscountId: joi.number().required(),
  });
  return joiSchema.validate(requestParams);
};