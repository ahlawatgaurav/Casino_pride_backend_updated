// Billing
  class addBillingDetails {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.packageId = req.body.packageId ? req.body.packageId : null;
      this.packageGuestCount = req.body.packageGuestCount ? req.body.packageGuestCount : null;
      this.packageWeekdayPrice = req.body.packageWeekdayPrice ? req.body.packageWeekdayPrice : null;
      this.packageWeekendPrice = req.body.packageWeekendPrice ? req.body.packageWeekendPrice : null;
      this.totalGuestCount = req.body.totalGuestCount ? req.body.totalGuestCount : 0;
      this.teensCount = req.body.teensCount ? req.body.teensCount : 0;
      this.bookingDate = req.body.bookingDate ? req.body.bookingDate : null;
      this.billingDate = req.body.billingDate ? req.body.billingDate : null;
      this.actualAmount = req.body.actualAmount ? req.body.actualAmount : 0;
      this.amountAfterDiscount = req.body.amountAfterDiscount ? req.body.amountAfterDiscount : 0;
      this.discount = req.body.discount ? req.body.discount : 0;
      // this.billNumber = req.body.billNumber ? req.body.billNumber : null;
         }
  }
  class getBillingDetails {
    constructor(req) {
      this.billId = req.query.billId ? req.query.billId : 0;
      this.userId = req.query.userId ? req.query.userId : 0;
      this.billingDate = req.query.billingDate ? req.query.billingDate : null;
      this.futureDate = req.query.futureDate ? req.query.futureDate : null;
      this.shiftId = req.query.shiftId ? req.query.shiftId : 0;
      this.isBookingWebsite = req.query.isBookingWebsite ? req.query.isBookingWebsite : 0;
      // this.billNumber = req.body.billNumber ? req.body.billNumber : null;
      this.fromDate = req.query.fromDate ? req.query.fromDate : null;
      this.toDate = req.query.toDate ? req.query.toDate : null;
//    	this.methodOfPayment = req.query.methodOfPayment || null; // new line added
         }
  }
 
  class uploadBillFile {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      // this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      
    }
  }
  
  class updateBillingDetails {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
         }
  }
  class voidBill {
    constructor(req) {
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.voidBillReason = req.body.voidBillReason ? req.body.voidBillReason : null;
         }
  }
  class updateBillIdForVoid {
    constructor(req) {
      this.voidBillId = req.body.voidBillId ? req.body.voidBillId : 0;
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      this.newBillId = req.body.newBillId ? req.body.newBillId : 0;
         }
  }
  class sendBillMail {
    constructor(req) {
      this.receiverMail = req.body.receiverMail ? req.body.receiverMail : null;
      this.amount = req.body.amount ? req.body.amount : 0;
      this.billFile = req.body.billFile ? req.body.billFile : null;
         }
  }
  class updateItemDetailsBill {
    constructor(req) {
      this.billId = req.body.billId ? req.body.billId : null;
      this.updatedItemDetails = req.body.updatedItemDetails ? req.body.updatedItemDetails : null;
         }
  }
  class noShowGuestList {
    constructor(req) {
      this.eventDate = req.query.eventDate ? req.query.eventDate : null;
         }
  }

  //Payments
  class addPaymentDetails {
    constructor(req) {
      // this.transactionId = req.body.transactionId ? req.body.transactionId : null;
      // this.paymentMode = req.body.paymentMode ? req.body.paymentMode : null;
      // this.paymentStatus = req.body.paymentStatus ? req.body.paymentStatus : null;
      // this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
      // this.amount = req.body.amount ? req.body.amount : 0;
      this.transactionId = req.body.mihpayid ? req.body.mihpayid : null;
      this.paymentMode = req.body.mode ? req.body.mode : null;
      this.paymentStatus = req.body.status ? req.body.status : null;
      this.bankCode = req.body.bankcode ? req.body.bankcode : null;
      this.field1 = req.body.field1 ? req.body.field1 : null;
      this.firstname = req.body.firstname ? req.body.firstname : null;
      this.amount = req.body.amount ? req.body.amount : 0;
      this.bookingId = req.body.productinfo ? req.body.productinfo : null;
      
    }
  }
  class updatePaymentDetails {
    constructor(req) {
      this.paymentId = req.body.paymentId ? req.body.paymentId : 0;
      this.paymentRef = req.body.paymentRef ? req.body.paymentRef : null;
      this.paymentMode = req.body.paymentMode ? req.body.paymentMode : null;
      this.paymentStatus = req.body.paymentStatus ? req.body.paymentStatus : null;      
    }
  }
  class updateBookingId {
    constructor(req) {
      this.paymentId = req.body.paymentId ? req.body.paymentId : 0;
      this.transactionId = req.body.transactionId ? req.body.transactionId : null;
      this.bookingId = req.body.bookingId ? req.body.bookingId : 0;
    }
  }

