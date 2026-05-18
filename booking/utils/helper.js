const applib = require("applib");
const { EmailCreds, billingInternalMails } = require("./settings");
const nodemailer = require("nodemailer");

const response = (functionContext, responseObj, resolvedResult) => {
  const logger = functionContext.logger;

  logger.logInfo(`${responseObj.name}Response() invoked!`);

  let functionResponse = responseObj.model;

  if (functionContext.error) {
    functionResponse.Error = functionContext.error;
    functionResponse.Details = null;
  } else {
    functionResponse.Error = null;
    functionResponse.Details = resolvedResult;
  }

  applib.SendHttpResponse(functionContext, functionResponse);

  // logger.logInfo(
  //   `${responseObj.name}Response() response :: ${JSON.stringify(
  //     functionResponse
  //   )}`
  // );

  logger.logInfo(`${responseObj.name}Response() completed`);
};

module.exports.sendBookingConfirmationMail = (sendBookingMailRequest, functionContext, responseObj) => {
  const logger = functionContext.logger;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EmailCreds.username,
      pass: EmailCreds.password,
    },
  });

  const mailOptions = {
    from: EmailCreds.username,
    to: billingInternalMails.join(','),
    subject: "Casino Pride New Booking Details",
    text: `New Booking is made on the platform. Below are the details: \n
    Full Name: ${sendBookingMailRequest.fullName} \n
    Email: ${sendBookingMailRequest.email} \n
    Phone: ${sendBookingMailRequest.phone} \n
    Package Name: ${sendBookingMailRequest.packageName} \n
    Package Guest Counts: ${sendBookingMailRequest.packageGuestCounts} \n
    Amount: ${sendBookingMailRequest.amount} \n
    Transaction Id: ${sendBookingMailRequest.transactionId} \n
    Guest Count: ${sendBookingMailRequest.guestCount} \n
    Teens: ${sendBookingMailRequest.numOfTeens} \n
    Booking Date: ${sendBookingMailRequest.bookingDate} \n
    Event Date: ${sendBookingMailRequest.eventDate} \n\n
    Lets Play with Pride!\nGood Luck\nCPGOAA`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("inside error=>", error);
      logger.logInfo(
        `notifyUsers() :: Email not sent :: Error :: ${error} !`
      );
      functionContext.error = new ErrorModel(error, "400");

      return response(functionContext, responseObj, null);
      
      // return { paramFunctionContext: functionContext, paramResponseObj: responseObj, responseData : null };
    } else {      
      console.log("notifySellers>>Email sent:check it ", info.response);

      logger.logInfo(
        `notifySellers() :: Email sent :: Success :: ${info.response} !`
      );
      
      return response(functionContext, responseObj,  {
        Status: "Email sent",
        SuccessCode: 200,
        });
      // return { paramFunctionContext: functionContext, paramResponseObj: responseObj, responseData :  {
      //   Status: "Email sent",
      //   SuccessCode: 200,
      //   }
      // };
      
    }
  });
}

module.exports.response = response;
