module.exports.errorCode = {
    applicationError: 500,
    dbError: 10005,
    invalidRequest: 10006,
    noUser : 10007,
    noUserType : 10008,
    noPackage:10009,
    noBooking:10010,
    noBookingExists:10011,
    userBanned:10012,
  };
  
  module.exports.errorMessage = {
    applicationError: "An Application Error Has Occured",
    dbError: "Database function error",
    invalidRequest: "Invalid Request",
    noUser :"User does not exist",
    noUserType :"UserType does not exist",
    noPackage :"Package does not exist",
    noBooking :"Booking Does not exist",
    noBookingExists:"No Bookings For Selected Date",
    userBanned: "User is banned",
  };