//report
class generateReports {
  constructor(req) {
    this.userId = req.body.userId ? req.body.userId : 0;
    this.userType = req.body.userType ? req.body.userType : 0;
    this.billDate = req.body.billDate ? req.body.billDate : null;
    this.futureDate = req.body.futureDate ? req.body.futureDate : null;
    this.shiftId = req.body.shiftId ? req.body.shiftId : 0;
    this.reportTypeId = req.body.reportTypeId ? req.body.reportTypeId : 0;
    this.fromDate = req.body.fromDate ? req.body.fromDate : null;
    this.toDate = req.body.toDate ? req.body.toDate : null;
    this.isSettlementReport = req.body.isSettlementReport ? req.body.isSettlementReport : 0;
    this.settlementDate = req.body.settlementDate ? req.body.settlementDate : null;
    this.settlementUpdateDate = req.body.settlementUpdateDate ? req.body.settlementUpdateDate : null;
    this.isAgentPanel = req.body.isAgentPanel ? req.body.isAgentPanel : 0;
    this.settlementMonth = req.body.settlementMonth ? req.body.settlementMonth : null;// agent settlement new 
	  this.userTypeRole = req.body.userTypeRole ? req.body.userTypeRole : 0;
  }
}
class generateNoShowReport {
  constructor(req) {
    this.eventDate = req.query.eventDate ? req.query.eventDate : null; 
    this.reportTypeId = req.query.reportTypeId ? req.query.reportTypeId : 0; 
  }
}
class cashierReport {
  constructor(req) {
    this.date = req.query.date ? req.query.date : null; 
    this.reportTypeId = req.query.reportTypeId ? req.query.reportTypeId : 0; 
  }
}
class cashierReportShiftWise {
  constructor(req) {
    this.date = req.query.date ? req.query.date : null; 
    this.shiftId = req.query.shiftId ? req.query.shiftId : null; 
    this.reportTypeId = req.query.reportTypeId ? req.query.reportTypeId : 0; 
  }
}

// Billing
module.exports.addBillingDetails = addBillingDetails;
module.exports.getBillingDetails = getBillingDetails;
module.exports.uploadBillFile = uploadBillFile;
module.exports.updateBillingDetails = updateBillingDetails;
module.exports.voidBill = voidBill;
module.exports.updateBillIdForVoid = updateBillIdForVoid;
module.exports.sendBillMail = sendBillMail;
module.exports.updateItemDetailsBill = updateItemDetailsBill;
module.exports.noShowGuestList = noShowGuestList;

//Payments
module.exports.addPaymentDetails = addPaymentDetails;
module.exports.updatePaymentDetails = updatePaymentDetails;
module.exports.updateBookingId = updateBookingId;

//report
module.exports.generateReports = generateReports;
module.exports.generateNoShowReport = generateNoShowReport;
module.exports.cashierReport = cashierReport;
module.exports.cashierReportShiftWise = cashierReportShiftWise;

