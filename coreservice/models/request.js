//site requests
class getSites {
    constructor(req) {
      this.companyId = req.query.companyId ? req.query.companyId : 0;
      this.siteId = req.query.siteId ? req.query.siteId : 0;
    }
  }
  
  class addUser {
    constructor(req) {
      this.firebaseUUID = req.body.firebaseUUID ? req.body.firebaseUUID : null;
      this.name = req.body.name ? req.body.name : null;
      this.address = req.body.address ? req.body.address : null;
      this.email = req.body.email ? req.body.email : null;
      this.phone = req.body.phone ? req.body.phone : null;
      this.userName = req.body.userName ? req.body.userName : null;
      this.password = req.body.password ? req.body.password : null;
      this.userType = req.body.userType ? req.body.userType : 0;
      this.discountPercent = req.body.discountPercent ? req.body.discountPercent : 0;
      this.monthlySettlement = req.body.monthlySettlement ? req.body.monthlySettlement : 0;
      this.QRLink = req.body.QRLink ? req.body.QRLink : null;
      this.NumOfBookings = req.body.NumOfBookings ? req.body.NumOfBookings : 0;
      this.isUserEnabled = req.body.isUserEnabled ? req.body.isUserEnabled : 0;
      this.isUserEnabled = req.body.isUserEnabled ? req.body.isUserEnabled : 0;
      this.isActive = req.body.isActive ? req.body.isActive : 0;
    }
  }
  class updateUser {
    constructor(req) {
      this.userId = req.body.userId ? req.body.userId : 0;
      this.userRef = req.body.userRef ? req.body.userRef : null;
      this.firebaseUUID = req.body.firebaseUUID ? req.body.firebaseUUID : null;
      this.name = req.body.name ? req.body.name : null;
      this.address = req.body.address ? req.body.address : null;
      this.email = req.body.email ? req.body.email : null;
      this.phone = req.body.phone ? req.body.phone : null;
      this.userName = req.body.userName ? req.body.userName : null;
      this.password = req.body.password ? req.body.password : null;
      this.userType = req.body.userType ? req.body.userType : 0;
      this.discountPercent = req.body.discountPercent ? req.body.discountPercent : 0;
      this.monthlySettlement = req.body.monthlySettlement ? req.body.monthlySettlement : 0;
      this.QRLink = req.body.QRLink ? req.body.QRLink : null;
      this.NumOfBookings = req.body.NumOfBookings ? req.body.NumOfBookings : 0;
      this.isUserEnabled = req.body.isUserEnabled ? req.body.isUserEnabled : 0;
      this.isActive = req.body.isActive ? req.body.isActive : 0;
    }
  }

  class deleteUser {
    constructor(req) {
      this.userId = req.query.userId ? req.query.userId : 0;
    }
  }

  class getUser {
    constructor(req) {
      this.userType = req.query.userType ? req.query.userType : 0;
    }
  }
  class getUserById {
    constructor(req) {
      this.userId = req.query.userId ? req.query.userId : 0;
    }
  }
  class getUserByPhone {
    constructor(req) {
      this.phone = req.query.phone ? req.query.phone : 0;
    }
  }
  class addQRLink {
    constructor(req) {
      this.userId = req.query.userId ? req.query.userId : 0;
      this.userType = req.query.userType ? req.query.userType : 0;
    }
  }
  class countDriverBookings {
    constructor(req) {
      this.userId = req.body.userId ? req.body.userId : 0;
      this.userType = req.body.userType ? req.body.userType : 0;
      this.localAgentName = req.body.localAgentName ? req.body.localAgentName : null;
    }
  }

  //discounts for booking website
  class addWebsiteDiscount {
    constructor(req) {
      this.discountTitle = req.body.discountTitle ? req.body.discountTitle : null;
      this.discountAmount = req.body.discountAmount ? req.body.discountAmount : 0;
      this.StartDate = req.body.StartDate ? req.body.StartDate : null;
      this.EndDate = req.body.EndDate ? req.body.EndDate : null;
      this.isDiscountEnabled = req.body.isDiscountEnabled ? req.body.isDiscountEnabled : 0;
      this.IsActive = req.body.IsActive ? req.body.IsActive : 0;
    }
  }
  class updateWebsiteDiscount {
    constructor(req) {
      this.discountId=req.body.discountId ? req.body.discountId :0;
      this.discountRef=req.body.discountRef ? req.body.discountRef :null;
      this.discountTitle = req.body.discountTitle ? req.body.discountTitle : null;
      this.discountAmount = req.body.discountAmount ? req.body.discountAmount : 0;
      this.StartDate = req.body.StartDate ? req.body.StartDate : null;
      this.EndDate = req.body.EndDate ? req.body.EndDate : null;
      this.isDiscountEnabled = req.body.isDiscountEnabled ? req.body.isDiscountEnabled : 0;
      this.IsActive = req.body.IsActive ? req.body.IsActive :0;
    }
  }
  class deleteWebsiteDiscount {
    constructor(req) {
      this.discountId = req.query.discountId ? req.query.discountId : 0;
    }
  }
  class uploadQRFile {
    constructor(req) {
      this.userId = req.body.userId ? req.body.userId : 0;
    }
  }


