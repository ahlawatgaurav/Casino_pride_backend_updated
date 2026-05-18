    //users
  class addUser {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class countDriverBookings {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateUser {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class deleteUser {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getUser {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getUserById {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getUserByPhone {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class addQRLink {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class uploadQRFile {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }

  //discounts for website
  class addWebsiteDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateWebsiteDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class deleteWebsiteDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class fetchWebsiteDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class fetchEnabledWebsiteDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }


  //coupons
  class fetchCoupons {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class deleteCoupon {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getCouponByInitial {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class addCoupon {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateCoupon {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateUsedCoupons {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }

  //Package
  class fetchPackages {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class addPackage {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updatePackage {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class deletePackage {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getPackageDetails {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }

    //discounts for Panel
    class addPanelDiscount {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class updatePanelDiscount {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class deletePanelDiscount {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class fetchPanelDiscount {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class getEnabledPanelDiscounts {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }


    //Future booking date
    class fetchFutureBookingDate {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class addUpdateFutureBookingDate {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }

    //Outlets
    class openOutlet {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class closeOutlet {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class checkCurrentOutlet {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class checkActiveOutlet {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
  
    //Shifts
    class checkShiftForUser {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class openShift {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class closeShift {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class reopenShift {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class recentShiftForOutlet {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }

    //Agent Settlement
    class addUpdateAgentSettlement {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class agentMonthlySettlement {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
    class getAgentSettlements {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }

    //URL mapping
    class shortenURL {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
  
    class getLongURL {
      constructor() {
        (this.Error = null), (this.Details = null);
      }
    }
  
  //Agent Discount QR
  class addAgentDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class updateAgentDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getAgentDiscount {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class getAgentDiscountUsingDiscountCode {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  class uploadAgentDiscountQRFile {
    constructor() {
      (this.Error = null), (this.Details = null);
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


//discounts for booking website
module.exports.addWebsiteDiscount = addWebsiteDiscount;
module.exports.updateWebsiteDiscount = updateWebsiteDiscount;
module.exports.deleteWebsiteDiscount = deleteWebsiteDiscount;
module.exports.fetchWebsiteDiscount = fetchWebsiteDiscount;
module.exports.fetchEnabledWebsiteDiscount = fetchEnabledWebsiteDiscount;

//coupons
module.exports.fetchCoupons = fetchCoupons;
module.exports.deleteCoupon = deleteCoupon;
module.exports.getCouponByInitial = getCouponByInitial;
module.exports.addCoupon = addCoupon;
module.exports.updateCoupon = updateCoupon;
module.exports.updateUsedCoupons = updateUsedCoupons;

//Packages
module.exports.fetchPackages = fetchPackages;
module.exports.addPackage = addPackage;
module.exports.updatePackage = updatePackage;
module.exports.deletePackage = deletePackage;
module.exports.getPackageDetails = getPackageDetails;

//discounts for booking panel
module.exports.addPanelDiscount = addPanelDiscount;
module.exports.updatePanelDiscount = updatePanelDiscount;
module.exports.deletePanelDiscount = deletePanelDiscount;
module.exports.fetchPanelDiscount = fetchPanelDiscount;
module.exports.getEnabledPanelDiscounts = getEnabledPanelDiscounts;

//Future Booking Date
module.exports.fetchFutureBookingDate = fetchFutureBookingDate;
module.exports.addUpdateFutureBookingDate = addUpdateFutureBookingDate;


//Outlets
module.exports.openOutlet = openOutlet;
module.exports.closeOutlet = closeOutlet;
module.exports.checkCurrentOutlet = checkCurrentOutlet;
module.exports.checkActiveOutlet = checkActiveOutlet;

//Shifts
module.exports.checkShiftForUser = checkShiftForUser;
module.exports.openShift = openShift;
module.exports.closeShift = closeShift;
module.exports.reopenShift = reopenShift;
module.exports.recentShiftForOutlet = recentShiftForOutlet;

//Agent Settlement
module.exports.addUpdateAgentSettlement = addUpdateAgentSettlement;
module.exports.agentMonthlySettlement = agentMonthlySettlement;
module.exports.getAgentSettlements = getAgentSettlements;

//URL mapping
module.exports.shortenURL = shortenURL;
module.exports.getLongURL = getLongURL;

//Agent Discount QR
module.exports.addAgentDiscount = addAgentDiscount;
module.exports.updateAgentDiscount = updateAgentDiscount;
module.exports.getAgentDiscount = getAgentDiscount;
module.exports.getAgentDiscountUsingDiscountCode = getAgentDiscountUsingDiscountCode;
module.exports.uploadAgentDiscountQRFile = uploadAgentDiscountQRFile;