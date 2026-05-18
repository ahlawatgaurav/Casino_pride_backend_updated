    // Billing
  class addBillingDetails {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getBillingDetails {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class uploadBillFile {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
 
  class updateBillingDetails {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class voidBill {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateBillIdForVoid {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class sendBillMail {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateItemDetailsBill {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class noShowGuestList {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class fetchVoidBill {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
 
  //Payment
  class addPaymentDetails {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updatePaymentDetails {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateBookingId {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  
  //reports
  class generateReports {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class generateNoShowReport {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class cashierReport {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class cashierReportShiftWise {
    constructor() {
      (this.Error = null), (this.Details = null);
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
module.exports.fetchVoidBill = fetchVoidBill;

//Payment
module.exports.addPaymentDetails = addPaymentDetails;
module.exports.updatePaymentDetails = updatePaymentDetails;
module.exports.updateBookingId = updateBookingId;

//reports
module.exports.generateReports = generateReports;
module.exports.generateNoShowReport = generateNoShowReport;
module.exports.cashierReport = cashierReport;
module.exports.cashierReportShiftWise = cashierReportShiftWise;