//coupons
class deleteCoupon {
  constructor(req) {
    this.couponId = req.query.couponId ? req.query.couponId : 0;
  }
}
class getCouponByInitial {
  constructor(req) {
    this.initial = req.query.initial ? req.query.initial : null;
    this.numeric = req.query.numeric ? req.query.numeric : null;
    this.currentDate = req.query.currentDate ? req.query.currentDate : null;
  }
}
class addCoupon {
  constructor(req) {
    this.couponTitle = req.body.couponTitle ? req.body.couponTitle : null;
    this.couponDiscount = req.body.couponDiscount ? req.body.couponDiscount : 0;
    this.initial = req.body.initial ? req.body.initial : null;
    this.seriesStart = req.body.seriesStart ? req.body.seriesStart : null;
    this.seriesEnd = req.body.seriesEnd ? req.body.seriesEnd : null;
    this.startDate = req.body.startDate ? req.body.startDate : null;
    this.endDate = req.body.endDate ? req.body.endDate : null;
    this.totalCoupons = req.body.totalCoupons ? req.body.totalCoupons : 0;
    this.usedCoupons = req.body.usedCoupons ? req.body.usedCoupons : null;
    this.remainingCoupons = req.body.remainingCoupons ? req.body.remainingCoupons : 0;
    this.isCouponEnabled = req.body.isCouponEnabled ? req.body.isCouponEnabled : 0;
    this.isActive = req.body.isActive ? req.body.isActive : 0;
  }
}
class updateCoupon {
  constructor(req) {
    this.couponId = req.body.couponId ? req.body.couponId : 0;
    this.couponRef = req.body.couponRef ? req.body.couponRef : null;
    this.couponTitle = req.body.couponTitle ? req.body.couponTitle : null;
    this.couponDiscount = req.body.couponDiscount ? req.body.couponDiscount : 0;
    this.initial = req.body.initial ? req.body.initial : null;
    this.seriesStart = req.body.seriesStart ? req.body.seriesStart : null;
    this.seriesEnd = req.body.seriesEnd ? req.body.seriesEnd : null;
    this.startDate = req.body.startDate ? req.body.startDate : null;
    this.endDate = req.body.endDate ? req.body.endDate : null;
    this.totalCoupons = req.body.totalCoupons ? req.body.totalCoupons : 0;
    this.usedCoupons = req.body.usedCoupons ? req.body.usedCoupons : null;
    this.remainingCoupons = req.body.remainingCoupons ? req.body.remainingCoupons : 0;
    this.isCouponEnabled = req.body.isCouponEnabled ? req.body.isCouponEnabled : 0;
    this.isActive = req.body.isActive ? req.body.isActive : 0;
  }
}
class updateUsedCoupons {
  constructor(req) {
    this.couponId = req.body.couponId ? req.body.couponId : 0;
    this.usedCoupons = req.body.usedCoupons ? req.body.usedCoupons : null;
    this.remainingCoupons = req.body.remainingCoupons ? req.body.remainingCoupons : 0;
  }
}

