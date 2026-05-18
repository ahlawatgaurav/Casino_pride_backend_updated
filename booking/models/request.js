// Booking
  class newBooking {
    constructor(req) {
      this.guestName = req.body.guestName ? req.body.guestName : null;
      this.address = req.body.address ? req.body.address : null;
      this.countryCode = req.body.countryCode ? req.body.countryCode : null;
      this.phone = req.body.phone ? req.body.phone : null;
      this.email = req.body.email ? req.body.email : null;
      this.dob = req.body.dob ? req.body.dob : null;
      this.country = req.body.country ? req.body.country : null;
      this.state = req.body.state ? req.body.state : null;
      this.city = req.body.city ? req.body.city : null;
      this.GSTNumber = req.body.GSTNumber ? req.body.GSTNumber : null;
      this.governmentId = req.body.governmentId ? req.body.governmentId : null;
      this.totalGuestCount = req.body.totalGuestCount ? req.body.totalGuestCount : 0;
      // this.numOfKids = req.body.numOfKids ? req.body.numOfKids : 0;
      this.numOfTeens = req.body.numOfTeens ? req.body.numOfTeens : 0;
      this.discountId = req.body.discountId ? req.body.discountId : 0;
      this.panelDiscountId = req.body.panelDiscountId ? req.body.panelDiscountId : 0;
      this.couponId = req.body.couponId ? req.body.couponId : 0;
      this.discount = req.body.discount ? req.body.discount : 0;
      this.referredBy = req.body.referredBy ? req.body.referredBy : null;
      this.settledByCompany = req.body.settledByCompany ? req.body.settledByCompany : 0;
      this.agentPanelDiscount = req.body.agentPanelDiscount ? req.body.agentPanelDiscount : 0;
      this.localAgentName = req.body.localAgentName ? req.body.localAgentName : null;
      this.localAgentId = req.body.localAgentId ? req.body.localAgentId : 0;
      this.travelAgentName = req.body.travelAgentName ? req.body.travelAgentName : null;
      this.travelAgentId = req.body.travelAgentId ? req.body.travelAgentId : 0;
      this.packageId = req.body.packageId ? req.body.packageId : null;
      this.packageName = req.body.packageName ? req.body.packageName : null;
      this.packageGuestCount = req.body.packageGuestCount ? req.body.packageGuestCount : null;
      this.packageWeekdayPrice = req.body.packageWeekdayPrice ? req.body.packageWeekdayPrice : null;
      this.packageWeekendPrice = req.body.packageWeekendPrice ? req.body.packageWeekendPrice : null;
      // this.ackFile = req.body.ackFile ? req.body.ackFile : null;
      this.userId = req.body.userId ? req.body.userId : 0;
      this.userTypeId = req.body.userTypeId ? req.body.userTypeId : 0;
      this.isBookingWebsite = req.body.isBookingWebsite ? req.body.isBookingWebsite : 0;
      this.bookingDate = req.body.bookingDate ? req.body.bookingDate : null;
      this.futureDate = req.body.futureDate ? req.body.futureDate : null;
      this.shiftId = req.body.shiftId ? req.body.shiftId : 0;
      this.teensPrice = req.body.teensPrice ? req.body.teensPrice : 0;
      this.teensRate = req.body.teensRate ? req.body.teensRate : 0;
      this.teensTax = req.body.teensTax ? req.body.teensTax : 0;
      this.teensTaxName = req.body.teensTaxName ? req.body.teensTaxName : null;
      this.actualAmount = req.body.actualAmount ? req.body.actualAmount : 0;
      this.amountAfterDiscount = req.body.amountAfterDiscount ? req.body.amountAfterDiscount : 0;
      this.payAtCounter = req.body.payAtCounter ? req.body.payAtCounter : 0;
      this.paymentMode = req.body.paymentMode ? req.body.paymentMode : null;
      this.cashAmount = req.body.cashAmount ? req.body.cashAmount : 0;
      this.cardAmount = req.body.cardAmount ? req.body.cardAmount : 0;
      this.UPIAmount = req.body.UPIAmount ? req.body.UPIAmount : 0;
      this.UPIId = req.body.UPIId ? req.body.UPIId : null;
      this.cardHoldersName = req.body.cardHoldersName ? req.body.cardHoldersName : null;
      this.cardNumber = req.body.cardNumber ? req.body.cardNumber : null;
      this.cardType = req.body.cardType ? req.body.cardType : null;
      this.isActive = req.body.isActive ? req.body.isActive : 0;
    }
  }

  class getUserById {
    constructor(req) {
      this.userId = req.body.userId ? req.body.userId : 0;
    }
  }
  
  class checkBannedUser {
    constructor(req) {
      this.phone = req ? req : 0;
    }
  }
  class getUserByPhone {
    constructor(req) {
      this.phone = req.query.phone ? req.query.phone : 0;
    }
  }

  class getBookingLink {
    constructor(req) {
      this.shortCode = req.query.shortCode ? req.query.shortCode : 0;
    }
  }

  class disableBooking {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
    }
  }
  class getBookingDetails {
    constructor(req) {
      this.bookingId = req.query.bookingId ? req.query.bookingId : 0;
      
    }
  }
  class fetchBookings {
    constructor(req) {
      this.futureDate = req.query.futureDate ? req.query.futureDate : null;
      
    }
  }

  class sendBookingInternalMail {
    constructor(req) {
      this.amount = req.body.amount ? req.body.amount : 0;
      this.packageName = req.body.packageName ? req.body.packageName : null;
      this.guestCount = req.body.guestCount ? req.body.guestCount : 0;
      this.eventDate = req.body.eventDate ? req.body.eventDate : null;
      this.bookingDate = req.body.bookingDate ? req.body.bookingDate : null;
    }
  }
  class uploadACKFile {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      // this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      
    }
  }
  class updateBooking {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.guestName = req.body.guestName ? req.body.guestName : null;
      this.address = req.body.address ? req.body.address : null;
      this.dob = req.body.dob ? req.body.dob : null;
      this.country = req.body.country ? req.body.country : null;
      this.state = req.body.state ? req.body.state : null;
      this.city = req.body.city ? req.body.city : null;
      this.GSTNumber = req.body.GSTNumber ? req.body.GSTNumber : null;
      this.governmentId = req.body.governmentId ? req.body.governmentId : null;
      this.isActive = req.body.isActive ? req.body.isActive : 0;
      this.totalGuestCount = req.body.totalGuestCount ? req.body.totalGuestCount : 0;
      this.numOfTeens = req.body.numOfTeens ? req.body.numOfTeens : 0;
      this.packageId = req.body.packageId ? req.body.packageId : null;
      this.packageName = req.body.packageName ? req.body.packageName : null;
      this.packageGuestCount = req.body.packageGuestCount ? req.body.packageGuestCount : null;
      this.packageWeekdayPrice = req.body.packageWeekdayPrice ? req.body.packageWeekdayPrice : null;
      this.packageWeekendPrice = req.body.packageWeekendPrice ? req.body.packageWeekendPrice : null;
      this.shiftId = req.body.shiftId ? req.body.shiftId : 0;
      this.teensPrice = req.body.teensPrice ? req.body.teensPrice : 0;
      this.teensRate = req.body.teensRate ? req.body.teensRate : 0;
      this.teensTax = req.body.teensTax ? req.body.teensTax : 0;
      this.teensTaxName = req.body.teensTaxName ? req.body.teensTaxName : null;
      this.actualAmount = req.body.actualAmount ? req.body.actualAmount : 0;
      this.amountAfterDiscount = req.body.amountAfterDiscount ? req.body.amountAfterDiscount : 0;
      this.paymentMode = req.body.paymentMode ? req.body.paymentMode : null;
      this.cashAmount = req.body.cashAmount ? req.body.cashAmount : 0;
      this.cardAmount = req.body.cardAmount ? req.body.cardAmount : 0;
      this.UPIAmount = req.body.UPIAmount ? req.body.UPIAmount : 0;

    }
  }
  class sendACKMail {
    constructor(req) {
      this.receiverEmail = req.body.receiverEmail ? req.body.receiverEmail : null;
      this.amount = req.body.amount ? req.body.amount : 0;
      this.ackFile = req.body.ackFile ? req.body.ackFile : null;
    }
  }
  class getBookingsForUser {
    constructor(req) {
      this.userId = req.query.userId ? req.query.userId : null;
      this.date = req.query.date ? req.query.date : null;
      
    }
  }
  class getAcknowledgementLink {
    constructor(req) {
      this.bookingId = req.query.bookingId ? req.query.bookingId : 0;
      
    }
  }
  class updateBookingForPayAtCounter {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.paymentMode = req.body.paymentMode ? req.body.paymentMode : null;
      this.cashAmount = req.body.cashAmount ? req.body.cashAmount : 0;
      this.cardAmount = req.body.cardAmount ? req.body.cardAmount : 0;
      this.UPIAmount = req.body.UPIAmount ? req.body.UPIAmount : 0;
      this.UPIId = req.body.UPIId ? req.body.UPIId : null;
      this.cardHoldersName = req.body.cardHoldersName ? req.body.cardHoldersName : null;
      this.cardNumber = req.body.cardNumber ? req.body.cardNumber : null;
      this.cardType = req.body.cardType ? req.body.cardType : null;
      this.settleByCompany =req.body.settleByCompany ? req.body.settleByCompany : 0;
    }
  }
  class updateShiftForBooking {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.shiftTypeId = req.body.shiftTypeId ? req.body.shiftTypeId : 0;
    }
  }

  class SendPaymentLinkToCustomer {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.phone = req.body.phone ? req.body.phone : null;
    }
  }

// Booking
module.exports.newBooking = newBooking;
module.exports.checkBannedUser = checkBannedUser;
module.exports.getUserByPhone = getUserByPhone;
module.exports.getBookingDetails = getBookingDetails;
module.exports.fetchBookings = fetchBookings;
module.exports.uploadACKFile = uploadACKFile;
module.exports.updateBooking = updateBooking;
module.exports.sendACKMail = sendACKMail;
module.exports.getBookingsForUser = getBookingsForUser;
module.exports.getAcknowledgementLink = getAcknowledgementLink;
module.exports.updateBookingForPayAtCounter = updateBookingForPayAtCounter;
module.exports.updateShiftForBooking = updateShiftForBooking;
module.exports.sendBookingInternalMail = sendBookingInternalMail;
module.exports.getUserById = getUserById;
module.exports.disableBooking = disableBooking;
module.exports.SendPaymentLinkToCustomer = SendPaymentLinkToCustomer;
module.exports.getBookingLink = getBookingLink;