//Add Packages
class addPackage {
  constructor(req) {
    this.packageName = req.body.packageName ? req.body.packageName : null;
    this.packageDescription = req.body.packageDescription ? req.body.packageDescription : null;
    this.packageWeekdayPrice = req.body.packageWeekdayPrice ? req.body.packageWeekdayPrice : 0;
    this.packageWeekendPrice = req.body.packageWeekendPrice ? req.body.packageWeekendPrice : 0;
    this.packageTeensPrice = req.body.packageTeensPrice ? req.body.packageTeensPrice : 0;
    this.packageTeensRate = req.body.packageTeensRate ? req.body.packageTeensRate : 0;
    this.packageTeensTax = req.body.packageTeensTax ? req.body.packageTeensTax : 0;
    this.packageTeensTaxName = req.body.packageTeensTaxName ? req.body.packageTeensTaxName : null;
    this.numOfItems = req.body.numOfItems ? req.body.numOfItems : 0;
    this.isPackageEnabled = req.body.isPackageEnabled ? req.body.isPackageEnabled : 0;
    this.packageItems = req.body.packageItems ? req.body.packageItems : [];
    this.startDate = req.body.startDate ? req.body.startDate : null;
  }
}
class updatePackage {
  constructor(req) {
    this.packageId = req.body.packageId ? req.body.packageId : 0;
    this.packageRef = req.body.packageRef ? req.body.packageRef : null;
    this.packageName = req.body.packageName ? req.body.packageName : null;
    this.packageDescription = req.body.packageDescription ? req.body.packageDescription : null;
    this.packageWeekdayPrice = req.body.packageWeekdayPrice ? req.body.packageWeekdayPrice : 0;
    this.packageWeekendPrice = req.body.packageWeekendPrice ? req.body.packageWeekendPrice : 0;
    this.packageTeensPrice = req.body.packageTeensPrice ? req.body.packageTeensPrice : 0;
    this.packageTeensRate = req.body.packageTeensRate ? req.body.packageTeensRate : 0;
    this.packageTeensTax = req.body.packageTeensTax ? req.body.packageTeensTax : 0;
    this.packageTeensTaxName = req.body.packageTeensTaxName ? req.body.packageTeensTaxName : null;
    // this.packageTeensId = req.body.packageTeensId ? req.body.packageTeensId : 0;
    // this.packageTeensRef = req.body.packageTeensRef ? req.body.packageTeensRef : null;
    this.numOfItems = req.body.numOfItems ? req.body.numOfItems : 0;
    this.isPackageEnabled = req.body.isPackageEnabled ? req.body.isPackageEnabled : 0;
    this.packageItems = req.body.packageItems ? req.body.packageItems : [];
  }
}
class deletePackage {
  constructor(req) {
    this.packageId = req.query.packageId ? req.query.packageId : 0;
  }
}
class getPackageDetails {
  constructor(req) {
    this.packageId = req.query.packageId ? req.query.packageId : 0;
  }
}


//discounts for booking panel
class addPanelDiscount {
  constructor(req) {
    this.panelDiscountTitle = req.body.panelDiscountTitle ? req.body.panelDiscountTitle : null;
    this.panelDiscountAmount = req.body.panelDiscountAmount ? req.body.panelDiscountAmount : 0;
    this.isDiscountEnabled = req.body.isDiscountEnabled ? req.body.isDiscountEnabled : 0;
    this.IsActive = req.body.IsActive ? req.body.IsActive : 0;
  }
}
class updatePanelDiscount {
  constructor(req) {
    this.discountId=req.body.discountId ? req.body.discountId :0;
    this.discountRef=req.body.discountRef ? req.body.discountRef :null;
    this.discountTitle = req.body.discountTitle ? req.body.discountTitle : null;
    this.discountAmount = req.body.discountAmount ? req.body.discountAmount : 0;
    this.isDiscountEnabled = req.body.isDiscountEnabled ? req.body.isDiscountEnabled : 0;
    this.IsActive = req.body.IsActive ? req.body.IsActive :0;
  }
}
class deletePanelDiscount {
  constructor(req) {
    this.discountId = req.query.discountId ? req.query.discountId : 0;
  }
}

//Future Booking Date
class addUpdateFutureBookingDate {
  constructor(req) {
    this.futureDateId=req.body.futureDateId ? req.body.futureDateId :0;
    this.startDate=req.body.startDate ? req.body.startDate :null;
    this.endDate = req.body.endDate ? req.body.endDate : null;
  }
}

//Outlet
class openOutlet {
  constructor(req) {
    this.outletDate=req.body.outletDate ? req.body.outletDate :null;
  }
}
class closeOutlet {
  constructor(req) {
    this.outletId=req.body.outletId ? req.body.outletId :0;
  }
}
class checkCurrentOutlet {
  constructor(req) {
    this.outletDate=req.query.outletDate ? req.query.outletDate :null;
  }
}

//Shift
class checkShiftForUser {
  constructor(req) {
    this.outletDate=req.query.outletDate ? req.query.outletDate :null;
    this.userId=req.query.userId ? req.query.userId :0;
    this.userType=req.query.userType ? req.query.userType :0;
  }
}
class openShift {
  constructor(req) {
    this.outletDate=req.body.outletDate ? req.body.outletDate :null;
    this.shiftTypeId=req.body.shiftTypeId ? req.body.shiftTypeId :0;
    this.userType=req.body.userType ? req.body.userType :0;
    this.userId=req.body.userId ? req.body.userId :0;
    this.openTime=req.body.openTime ? req.body.openTime :null;
  }
}
class closeShift {
  constructor(req) {
    this.outletId=req.body.outletId ? req.body.outletId :null;
    this.closeTime=req.body.closeTime ? req.body.closeTime :null;
    this.shiftId=req.body.shiftId ? req.body.shiftId :0;
    this.userTypeId=req.body.userTypeId ? req.body.userTypeId :0;
    this.userId=req.body.userId ? req.body.userId :0;
  }
}
class reopenShift {
  constructor(req) {
    this.outletId=req.body.outletId ? req.body.outletId :null;
    this.reopenTime=req.body.reopenTime ? req.body.reopenTime :null;
    this.shiftId=req.body.shiftId ? req.body.shiftId :0;
    this.userTypeId=req.body.userTypeId ? req.body.userTypeId :0;
    this.userId=req.body.userId ? req.body.userId :0;
  }
}
class recentShiftForOutlet {
  constructor(req) {
    this.outletDate=req.query.outletDate ? req.query.outletDate :null;
  }
}

//Agent settlement
class addUpdateAgentSettlement {
  constructor(req) {
    this.userId=req.body.userId ? req.body.userId :0;
    this.userTypeId=req.body.userTypeId ? req.body.userTypeId :0;
    this.agentName=req.body.agentName ? req.body.agentName :null;
    this.settlementAmount=req.body.settlementAmount ? req.body.settlementAmount :0;
    this.bookingDate=req.body.bookingDate ? req.body.bookingDate :null;
    this.bookingId=req.body.bookingId ? req.body.bookingId :null;
  }
}
class agentMonthlySettlement {
  constructor(req) {
    this.id=req.body.id ? req.body.id :0;
    this.userId=req.body.userId ? req.body.userId :0;
    this.referenceNum=req.body.referenceNum ? req.body.referenceNum :null;
    this.isSettled=req.body.isSettled ? req.body.isSettled :0;
  }
}
class getAgentSettlements {
  constructor(req) {
    this.bookingDate=req.query.bookingDate ? req.query.bookingDate :null;
    this.userTypeId=req.query.userTypeId ? req.query.userTypeId :0;
  }
}

//URL mapping
class shortenURL {
  constructor(req) {
    this.longURL = req.body.longURL ? req.body.longURL : null;
  }
}
class getLongURL {
  constructor(req) {
    this.shortCode = req.query.shortCode ? req.query.shortCode : null;
  }
}

//Agent Discount QR
class addAgentDiscount {
  constructor(req) {
    this.agentDiscountPercent = req.body.agentDiscountPercent ? req.body.agentDiscountPercent : 0;
    this.userId = req.body.userId ? req.body.userId : 0;
    this.userTypeId = req.body.userTypeId ? req.body.userTypeId : 0;
    this.isAgentDiscountEnabled = req.body.isAgentDiscountEnabled ? req.body.isAgentDiscountEnabled : 0;
    this.isActive = req.body.isActive ? req.body.isActive : 0;
  }
}
class updateAgentDiscount {
  constructor(req) {
    this.agentDiscountId = req.body.agentDiscountId ? req.body.agentDiscountId : 0;
    this.agentDiscountRef = req.body.agentDiscountRef ? req.body.agentDiscountRef : null;
    this.isAgentDiscountEnabled = req.body.isAgentDiscountEnabled ? req.body.isAgentDiscountEnabled : 0;
  }
}
class getAgentDiscount {
  constructor(req) {
    this.agentDiscountId = req.query.agentDiscountId ? req.query.agentDiscountId : 0;
    this.userId = req.query.userId ? req.query.userId : 0;
  }
}

class getAgentDiscountUsingDiscountCode {
  constructor(req) {
    this.agentDiscountCode = req.query.agentDiscountCode ? req.query.agentDiscountCode : "";
  }
}

class uploadAgentDiscountQRFile {
  constructor(req) {
    this.agentDiscountId = req.body.agentDiscountId ? req.body.agentDiscountId : 0;
  }
}

//users
// module.exports.getSitesResponse = getSites;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.getUser = getUser;
module.exports.getUserById = getUserById;
module.exports.getUserByPhone = getUserByPhone;
module.exports.addQRLink = addQRLink;
module.exports.countDriverBookings = countDriverBookings;
module.exports.uploadQRFile = uploadQRFile;


//discounts for website
module.exports.addWebsiteDiscount = addWebsiteDiscount;
module.exports.updateWebsiteDiscount = updateWebsiteDiscount;
module.exports.deleteWebsiteDiscount = deleteWebsiteDiscount;


//coupons
module.exports.deleteCoupon = deleteCoupon;
module.exports.getCouponByInitial = getCouponByInitial;
module.exports.addCoupon = addCoupon;
module.exports.updateCoupon = updateCoupon;
module.exports.updateUsedCoupons = updateUsedCoupons;


//Packages
module.exports.addPackage = addPackage;
module.exports.updatePackage = updatePackage;
module.exports.deletePackage = deletePackage;
module.exports.getPackageDetails = getPackageDetails;

//discounts for panel
module.exports.addPanelDiscount = addPanelDiscount;
module.exports.updatePanelDiscount = updatePanelDiscount;
module.exports.deletePanelDiscount = deletePanelDiscount;

//Future Booking Date
module.exports.addUpdateFutureBookingDate = addUpdateFutureBookingDate;


//Outlet
module.exports.openOutlet = openOutlet;
module.exports.closeOutlet = closeOutlet;
module.exports.checkCurrentOutlet = checkCurrentOutlet;


//Shift
module.exports.checkShiftForUser = checkShiftForUser;
module.exports.openShift = openShift;
module.exports.closeShift = closeShift;
module.exports.reopenShift = reopenShift;
module.exports.recentShiftForOutlet = recentShiftForOutlet;

//Agent Settlement
module.exports.addUpdateAgentSettlement = addUpdateAgentSettlement;
module.exports.agentMonthlySettlement = agentMonthlySettlement;
module.exports.getAgentSettlements = getAgentSettlements;

//URL MApping
module.exports.shortenURL = shortenURL;
module.exports.getLongURL = getLongURL;

//Agent Discount QR
module.exports.addAgentDiscount = addAgentDiscount;
module.exports.updateAgentDiscount = updateAgentDiscount;
module.exports.getAgentDiscount = getAgentDiscount;
module.exports.getAgentDiscountUsingDiscountCode = getAgentDiscountUsingDiscountCode;
module.exports.uploadAgentDiscountQRFile = uploadAgentDiscountQRFile;