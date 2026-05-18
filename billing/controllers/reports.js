const applib = require("applib");
const momentTimezone = require("moment-timezone");

const { errorMessage, errorCode } = require("../utils/constant");
const { response, generateToken } = require("../utils/helper");
const { ErrorModel } = require("../models/error");

const requestModel = require("../models/request");
const responseModel = require("../models/response");
const reportsService = require("../services/reports");
const billingService = require("../services/billing");

const validate = require("../utils/validation");

const FileUploadFunction = require("../utils/fileUpload").FileUploadFunction;
const fs = require("fs");
const reports = require("applib/reports");
const AWS = require("aws-sdk");

const reportsRowWise = require("../utils/Reports");
const { title } = require("process");

const reportsController = {
  generateReports: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);
     console.log('start api',new Date())
    logger.logInfo(`generateReports() invoked!!`);
    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "generateReports",
      model: new responseModel.generateReports(),
    };

    let generateReportsRequest = new requestModel.generateReports(req);

    // logger.logInfo(`generateReports() :: Request Object :: ${generateReportsRequest}`);

    let validateRequest = validate.generateReports(generateReportsRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `generateReports() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }
 console.log('end api',new Date())
    try {
      let generateReportsDBResult = [];
      let TeensTax = null;
      //Generate Report By user
      if (
        generateReportsRequest.userId != 0 &&
        generateReportsRequest.billDate == null &&
        generateReportsRequest.futureDate == null &&
        generateReportsRequest.shiftId == 0 &&
        generateReportsRequest.reportTypeId != 0 &&
        generateReportsRequest.fromDate == null &&
        generateReportsRequest.toDate == null &&
        generateReportsRequest.isSettlementReport == 0 &&
        generateReportsRequest.settlementDate == null &&
        generateReportsRequest.settlementUpdateDate == null
      ) {
        generateReportsDBResult = await reportsService.generateReportsByUser(
          functionContext,
          generateReportsRequest
        );
        // Process and modify the ItemDetails property
        generateReportsDBResult.forEach((item) => {
          TeensTax = item.TeensTax;
          const itemDetails =
            item?.UpdatedItemDetails != null &&
            JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));
          if (Object.keys(itemDetails).length !== 0) {
            // Extract key-value pairs and assign them to UpdatedItemDetails
            item.UpdatedItemDetails = Object.entries(itemDetails)
              .map(([key, value]) => {
                // Add each key as a separate column
                item[key] = value;
                return `${key}:${value}`;
              })
              .join(", ");
          } else {
            item.UpdatedItemDetails = ""; // Set to an empty string if it's empty or '{}'
          }
          // Remove square brackets and quotes from PackageGuestCount
          item.PackageGuestCount = item.PackageGuestCount.replace(
            /\[|\]|"/g,
            ""
          );
          item.gstTaxable = item?.ItemTaxName === "GST" ? item?.Rate : null;
          item.vatTaxable = item?.ItemTaxName === "VAT" ? item?.Rate : null;
          // Remove square brackets and quotes from PackageName
          item.PackageName = item.PackageName.replace(/\[|\]|"/g, "");
        });
        const rateSum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Rate" value to a number and add it to the sum
          const rate = parseFloat(item.Rate);
          return isNaN(rate) ? sum : sum + rate;
        }, 0);
        const gstTaxableSum = generateReportsDBResult.reduce((sum, item) => {
          const gstTaxable =
            item.ItemTaxName === "GST" ? parseFloat(item.Rate) : 0;
          return isNaN(gstTaxable) ? sum : sum + gstTaxable;
        }, 0);

        const vatTaxableSum = generateReportsDBResult.reduce((sum, item) => {
          const vatTaxable =
            item.ItemTaxName === "VAT" ? parseFloat(item.Rate) : 0;
          return isNaN(vatTaxable) ? sum : sum + vatTaxable;
        }, 0);
        // Calculate the sum of the "CGST 14 %" column
        const cgst14Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "CGST 14 %" value to a number and add it to the sum
          const cgst14 = parseFloat(item["CGST 14 %"]);
          return isNaN(cgst14) ? sum : sum + cgst14;
        }, 0);
        // Calculate the sum of the "SGST 14 %" column
        const sgst14Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "SGST 14 %" value to a number and add it to the sum
          const sgst14 = parseFloat(item["SGST 14 %"]);
          return isNaN(sgst14) ? sum : sum + sgst14;
        }, 0);

        // Calculate the sum of the "CGST 9 %" column
        const cgst9Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "CGST 9 %" value to a number and add it to the sum
          const cgst9 = parseFloat(item[`Kids CGST ${item.KidsTax} %`]);
          return isNaN(cgst9) ? sum : sum + cgst9;
        }, 0);

        // Calculate the sum of the "SGST 9 %" column
        const sgst9Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "SGST 9 %" value to a number and add it to the sum
          const sgst9 = parseFloat(item[`Kids SGST ${item.KidsTax} %`]);
          return isNaN(sgst9) ? sum : sum + sgst9;
        }, 0);

        // Calculate the sum of the "VAT 22 %" column
        const vat22Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "VAT 22 %" value to a number and add it to the sum
          const vat22 = parseFloat(item["VAT 22 %"]);
          return isNaN(vat22) ? sum : sum + vat22;
        }, 0);

        // Calculate the sum of the "Kids Rate" column
        const kidsRateSum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Kids Rate" value to a number and add it to the sum
          const kidsRate = parseFloat(item["KidsRate"]);
          return isNaN(kidsRate) ? sum : sum + kidsRate;
        }, 0);

        // Calculate the sum of the "Total Bill Amount" column
        const totalBillAmountSum = generateReportsDBResult.reduce(
          (sum, item) => {
            // Convert the "Total Bill Amount" value to a number and add it to the sum
            const totalBillAmount = parseFloat(item["TotalBillAmount"]);
            return isNaN(totalBillAmount) ? sum : sum + totalBillAmount;
          },
          0
        );
        const totalCashAmount = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalCashAmount = parseFloat(item["cashAmount"]);
          return isNaN(totalCashAmount) ? sum : sum + totalCashAmount;
        }, 0);
        const totalCardAmount = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalCardAmount = parseFloat(item["cardAmount"]);
          return isNaN(totalCardAmount) ? sum : sum + totalCardAmount;
        }, 0);
        const totalUPIAmount = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalUPIAmount = parseFloat(item["upiAmount"]);
          return isNaN(totalUPIAmount) ? sum : sum + totalUPIAmount;
        }, 0);

        const totalSettleByCompany = generateReportsDBResult.reduce(
          (sum, item) => {
            // Convert the "Total Bill Amount" value to a number and add it to the sum
            const totalSettleByCompany = parseFloat(item["settledByCompany"]);
            return isNaN(totalSettleByCompany)
              ? sum
              : sum + totalSettleByCompany;
          },
          0
        );

        const totalOnlinePayu = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalOnlinePayu = parseFloat(item["onlinePayu"]);
          return isNaN(totalOnlinePayu) ? sum : sum + totalOnlinePayu;
        }, 0);
        // Add two empty rows
        generateReportsDBResult.push({}, {});
        // Add the sum to the report data
        // generateReportsDBResult.push({ Rate: rateSum });

        // Create a new object with "Total" label and sums for relevant columns
        const totalRow = {
          BillNumber: "Total",
          gstTaxable: gstTaxableSum,
          vatTaxable: vatTaxableSum,
          "CGST 14 %": cgst14Sum,
          "SGST 14 %": sgst14Sum,
          [`Kids CGST ${TeensTax / 2} %`]: cgst9Sum,
          [`Kids SGST ${TeensTax / 2} %`]: sgst9Sum,
          "VAT 22 %": vat22Sum,
          KidsRate: kidsRateSum,
          TotalBillAmount: totalBillAmountSum,
          cashAmount: totalCashAmount,
          cardAmount: totalCardAmount,
          upiAmount: totalUPIAmount,
          settledByCompany: totalSettleByCompany,
          onlinePayu: totalOnlinePayu,
          // Add more properties for other columns as needed
        };

        // Add the "Total" row to the beginning of the array
        // generateReportsDBResult.unshift(totalRow);

        // Add the "Total" row to the end of the array
        generateReportsDBResult.push(totalRow);

        const data = await reports.generateCSVReport(
          [
            // { id: "BillingId", title: "BillingId" },
            { id: "BillNumber", title: "BillNumber" },
            { id: "ActualBillingDate", title: "Billing Date" },
            { id: "ActualBillingTime", title: "Billing Time" },
            { id: "IsVoid", title: "Is Void" },
            { id: "GuestName", title: "Guest Name" },
            { id: "TotalGuestCount", title: "Total Guest Count" },
            { id: "cashAmount", title: "Cash Amount" },
            { id: "cardAmount", title: "Card Amount" },
            { id: "upiAmount", title: "UPI Amount" },
            { id: "onlinePayu", title: "Online Payu" },
            { id: "settledByCompany", title: "Settle By Company" },
            { id: "TotalBillAmount", title: "Total Bill Amount" },
            { id: "PaymentMode", title: "Payment Mode" },
            { id: "ShiftId", title: "Shift Type" },
            { id: "upiId", title: "UPI Id" },
            { id: "cardHoldersName", title: "CardHolders Name" },
            { id: "cardNumber", title: "Card Number" },
            { id: "cardType", title: "Card Type" },
            { id: "PackageName", title: "PackageName" },
            { id: "ItemName", title: "Item Name" },
            { id: "packageGuestCount", title: "Package Guest Count" },
            { id: "KidsCount", title: "Kids Count" },
            { id: "KidsItemName", title: "Kids Item Name" },
            { id: "KidsRate", title: "Kids Rate" },
            { id: "gstTaxable", title: "GST Taxable" },
            { id: "vatTaxable", title: "VAT Taxable" },
            // { id: "Rate", title: "Rate" },
            { id: "CGST 14 %", title: "CGST 14 %" },
            { id: "SGST 14 %", title: "SGST 14 %" },
            {
              id: [`Kids CGST ${TeensTax / 2} %`],
              title: [`Kids CGST ${TeensTax / 2} %`],
            },
            {
              id: [`Kids SGST ${TeensTax / 2} %`],
              title: [`Kids SGST ${TeensTax / 2} %`],
            },
            { id: "VAT 22 %", title: "VAT 22 %" },
            { id: "ItemTaxName", title: "TaxName" },
            { id: "ItemTax", title: "ItemTax" },
            { id: "Address", title: "Address" },
            { id: "Phone", title: "Guest Phone" },
            { id: "Email", title: "Guest Email" },
            { id: "GSTNumber", title: "GST Number" },
            { id: "BookingId", title: "BookingId" },
            { id: "LocalAgentName", title: "LocalAgentName" },
            { id: "TravelAgentName", title: "TravelAgentName" },
            { id: "UsersName", title: "UsersName" },
            { id: "VoidBillReason", title: "VoidBillReason" },
          ],
          generateReportsDBResult,
          "csv",
          "Module",
          // "casinopridefiles/"
          `E:/React/CasinoPride2BE/reports/csv`
        );

        const url = data.fileLink;
        // Require the 'url' and 'path' modules
        const { parse } = require("url");
        const path = require("path");

        // Parse the URL
        const parsedUrl = parse(url);

        // Extract the filename from the path
        const filename = path.basename(parsedUrl.pathname);

        let uploadReportFileDBResult = await reportsService.uploadReportFile(
          functionContext,
          generateReportsRequest,
          // data.fileLink
          filename
        );
        if (uploadReportFileDBResult.ReportFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });

          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
          });
          uploadReportFileDBResult.ReportFile = imageUrl;
          uploadReportFileDBResult.ReportFile = imageUrl;
          response(functionContext, responseObj, uploadReportFileDBResult);
        } else {
          response(functionContext, responseObj, uploadReportFileDBResult);
        }
        // response(functionContext, responseObj,uploadReportFileDBResult);
      }

      //Generate Report By Bill date
      else if (
        generateReportsRequest.userId == 0 &&
        generateReportsRequest.billDate != null &&
        generateReportsRequest.futureDate == null &&
        generateReportsRequest.shiftId == 0 &&
        generateReportsRequest.reportTypeId != 0 &&
        generateReportsRequest.fromDate == null &&
        generateReportsRequest.toDate == null &&
        generateReportsRequest.isSettlementReport == 0 &&
        generateReportsRequest.settlementDate == null &&
        generateReportsRequest.settlementUpdateDate == null
      ) {
 console.log('start',new Date())
        let generateReportsDBResult =
      await reportsService.generateReportsByBillDate(
        functionContext,
        generateReportsRequest
      );
      console.log('end',new Date());
    // Separate rows where IsVoid === 1
    const isVoidRows = generateReportsDBResult.filter(
      (item) => parseInt(item.IsVoid) === 1
    );

    const nonVoidRows = generateReportsDBResult; 

    // Process and modify the UpdatedItemDetails property
    generateReportsDBResult.forEach((item) => { TeensTax = item.TeensTax;
 item["CGST 20 %"] = parseFloat(item["CGST 20 %"]) || 0;
  item["SGST 20 %"] = parseFloat(item["SGST 20 %"]) || 0;
      const itemDetails =
        item?.UpdatedItemDetails != null &&
        JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));

      if (Object.keys(itemDetails).length !== 0) {
        item.UpdatedItemDetails = Object.entries(itemDetails)
          .map(([key, value]) => {
            item[key] = value;
            return `${key}:${value}`;
          })
          .join(", ");
      } else {
        item.UpdatedItemDetails = "";
      }

      item.PackageGuestCount = item.PackageGuestCount.replace(/\[|\]|"/g, "");
      item.PackageName = item.PackageName.replace(/\[|\]|"/g, "");

      // Calculate GST and VAT taxable values
      item.gstTaxable = item.ItemTaxName === "GST" ? parseFloat(item.Rate) || 0 : 0;
      item.vatTaxable = item.ItemTaxName === "VAT" ? parseFloat(item.Rate) || 0 : 0;
    });

    // Helper function to calculate sums
   // Helper function to calculate sums with debugging
const calculateSum = (data, key) => {
  const sum = data.reduce((sum, item) => {
    const value = parseFloat(item[key]);
//    console.log(`Item ${key}:`, value); // Debugging log
    return isNaN(value) ? sum : sum + value;
  }, 0);
 
  return sum;
};

    // Calculate totals for the main result set
    const mainTotals = {
      BillNumber: "Total",
      cashAmount: calculateSum(nonVoidRows, "cashAmount"),
      cardAmount: calculateSum(nonVoidRows, "cardAmount"),
      upiAmount: calculateSum(nonVoidRows, "upiAmount"),
      onlinePayu: calculateSum(nonVoidRows, "onlinePayu"),
      settledByCompany: calculateSum(nonVoidRows, "settledByCompany"),
      TotalBillAmount: calculateSum(nonVoidRows, "TotalBillAmount"),
'KidsRate': calculateSum(nonVoidRows, "KidsRate"),
      gstTaxable: calculateSum(nonVoidRows, "gstTaxable"),
      vatTaxable: calculateSum(nonVoidRows, "vatTaxable"),
      'CGST 20 %': calculateSum(nonVoidRows, "CGST 20 %"),  
      'SGST 20 %': calculateSum(nonVoidRows, "SGST 20 %"),
     [`Kids CGST ${TeensTax / 2} %`]: calculateSum(nonVoidRows, `Kids CGST ${TeensTax / 2} %`),
            [`Kids SGST ${TeensTax / 2} %`]: calculateSum(nonVoidRows, `Kids SGST ${TeensTax / 2} %`),
	    'VAT 22 %': calculateSum(nonVoidRows, "VAT 22 %"),

      VoidBillReason: "", // No VoidBillReason for totals
    };
console.log('Gst 14 total confirmation',calculateSum(nonVoidRows, "CGST 14 %"))
    // Calculate totals for IsVoid rows
    const isVoidTotals = {
      BillNumber: "Total (Void)",
      cashAmount: calculateSum(isVoidRows, "cashAmount"),
      cardAmount: calculateSum(isVoidRows, "cardAmount"),
      upiAmount: calculateSum(isVoidRows, "upiAmount"),
      onlinePayu: calculateSum(isVoidRows, "onlinePayu"),
      settledByCompany: calculateSum(isVoidRows, "settledByCompany"),
      TotalBillAmount: calculateSum(isVoidRows, "TotalBillAmount"),
	    'KidsRate': calculateSum(isVoidRows, "KidsRate"),
      gstTaxable: calculateSum(isVoidRows, "gstTaxable"),
      vatTaxable: calculateSum(isVoidRows, "vatTaxable"),
      'CGST 20 %': calculateSum(isVoidRows, "CGST 20 %"),
      'SGST 20 %': calculateSum(isVoidRows, "SGST 20 %"),
	    [`Kids CGST ${TeensTax / 2} %`]: calculateSum(isVoidRows, `Kids CGST ${TeensTax / 2} %`),
            [`Kids SGST ${TeensTax / 2} %`]: calculateSum(isVoidRows, `Kids SGST ${TeensTax / 2} %`),
	    'VAT 22 %': calculateSum(isVoidRows, "VAT 22 %"),
      VoidBillReason: "N/A",
    };

    // Calculate the final gross summary
    const finalGrossSummary = {
      BillNumber: "Final Gross Summary",
      cashAmount: mainTotals.cashAmount - isVoidTotals.cashAmount,
      cardAmount: mainTotals.cardAmount - isVoidTotals.cardAmount,
      upiAmount: mainTotals.upiAmount - isVoidTotals.upiAmount,
      onlinePayu: mainTotals.onlinePayu - isVoidTotals.onlinePayu,
      settledByCompany: mainTotals.settledByCompany - isVoidTotals.settledByCompany,
      TotalBillAmount: mainTotals.TotalBillAmount - isVoidTotals.TotalBillAmount,
	    'KidsRate': mainTotals['KidsRate'] - isVoidTotals['KidsRate'],
      gstTaxable: mainTotals.gstTaxable - isVoidTotals.gstTaxable,
      vatTaxable: mainTotals.vatTaxable - isVoidTotals.vatTaxable,
      'CGST 20 %': mainTotals['CGST 20 %'] - isVoidTotals['CGST 20 %'],
      'SGST 20 %': mainTotals['SGST 20 %'] - isVoidTotals['SGST 20 %'],

[`Kids CGST ${TeensTax / 2} %`]: mainTotals[`Kids CGST ${TeensTax / 2} %`] - isVoidTotals[`Kids CGST ${TeensTax / 2} %`],
            [`Kids SGST ${TeensTax / 2} %`]: mainTotals[`Kids SGST ${TeensTax / 2} %`] - isVoidTotals[`Kids SGST ${TeensTax / 2} %`],
	'VAT 22 %': mainTotals['VAT 22 %'] - isVoidTotals['VAT 22 %'],
      VoidBillReason: "",
    };

    // Combine data: main data + totals + IsVoid rows + IsVoid totals + Final Gross Summary
    const finalReport = [
      ...nonVoidRows, // Main report rows
      {}, // Two empty rows for spacing
      mainTotals, // Main report total
      {}, // Empty rows before IsVoid rows
      ...isVoidRows, // IsVoid rows
      isVoidTotals, // IsVoid total row
      {}, // Empty rows before Final Gross Summary
      finalGrossSummary, // Final Gross Summary row
    ];

    // Columns configuration
    const columns = [
      // { id: "BillingId", title: "BillingId" },
      { id: "BillNumber", title: "BillNumber" },
      { id: "ActualBillingDate", title: "Billing Date" },
      { id: "ActualBillingTime", title: "Billing Time" },
      { id: "IsVoid", title: "Is Void" },
      { id: "GuestName", title: "Guest Name" },
      { id: "TotalGuestCount", title: "Total Guest Count" },
      { id: "cashAmount", title: "Cash Amount" },
      { id: "cardAmount", title: "Card Amount" },
      { id: "upiAmount", title: "UPI Amount" },
      { id: "onlinePayu", title: "Online Payu" },
      { id: "settledByCompany", title: "Settle By Company" },
      { id: "TotalBillAmount", title: "Total Bill Amount" },
      { id: "PaymentMode", title: "Payment Mode" },
      { id: "ShiftId", title: "Shift Type" },
      { id: "upiId", title: "UPI Id" },
      { id: "cardHoldersName", title: "CardHolders Name" },
      { id: "cardNumber", title: "Card Number" },
      { id: "cardType", title: "Card Type" },
      { id: "PackageName", title: "PackageName" },
      { id: "ItemName", title: "Item Name" },
      { id: "packageGuestCount", title: "Package Guest Count" },
      { id: "KidsCount", title: "Kids Count" },
      { id: "KidsItemName", title: "Kids Item Name" },
      { id: "KidsRate", title: "Kids Rate" },
      { id: "gstTaxable", title: "GST Taxable" },
      { id: "vatTaxable", title: "VAT Taxable" },
      // { id: "Rate", title: "Rate" },
      { id: "CGST 20 %", title: "CGST 20 %" },
      { id: "SGST 20 %", title: "SGST 20 %" },
      {
        id: [`Kids CGST ${TeensTax / 2} %`],
        title: [`Kids CGST ${TeensTax / 2} %`],
      },
      {
        id: [`Kids SGST ${TeensTax / 2} %`],
        title: [`Kids SGST ${TeensTax / 2} %`],
      },
      { id: "VAT 22 %", title: "VAT 22 %" },
      { id: "ItemTaxName", title: "TaxName" },
      { id: "ItemTax", title: "ItemTax" },
      { id: "Address", title: "Address" },
      { id: "Phone", title: "Guest Phone" },
      { id: "Email", title: "Guest Email" },
      { id: "GSTNumber", title: "GST Number" },
      { id: "BookingId", title: "BookingId" },
      { id: "LocalAgentName", title: "LocalAgentName" },
      { id: "TravelAgentName", title: "TravelAgentName" },
      { id: "UsersName", title: "UsersName" },
      { id: "VoidBillReason", title: "VoidBillReason" },
    ];

    // Generate the CSV report
    const data = await reports.generateCSVReport(
      columns,
      finalReport,
      "csv",
      "Module",
      `E:/React/CasinoPride2BE/reports/csv`
    );

        const url = data.fileLink;
        // Require the 'url' and 'path' modules
        const { parse } = require("url");
        const path = require("path");

        // Parse the URL
        const parsedUrl = parse(url);

        // Extract the filename from the path
        const filename = path.basename(parsedUrl.pathname);
        let uploadReportFileDBResult = await reportsService.uploadReportFile(
          functionContext,
          generateReportsRequest,
          filename
        );
        if (uploadReportFileDBResult.ReportFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });

          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
          });
          uploadReportFileDBResult.ReportFile = imageUrl;
          uploadReportFileDBResult.ReportFile = imageUrl;
          response(functionContext, responseObj, uploadReportFileDBResult);
        } else {
          response(functionContext, responseObj, uploadReportFileDBResult);
        }
      }

      //Generate Report By futureDate
      else if (
        generateReportsRequest.userId == 0 &&
        generateReportsRequest.billDate == null &&
        generateReportsRequest.futureDate != null &&
        generateReportsRequest.shiftId == 0 &&
        generateReportsRequest.reportTypeId != 0 &&
        generateReportsRequest.fromDate == null &&
        generateReportsRequest.toDate == null &&
        generateReportsRequest.isSettlementReport == 0 &&
        generateReportsRequest.settlementDate == null &&
        generateReportsRequest.settlementUpdateDate == null
      ) {
        let generateReportsDBResult =
          await reportsService.generateReportsByFutureDate(
            functionContext,
            generateReportsRequest
          );
        // Process and modify the UpdatedItemDetails property
        generateReportsDBResult.forEach((item) => {
          TeensTax = item.TeensTax;
          const itemDetails =
            item?.UpdatedItemDetails != null &&
            JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));
          // Check if UpdatedItemDetails is not an empty object
          if (Object.keys(itemDetails).length !== 0) {
            // Extract key-value pairs and assign them to UpdatedItemDetails
            item.UpdatedItemDetails = Object.entries(itemDetails)
              .map(([key, value]) => {
                // Add each key as a separate column
                item[key] = value;
                return `${key}:${value}`;
              })
              .join(", ");
          } else {
            item.UpdatedItemDetails = ""; // Set to an empty string if it's empty or '{}'
          }

          // Remove square brackets and quotes from PackageGuestCount
          item.PackageGuestCount = item.PackageGuestCount.replace(
            /\[|\]|"/g,
            ""
          );
          item.gstTaxable = item?.ItemTaxName === "GST" ? item?.Rate : null;
          item.vatTaxable = item?.ItemTaxName === "VAT" ? item?.Rate : null;

          // Remove square brackets and quotes from PackageName
          item.PackageName = item.PackageName.replace(/\[|\]|"/g, "");
        });
        const rateSum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Rate" value to a number and add it to the sum
          const rate = parseFloat(item.Rate);
          return isNaN(rate) ? sum : sum + rate;
        }, 0);
        const gstTaxableSum = generateReportsDBResult.reduce((sum, item) => {
          const gstTaxable =
            item.ItemTaxName === "GST" ? parseFloat(item.Rate) : 0;
          return isNaN(gstTaxable) ? sum : sum + gstTaxable;
        }, 0);

        const vatTaxableSum = generateReportsDBResult.reduce((sum, item) => {
          const vatTaxable =
            item.ItemTaxName === "VAT" ? parseFloat(item.Rate) : 0;
          return isNaN(vatTaxable) ? sum : sum + vatTaxable;
        }, 0);
        // Calculate the sum of the "CGST 14 %" column
        const cgst14Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "CGST 14 %" value to a number and add it to the sum
          const cgst14 = parseFloat(item["CGST 14 %"]);
          return isNaN(cgst14) ? sum : sum + cgst14;
        }, 0);
        // Calculate the sum of the "SGST 14 %" column
        const sgst14Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "SGST 14 %" value to a number and add it to the sum
          const sgst14 = parseFloat(item["SGST 14 %"]);
          return isNaN(sgst14) ? sum : sum + sgst14;
        }, 0);

        // Calculate the sum of the "CGST 9 %" column
        const cgst9Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "CGST 9 %" value to a number and add it to the sum
          const cgst9 = parseFloat(item[`Kids CGST ${TeensTax / 2} %`]);
          return isNaN(cgst9) ? sum : sum + cgst9;
        }, 0);

        // Calculate the sum of the "SGST 9 %" column
        const sgst9Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "SGST 9 %" value to a number and add it to the sum
          const sgst9 = parseFloat(item[`Kids SGST ${TeensTax / 2} %`]);
          return isNaN(sgst9) ? sum : sum + sgst9;
        }, 0);

        // Calculate the sum of the "VAT 22 %" column
        const vat22Sum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "VAT 22 %" value to a number and add it to the sum
          const vat22 = parseFloat(item["VAT 22 %"]);
          return isNaN(vat22) ? sum : sum + vat22;
        }, 0);

        // Calculate the sum of the "Kids Rate" column
        const kidsRateSum = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Kids Rate" value to a number and add it to the sum
          const kidsRate = parseFloat(item["KidsRate"]);
          return isNaN(kidsRate) ? sum : sum + kidsRate;
        }, 0);

        // Calculate the sum of the "Total Bill Amount" column
        const totalBillAmountSum = generateReportsDBResult.reduce(
          (sum, item) => {
            // Convert the "Total Bill Amount" value to a number and add it to the sum
            const totalBillAmount = parseFloat(item["TotalBillAmount"]);
            return isNaN(totalBillAmount) ? sum : sum + totalBillAmount;
          },
          0
        );
        const totalCashAmount = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalCashAmount = parseFloat(item["cashAmount"]);
          return isNaN(totalCashAmount) ? sum : sum + totalCashAmount;
        }, 0);
        const totalCardAmount = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalCardAmount = parseFloat(item["cardAmount"]);
          return isNaN(totalCardAmount) ? sum : sum + totalCardAmount;
        }, 0);
        const totalUPIAmount = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalUPIAmount = parseFloat(item["upiAmount"]);
          return isNaN(totalUPIAmount) ? sum : sum + totalUPIAmount;
        }, 0);

        const totalSettleByCompany = generateReportsDBResult.reduce(
          (sum, item) => {
            // Convert the "Total Bill Amount" value to a number and add it to the sum
            const totalSettleByCompany = parseFloat(item["settledByCompany"]);
            return isNaN(totalSettleByCompany)
              ? sum
              : sum + totalSettleByCompany;
          },
          0
        );

        const totalOnlinePayu = generateReportsDBResult.reduce((sum, item) => {
          // Convert the "Total Bill Amount" value to a number and add it to the sum
          const totalOnlinePayu = parseFloat(item["onlinePayu"]);
          return isNaN(totalOnlinePayu) ? sum : sum + totalOnlinePayu;
        }, 0);
        // Add two empty rows
        generateReportsDBResult.push({}, {});
        // Add the sum to the report data
        // generateReportsDBResult.push({ Rate: rateSum });

        // Create a new object with "Total" label and sums for relevant columns
        const totalRow = {
          BillNumber: "Total",
          gstTaxable: gstTaxableSum,
          vatTaxable: vatTaxableSum,
          "CGST 14 %": cgst14Sum,
          "SGST 14 %": sgst14Sum,
          [`Kids CGST ${TeensTax / 2} %`]: cgst9Sum,
          [`Kids SGST ${TeensTax / 2} %`]: sgst9Sum,
          "VAT 22 %": vat22Sum,
          KidsRate: kidsRateSum,
          TotalBillAmount: totalBillAmountSum,
          cashAmount: totalCashAmount,
          cardAmount: totalCardAmount,
          upiAmount: totalUPIAmount,
          settledByCompany: totalSettleByCompany,
          onlinePayu: totalOnlinePayu,
          // Add more properties for other columns as needed
        };

        // Add the "Total" row to the beginning of the array
        // generateReportsDBResult.unshift(totalRow);

        // Add the "Total" row to the end of the array
        generateReportsDBResult.push(totalRow);
        const data = await reports.generateCSVReport(
          [
            // { id: "BillingId", title: "BillingId" },
            { id: "BillNumber", title: "BillNumber" },
            { id: "ActualBillingDate", title: "Billing Date" },
            { id: "ActualBillingTime", title: "Billing Time" },
            { id: "IsVoid", title: "Is Void" },
            { id: "GuestName", title: "Guest Name" },
            { id: "TotalGuestCount", title: "Total Guest Count" },
            { id: "cashAmount", title: "Cash Amount" },
            { id: "cardAmount", title: "Card Amount" },
            { id: "upiAmount", title: "UPI Amount" },
            { id: "onlinePayu", title: "Online Payu" },
            { id: "settledByCompany", title: "Settle By Company" },
            { id: "TotalBillAmount", title: "Total Bill Amount" },
            { id: "PaymentMode", title: "Payment Mode" },
            { id: "ShiftId", title: "Shift Type" },
            { id: "upiId", title: "UPI Id" },
            { id: "cardHoldersName", title: "CardHolders Name" },
            { id: "cardNumber", title: "Card Number" },
            { id: "cardType", title: "Card Type" },
            { id: "PackageName", title: "PackageName" },
            { id: "ItemName", title: "Item Name" },
            { id: "packageGuestCount", title: "Package Guest Count" },
            { id: "KidsCount", title: "Kids Count" },
            { id: "KidsItemName", title: "Kids Item Name" },
            { id: "KidsRate", title: "Kids Rate" },
            { id: "gstTaxable", title: "GST Taxable" },
            { id: "vatTaxable", title: "VAT Taxable" },
            // { id: "Rate", title: "Rate" },
            { id: "CGST 14 %", title: "CGST 14 %" },
            { id: "SGST 14 %", title: "SGST 14 %" },
            {
              id: [`Kids CGST ${TeensTax / 2} %`],
              title: [`Kids CGST ${TeensTax / 2} %`],
            },
            {
              id: [`Kids SGST ${TeensTax / 2} %`],
              title: [`Kids SGST ${TeensTax / 2} %`],
            },
            { id: "VAT 22 %", title: "VAT 22 %" },
            { id: "ItemTaxName", title: "TaxName" },
            { id: "ItemTax", title: "ItemTax" },
            { id: "Address", title: "Address" },
            { id: "Phone", title: "Guest Phone" },
            { id: "Email", title: "Guest Email" },
            { id: "GSTNumber", title: "GST Number" },
            { id: "BookingId", title: "BookingId" },
            { id: "LocalAgentName", title: "LocalAgentName" },
            { id: "TravelAgentName", title: "TravelAgentName" },
            { id: "UsersName", title: "UsersName" },
            { id: "VoidBillReason", title: "VoidBillReason" },
          ],
          generateReportsDBResult,
          "csv",
          "Module",
          // "casinopridefiles/"
          `E:/React/CasinoPride2BE/reports/csv`
        );
        const url = data.fileLink;
        // Require the 'url' and 'path' modules
        const { parse } = require("url");
        const path = require("path");

        // Parse the URL
        const parsedUrl = parse(url);

        // Extract the filename from the path
        const filename = path.basename(parsedUrl.pathname);
        let uploadReportFileDBResult = await reportsService.uploadReportFile(
          functionContext,
          generateReportsRequest,
          filename
        );
        if (uploadReportFileDBResult.ReportFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });

          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
          });
          uploadReportFileDBResult.ReportFile = imageUrl;
          uploadReportFileDBResult.ReportFile = imageUrl;
          response(functionContext, responseObj, uploadReportFileDBResult);
        } else {
          response(functionContext, responseObj, uploadReportFileDBResult);
        }
      }

      //Generate Report by Shift
      else if (
        generateReportsRequest.userId == 0 &&
        generateReportsRequest.billDate != null &&
        generateReportsRequest.futureDate == null &&
        generateReportsRequest.shiftId != 0 &&
        generateReportsRequest.reportTypeId != 0 &&
        generateReportsRequest.fromDate == null &&
        generateReportsRequest.toDate == null &&
        generateReportsRequest.isSettlementReport == 0 &&
        generateReportsRequest.settlementDate == null &&
        generateReportsRequest.settlementUpdateDate == null
      ) {
        let generateReportsDBResult =
          await reportsService.generateReportsByShift(
            functionContext,
        generateReportsRequest
      );

       // Separate rows where IsVoid === 1
    const isVoidRows = generateReportsDBResult.filter(
      (item) => parseInt(item.IsVoid) === 1
    );

    const nonVoidRows = generateReportsDBResult;
// Process and modify the UpdatedItemDetails property
    generateReportsDBResult.forEach((item) => { TeensTax = item.TeensTax;
item["CGST 14 %"] = parseFloat(item["CGST 14 %"]) || 0; 
item["SGST 14 %"] = parseFloat(item["SGST 14 %"]) || 0;
      const itemDetails =
        item?.UpdatedItemDetails != null &&
        JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));

      if (Object.keys(itemDetails).length !== 0) {
        item.UpdatedItemDetails = Object.entries(itemDetails)
          .map(([key, value]) => {
            item[key] = value;
            return `${key}:${value}`;
          })
          .join(", ");
      } else {
        item.UpdatedItemDetails = "";
      }

      item.PackageGuestCount = item.PackageGuestCount.replace(/\[|\]|"/g, "");
      item.PackageName = item.PackageName.replace(/\[|\]|"/g, "");

      // Calculate GST and VAT taxable values
item.gstTaxable = item.ItemTaxName === "GST" ? parseFloat(item.Rate) || 0 : 0;
      item.vatTaxable = item.ItemTaxName === "VAT" ? parseFloat(item.Rate) || 0 : 0;
    });

    // Helper function to calculate sums
    const calculateSum = (data, key) =>
      data.reduce((sum, item) => {
        const value = parseFloat(item[key]);
        return isNaN(value) ? sum : sum + value;
      }, 0);

    // Calculate totals for the main result set
    const mainTotals = {
      BillNumber: "Total",
      cashAmount: calculateSum(nonVoidRows, "cashAmount"),
      cardAmount: calculateSum(nonVoidRows, "cardAmount"),
      upiAmount: calculateSum(nonVoidRows, "upiAmount"),
      onlinePayu: calculateSum(nonVoidRows, "onlinePayu"),
      settledByCompany: calculateSum(nonVoidRows, "settledByCompany"),
      TotalBillAmount: calculateSum(nonVoidRows, "TotalBillAmount"),
'KidsRate': calculateSum(nonVoidRows, "KidsRate"),
	    gstTaxable: calculateSum(nonVoidRows, "gstTaxable"),
      vatTaxable: calculateSum(nonVoidRows, "vatTaxable"),
      'CGST 14 %': calculateSum(nonVoidRows, "CGST 14 %"),
      'SGST 14 %': calculateSum(nonVoidRows, "SGST 14 %"), 
	     [`Kids CGST ${TeensTax / 2} %`]: calculateSum(nonVoidRows, `Kids CGST ${TeensTax / 2} %`),
            [`Kids SGST ${TeensTax / 2} %`]: calculateSum(nonVoidRows, `Kids SGST ${TeensTax / 2} %`),
            'VAT 22 %': calculateSum(nonVoidRows, "VAT 22 %"),

      VoidBillReason: "", // No VoidBillReason for totals
    };

// Calculate totals for IsVoid rows
    const isVoidTotals = {
      BillNumber: "Total (Void)",
      cashAmount: calculateSum(isVoidRows, "cashAmount"),
      cardAmount: calculateSum(isVoidRows, "cardAmount"),
      upiAmount: calculateSum(isVoidRows, "upiAmount"),
      onlinePayu: calculateSum(isVoidRows, "onlinePayu"),
      settledByCompany: calculateSum(isVoidRows, "settledByCompany"),
      TotalBillAmount: calculateSum(isVoidRows, "TotalBillAmount"),
	    'KidsRate': calculateSum(isVoidRows, "KidsRate"),
      gstTaxable: calculateSum(isVoidRows, "gstTaxable"),
      vatTaxable: calculateSum(isVoidRows, "vatTaxable"),
      'CGST 14 %': calculateSum(isVoidRows, "CGST 14 %"),
      'SGST 14 %': calculateSum(isVoidRows, "SGST 14 %"),
	     [`Kids CGST ${TeensTax / 2} %`]: calculateSum(isVoidRows, `Kids CGST ${TeensTax / 2} %`),
            [`Kids SGST ${TeensTax / 2} %`]: calculateSum(isVoidRows, `Kids SGST ${TeensTax / 2} %`),
            'VAT 22 %': calculateSum(isVoidRows, "VAT 22 %"),

      VoidBillReason: "N/A",
    };

    // Calculate the final gross summary
     const finalGrossSummary = {
      BillNumber: "Final Gross Summary",
      cashAmount: mainTotals.cashAmount - isVoidTotals.cashAmount,
      cardAmount: mainTotals.cardAmount - isVoidTotals.cardAmount,
      upiAmount: mainTotals.upiAmount - isVoidTotals.upiAmount,
      onlinePayu: mainTotals.onlinePayu - isVoidTotals.onlinePayu,
      settledByCompany: mainTotals.settledByCompany - isVoidTotals.settledByCompany,
      TotalBillAmount: mainTotals.TotalBillAmount - isVoidTotals.TotalBillAmount,
	     'KidsRate': mainTotals['KidsRate'] - isVoidTotals['KidsRate'],
      gstTaxable: mainTotals.gstTaxable - isVoidTotals.gstTaxable,
      vatTaxable: mainTotals.vatTaxable - isVoidTotals.vatTaxable,
      'CGST 14 %': mainTotals['CGST 14 %'] - isVoidTotals['CGST 14 %'],
      'SGST 14 %': mainTotals['SGST 14 %'] - isVoidTotals['SGST 14 %'],

[`Kids CGST ${TeensTax / 2} %`]: mainTotals[`Kids CGST ${TeensTax / 2} %`] - isVoidTotals[`Kids CGST ${TeensTax / 2} %`],
            [`Kids SGST ${TeensTax / 2} %`]: mainTotals[`Kids SGST ${TeensTax / 2} %`] - isVoidTotals[`Kids SGST ${TeensTax / 2} %`],
        'VAT 22 %': mainTotals['VAT 22 %'] - isVoidTotals['VAT 22 %'],
      VoidBillReason: "",
    };


    // Combine data: main data + totals + IsVoid rows + IsVoid totals + Final Gross Summary
    const finalReport = [
      ...nonVoidRows, // Main report rows
      {}, // Two empty rows for spacing
      mainTotals, // Main report total
      {}, // Empty rows before IsVoid rows
      ...isVoidRows, // IsVoid rows
      isVoidTotals, // IsVoid total row
      {}, // Empty rows before Final Gross Summary
      finalGrossSummary, // Final Gross Summary row
    ];

    // Columns configuration
    const columns = [
      // { id: "BillingId", title: "BillingId" },
      { id: "BillNumber", title: "BillNumber" },
      { id: "ActualBillingDate", title: "Billing Date" },
      { id: "ActualBillingTime", title: "Billing Time" },
      { id: "IsVoid", title: "Is Void" },
                                          
{ id: "GuestName", title: "Guest Name" },
      { id: "TotalGuestCount", title: "Total Guest Count" },
      { id: "cashAmount", title: "Cash Amount" },
      { id: "cardAmount", title: "Card Amount" },
      { id: "upiAmount", title: "UPI Amount" },
      { id: "onlinePayu", title: "Online Payu" },
      { id: "settledByCompany", title: "Settle By Company" },
      { id: "TotalBillAmount", title: "Total Bill Amount" },
      { id: "PaymentMode", title: "Payment Mode" },
      { id: "ShiftId", title: "Shift Type" },
      { id: "upiId", title: "UPI Id" },
      { id: "cardHoldersName", title: "CardHolders Name" },
      { id: "cardNumber", title: "Card Number" },
      { id: "cardType", title: "Card Type" },
      { id: "PackageName", title: "PackageName" },
      { id: "ItemName", title: "Item Name" },
      { id: "packageGuestCount", title: "Package Guest Count" },
      { id: "KidsCount", title: "Kids Count" },
      { id: "KidsItemName", title: "Kids Item Name" },
      { id: "KidsRate", title: "Kids Rate" },
      { id: "gstTaxable", title: "GST Taxable" },
      { id: "vatTaxable", title: "VAT Taxable" },
      // { id: "Rate", title: "Rate" },
      { id: "CGST 14 %", title: "CGST 14 %" },
      { id: "SGST 14 %", title: "SGST 14 %" },
      {
id: [`Kids CGST ${TeensTax / 2} %`],
        title: [`Kids CGST ${TeensTax / 2} %`],
      },
      {
        id: [`Kids SGST ${TeensTax / 2} %`],
        title: [`Kids SGST ${TeensTax / 2} %`],
      },
      { id: "VAT 22 %", title: "VAT 22 %" },
      { id: "ItemTaxName", title: "TaxName" },
      { id: "ItemTax", title: "ItemTax" },
      { id: "Address", title: "Address" },
      { id: "Phone", title: "Guest Phone" },
      { id: "Email", title: "Guest Email" },
      { id: "GSTNumber", title: "GST Number" },
      { id: "BookingId", title: "BookingId" },
      { id: "LocalAgentName", title: "LocalAgentName" },
      { id: "TravelAgentName", title: "TravelAgentName" },
      { id: "UsersName", title: "UsersName" },
      { id: "VoidBillReason", title: "VoidBillReason" },
    ];

    // Generate the CSV report
    const data = await reports.generateCSVReport(
                                                 
columns,
      finalReport,
      "csv",
      "Module",
      `E:/React/CasinoPride2BE/reports/csv`
    );

        const url = data.fileLink;
        // Require the 'url' and 'path' modules
        const { parse } = require("url");
        const path = require("path");

        // Parse the URL
        const parsedUrl = parse(url);

        // Extract the filename from the path
        const filename = path.basename(parsedUrl.pathname);
        // response(functionContext, responseObj,generateReportsDBResult);
        let uploadReportFileDBResult = await reportsService.uploadReportFile(
          functionContext,
          generateReportsRequest,
          filename
        );
        if (uploadReportFileDBResult.ReportFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });

          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
          });
          uploadReportFileDBResult.ReportFile = imageUrl;
          uploadReportFileDBResult.ReportFile = imageUrl;
          response(functionContext, responseObj, uploadReportFileDBResult);
        } else {
          response(functionContext, responseObj, uploadReportFileDBResult);
        }
      }
      //Generate Report by Date Range
      else if (
        generateReportsRequest.userId == 0 &&
        generateReportsRequest.billDate == null &&
        generateReportsRequest.futureDate == null &&
        generateReportsRequest.shiftId == 0 &&
        generateReportsRequest.reportTypeId != 0 &&
        generateReportsRequest.fromDate != null &&
        generateReportsRequest.toDate != null &&
        generateReportsRequest.isSettlementReport == 0 &&
        generateReportsRequest.settlementDate == null &&
        generateReportsRequest.settlementUpdateDate == null
      ) {
        let generateReportsDBResult = await reportsService.generateReportsByDateRange(
          functionContext,
          generateReportsRequest
        );
      // Separate rows where IsVoid === 1
      const isVoidRows = generateReportsDBResult.filter(
        (item) => parseInt(item.IsVoid) === 1
      );
  
      const nonVoidRows = generateReportsDBResult; 
  
      // Process and modify the UpdatedItemDetails property
      generateReportsDBResult.forEach((item) => { TeensTax = item.TeensTax;
        const itemDetails =
          item?.UpdatedItemDetails != null &&
          JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));
  
        if (Object.keys(itemDetails).length !== 0) {
          item.UpdatedItemDetails = Object.entries(itemDetails)
            .map(([key, value]) => {
              item[key] = value;
              return `${key}:${value}`;
            })
            .join(", ");
        } else {
          item.UpdatedItemDetails = "";
        }
  
        item.PackageGuestCount = item.PackageGuestCount.replace(/\[|\]|"/g, "");
        item.PackageName = item.PackageName.replace(/\[|\]|"/g, "");
  
        // Calculate GST and VAT taxable values
        item.gstTaxable = item.ItemTaxName === "GST" ? parseFloat(item.Rate) || 0 : 0;
        item.vatTaxable = item.ItemTaxName === "VAT" ? parseFloat(item.Rate) || 0 : 0;
      });
  
      // Helper function to calculate sums
      const calculateSum = (data, key) =>
        data.reduce((sum, item) => {
          const value = parseFloat(item[key]);
          return isNaN(value) ? sum : sum + value;
        }, 0);
  
      // Calculate totals for the main result set
      const mainTotals = {
        BillNumber: "Total",
        cashAmount: calculateSum(nonVoidRows, "cashAmount"),
        cardAmount: calculateSum(nonVoidRows, "cardAmount"),
        upiAmount: calculateSum(nonVoidRows, "upiAmount"),
        onlinePayu: calculateSum(nonVoidRows, "onlinePayu"),
        settledByCompany: calculateSum(nonVoidRows, "settledByCompany"),
        TotalBillAmount: calculateSum(nonVoidRows, "TotalBillAmount"),
	                            'KidsRate': calculateSum(nonVoidRows, "KidsRate"),
        gstTaxable: calculateSum(nonVoidRows, "gstTaxable"),
        vatTaxable: calculateSum(nonVoidRows, "vatTaxable"),
        'CGST 14 %': calculateSum(nonVoidRows, "CGST 14 %"),
        'SGST 14 %': calculateSum(nonVoidRows, "SGST 14 %"),
	       [`Kids CGST ${TeensTax / 2} %`]: calculateSum(nonVoidRows, `Kids CGST ${TeensTax / 2} %`),
            [`Kids SGST ${TeensTax / 2} %`]: calculateSum(nonVoidRows, `Kids SGST ${TeensTax / 2} %`),
            'VAT 22 %': calculateSum(nonVoidRows, "VAT 22 %"),

        VoidBillReason: "", // No VoidBillReason for totals
      };
  
      // Calculate totals for IsVoid rows
      const isVoidTotals = {
        BillNumber: "Total (Void)",
        cashAmount: calculateSum(isVoidRows, "cashAmount"),
        cardAmount: calculateSum(isVoidRows, "cardAmount"),
        upiAmount: calculateSum(isVoidRows, "upiAmount"),
        onlinePayu: calculateSum(isVoidRows, "onlinePayu"),
        settledByCompany: calculateSum(isVoidRows, "settledByCompany"),
        TotalBillAmount: calculateSum(isVoidRows, "TotalBillAmount"),
	              'KidsRate': calculateSum(isVoidRows, "KidsRate"),
        gstTaxable: calculateSum(isVoidRows, "gstTaxable"),
        vatTaxable: calculateSum(isVoidRows, "vatTaxable"),
        'CGST 14 %': calculateSum(isVoidRows, "CGST 14 %"),
       'SGST 14 %': calculateSum(isVoidRows, "SGST 14 %"),
	        [`Kids CGST ${TeensTax / 2} %`]: calculateSum(isVoidRows, `Kids CGST ${TeensTax / 2} %`),
            [`Kids SGST ${TeensTax / 2} %`]: calculateSum(isVoidRows, `Kids SGST ${TeensTax / 2} %`),
            'VAT 22 %': calculateSum(isVoidRows, "VAT 22 %"),

        VoidBillReason: "N/A",
      };
  
      // Calculate the final gross summary
       const finalGrossSummary = {
      BillNumber: "Final Gross Summary",
      cashAmount: mainTotals.cashAmount - isVoidTotals.cashAmount,
      cardAmount: mainTotals.cardAmount - isVoidTotals.cardAmount,
      upiAmount: mainTotals.upiAmount - isVoidTotals.upiAmount,
      onlinePayu: mainTotals.onlinePayu - isVoidTotals.onlinePayu,
      settledByCompany: mainTotals.settledByCompany - isVoidTotals.settledByCompany,
      TotalBillAmount: mainTotals.TotalBillAmount - isVoidTotals.TotalBillAmount,
	                    'KidsRate': mainTotals['KidsRate'] - isVoidTotals['KidsRate'],
      gstTaxable: mainTotals.gstTaxable - isVoidTotals.gstTaxable,
      vatTaxable: mainTotals.vatTaxable - isVoidTotals.vatTaxable,
      'CGST 14 %': mainTotals['CGST 14 %'] - isVoidTotals['CGST 14 %'],
      'SGST 14 %': mainTotals['SGST 14 %'] - isVoidTotals['SGST 14 %'],

[`Kids CGST ${TeensTax / 2} %`]: mainTotals[`Kids CGST ${TeensTax / 2} %`] - isVoidTotals[`Kids CGST ${TeensTax / 2} %`],
            [`Kids SGST ${TeensTax / 2} %`]: mainTotals[`Kids SGST ${TeensTax / 2} %`] - isVoidTotals[`Kids SGST ${TeensTax / 2} %`],
        'VAT 22 %': mainTotals['VAT 22 %'] - isVoidTotals['VAT 22 %'],
      VoidBillReason: "",
    };

  
      // Combine data: main data + totals + IsVoid rows + IsVoid totals + Final Gross Summary
      const finalReport = [
        ...nonVoidRows, // Main report rows
        {}, // Two empty rows for spacing
        mainTotals, // Main report total
        {}, // Empty rows before IsVoid rows
        ...isVoidRows, // IsVoid rows
        isVoidTotals, // IsVoid total row
        {}, // Empty rows before Final Gross Summary
        finalGrossSummary, // Final Gross Summary row
      ];
  
      // Columns configuration
      const columns = [
        // { id: "BillingId", title: "BillingId" },
        { id: "BillNumber", title: "BillNumber" },
        { id: "ActualBillingDate", title: "Billing Date" },
        { id: "ActualBillingTime", title: "Billing Time" },
        { id: "IsVoid", title: "Is Void" },
        { id: "GuestName", title: "Guest Name" },
        { id: "TotalGuestCount", title: "Total Guest Count" },
        { id: "cashAmount", title: "Cash Amount" },
        { id: "cardAmount", title: "Card Amount" },
        { id: "upiAmount", title: "UPI Amount" },
        { id: "onlinePayu", title: "Online Payu" },
        { id: "settledByCompany", title: "Settle By Company" },
        { id: "TotalBillAmount", title: "Total Bill Amount" },
        { id: "PaymentMode", title: "Payment Mode" },
        { id: "ShiftId", title: "Shift Type" },
        { id: "upiId", title: "UPI Id" },
        { id: "cardHoldersName", title: "CardHolders Name" },
        { id: "cardNumber", title: "Card Number" },
        { id: "cardType", title: "Card Type" },
        { id: "PackageName", title: "PackageName" },
        { id: "ItemName", title: "Item Name" },
        { id: "packageGuestCount", title: "Package Guest Count" },
        { id: "KidsCount", title: "Kids Count" },
        { id: "KidsItemName", title: "Kids Item Name" },
        { id: "KidsRate", title: "Kids Rate" },
        { id: "gstTaxable", title: "GST Taxable" },
        { id: "vatTaxable", title: "VAT Taxable" },
        // { id: "Rate", title: "Rate" },
        { id: "cgst 14 %", title: "CGST 14 %" },
        { id: "SGST 14 %", title: "SGST 14 %" },
        {
          id: [`Kids CGST ${TeensTax / 2} %`],
          title: [`Kids CGST ${TeensTax / 2} %`],
        },
        {
          id: [`Kids SGST ${TeensTax / 2} %`],
          title: [`Kids SGST ${TeensTax / 2} %`],
        },
        { id: "VAT 22 %", title: "VAT 22 %" },
        { id: "ItemTaxName", title: "TaxName" },
        { id: "ItemTax", title: "ItemTax" },
        { id: "Address", title: "Address" },
        { id: "Phone", title: "Guest Phone" },
        { id: "Email", title: "Guest Email" },
        { id: "GSTNumber", title: "GST Number" },
        { id: "BookingId", title: "BookingId" },
        { id: "LocalAgentName", title: "LocalAgentName" },
        { id: "TravelAgentName", title: "TravelAgentName" },
        { id: "UsersName", title: "UsersName" },
        { id: "VoidBillReason", title: "VoidBillReason" },
      ];
  
      // Generate the CSV report
      const data = await reports.generateCSVReport(
        columns,
        finalReport,
        "csv",
        "Module",
        `E:/React/CasinoPride2BE/reports/csv`
      );
        const url = data.fileLink;
        // Require the 'url' and 'path' modules
        const { parse } = require("url");
        const path = require("path");

        // Parse the URL
        const parsedUrl = parse(url);

        // Extract the filename from the path
        const filename = path.basename(parsedUrl.pathname);
        // response(functionContext, responseObj,generateReportsDBResult);
        let uploadReportFileDBResult = await reportsService.uploadReportFile(
          functionContext,
          generateReportsRequest,
          filename
        );
        if (uploadReportFileDBResult.ReportFile != null) {
          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            signatureVersion: "v4",
            region: "ap-south-1",
          });

          let imageUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
          });
          uploadReportFileDBResult.ReportFile = imageUrl;
          uploadReportFileDBResult.ReportFile = imageUrl;
          response(functionContext, responseObj, uploadReportFileDBResult);
        } else {
          response(functionContext, responseObj, uploadReportFileDBResult);
        }
      }
      //Generate Report for Agent Settlement
      else if (
        generateReportsRequest.userId != 0 &&
        generateReportsRequest.billDate == null &&
        generateReportsRequest.futureDate == null &&
        generateReportsRequest.shiftId == 0 &&
        generateReportsRequest.reportTypeId != 0 &&
        generateReportsRequest.fromDate == null &&
        generateReportsRequest.toDate == null &&
        generateReportsRequest.isSettlementReport != 0
      ) {
	      
        if (
          generateReportsRequest.settlementDate != null &&
          generateReportsRequest.settlementUpdateDate != null
        ) {
          let generateReportsDBResult =
            await reportsService.generateReportsForAgentSettlement(
              functionContext,
              generateReportsRequest
            );
	//	console.log(generateReportsDBResult);
          // Process and modify the UpdatedItemDetails property
          generateReportsDBResult.forEach((item) => {
            TeensTax = item.TeensTax;
            const itemDetails =
              item?.UpdatedItemDetails != null &&
              JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));
            // Check if UpdatedItemDetails is not an empty object
            if (Object.keys(itemDetails).length !== 0) {
              // Extract key-value pairs and assign them to UpdatedItemDetails
              item.UpdatedItemDetails = Object.entries(itemDetails)
                .map(([key, value]) => {
                  // Add each key as a separate column
                  item[key] = value;
                  return `${key}:${value}`;
                })
                .join(", ");
            } else {
              item.UpdatedItemDetails = ""; // Set to an empty string if it's empty or '{}'
            }

            // Remove square brackets and quotes from PackageGuestCount
            item.PackageGuestCount = item?.PackageGuestCount?.replace(
              /\[|\]|"/g,
              ""
            );

            // Remove square brackets and quotes from PackageName
            item.PackageName = item?.PackageName?.replace(/\[|\]|"/g, "");
          });
          const rateSum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "Rate" value to a number and add it to the sum
            const rate = parseFloat(item.Rate);
            return isNaN(rate) ? sum : sum + rate;
          }, 0);
          const gstTaxableSum = generateReportsDBResult.reduce((sum, item) => {
            const gstTaxable =
              item.ItemTaxName === "GST" ? parseFloat(item.Rate) : 0;
            return isNaN(gstTaxable) ? sum : sum + gstTaxable;
          }, 0);

          const vatTaxableSum = generateReportsDBResult.reduce((sum, item) => {
            const vatTaxable =
              item.ItemTaxName === "VAT" ? parseFloat(item.Rate) : 0;
            return isNaN(vatTaxable) ? sum : sum + vatTaxable;
          }, 0);
          // Calculate the sum of the "CGST 14 %" column
          const cgst14Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "CGST 14 %" value to a number and add it to the sum
            const cgst14 = parseFloat(item["CGST 14 %"]);
            return isNaN(cgst14) ? sum : sum + cgst14;
          }, 0);
          // Calculate the sum of the "SGST 14 %" column
          const sgst14Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "SGST 14 %" value to a number and add it to the sum
            const sgst14 = parseFloat(item["SGST 14 %"]);
            return isNaN(sgst14) ? sum : sum + sgst14;
          }, 0);

          // Calculate the sum of the "CGST 9 %" column
          const cgst9Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "CGST 9 %" value to a number and add it to the sum
            const cgst9 = parseFloat(item[`Kids CGST ${TeensTax / 2} %`]);
            return isNaN(cgst9) ? sum : sum + cgst9;
          }, 0);

          // Calculate the sum of the "SGST 9 %" column
          const sgst9Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "SGST 9 %" value to a number and add it to the sum
            const sgst9 = parseFloat(item[`Kids SGST ${TeensTax / 2} %`]);
            return isNaN(sgst9) ? sum : sum + sgst9;
          }, 0);

          // Calculate the sum of the "VAT 22 %" column
          const vat22Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "VAT 22 %" value to a number and add it to the sum
            const vat22 = parseFloat(item["VAT 22 %"]);
            return isNaN(vat22) ? sum : sum + vat22;
          }, 0);

          // Calculate the sum of the "Kids Rate" column
          const kidsRateSum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "Kids Rate" value to a number and add it to the sum
            const kidsRate = parseFloat(item["KidsRate"]);
            return isNaN(kidsRate) ? sum : sum + kidsRate;
          }, 0);


	// EDIT CODE HERE 

	
          // Calculate the sum of the "Total Bill Amount" column
          const totalBillAmountSum = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalBillAmount = parseFloat(item["TotalBillAmount"]);
		   
              return isNaN(totalBillAmount) ? sum : sum + totalBillAmount;
            },
            0
          );
	
	
		

          const totalCashAmount = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalCashAmount = parseFloat(item["cashAmount"]);
              return isNaN(totalCashAmount) ? sum : sum + totalCashAmount;
            },
            0
          );
          const totalCardAmount = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalCardAmount = parseFloat(item["cardAmount"]);
              return isNaN(totalCardAmount) ? sum : sum + totalCardAmount;
            },
            0
          );
          const totalUPIAmount = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "Total Bill Amount" value to a number and add it to the sum
            const totalUPIAmount = parseFloat(item["upiAmount"]);
            return isNaN(totalUPIAmount) ? sum : sum + totalUPIAmount;
          }, 0);
          const totalBookingCommissionAmount = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalBookingCommissionAmount = parseFloat(
                item["bookingCommission"]
              );
              return isNaN(totalBookingCommissionAmount)
                ? sum
                : sum + totalBookingCommissionAmount;
            },
            0
          );

          const totalSettleByCompany = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalSettleByCompany = parseFloat(item["settledByCompany"]);
              return isNaN(totalSettleByCompany)
                ? sum
                : sum + totalSettleByCompany;
            },
            0
          );

          const totalOnlinePayu = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalOnlinePayu = parseFloat(item["onlinePayu"]);
              return isNaN(totalOnlinePayu) ? sum : sum + totalOnlinePayu;
            },
            0
          );
          // Add two empty rows
          generateReportsDBResult.push({}, {});
          // Add the sum to the report data
          // generateReportsDBResult.push({ Rate: rateSum });
	
          // Create a new object with "Total" label and sums for relevant columns
          const totalRow = {
            BillNumber: "Total",
            gstTaxable: gstTaxableSum,
            vatTaxable: vatTaxableSum,
            // 'Rate':rateSum,
            "CGST 14 %": cgst14Sum,
            "SGST 14 %": sgst14Sum,
            [`Kids CGST ${TeensTax / 2} %`]: cgst9Sum,
            [`Kids SGST ${TeensTax / 2} %`]: sgst9Sum,
            "VAT 22 %": vat22Sum,
            KidsRate: kidsRateSum,
            TotalBillAmount: totalBillAmountSum,
            CashAmount: totalCashAmount,
            CardAmount: totalCardAmount,
            UPIAmount: totalUPIAmount,
            bookingCommission: totalBookingCommissionAmount,
            SettledByCompany: totalSettleByCompany,
            OnlinePayu: totalOnlinePayu,
            // Add more properties for other columns as needed
          };

          // Add the "Total" row to the beginning of the array
          // generateReportsDBResult.unshift(totalRow);

          // Add the "Total" row to the end of the array
          generateReportsDBResult.push(totalRow);

          let data = null;
		
		
		if (generateReportsRequest?.userTypeRole == 4) {
			console.log("inside Master Agent")
  // Master Agent Report: Remove more columns to keep it concise
  data = await reports.generateCSVReport(
    [
     { id: "BillNumber", title: "Bill Number" },
      { id: "ActualBillingDate", title: "Billing Date" },
      { id: "GuestName", title: "Guest Name" },
      { id: "TotalGuestCount", title: "Total Guest Count" },
     // { id: "TotalBillAmount", title: "Total Bill Amount" },
	{ id: "PackageName", title: "PackageName" },
      { id: "PaymentMode", title: "Payment Mode" },
      { id: "TravelAgentName", title: "Travel Agent Name" },
     // { id: "bookingCommission", title: "Booking Commission" },
    ],
    generateReportsDBResult,
    "csv",
    "Module",
  	"E:/React/CasinoPride2BE/reports/csv"
		)}else
			//edit code end
			if (generateReportsRequest?.isAgentPanel) {
            
			data = await reports.generateCSVReport(
              [
                // { id: "BillingId", title: "BillingId" },
                { id: "BillNumber", title: "BillNumber" },
                { id: "ActualBillingDate", title: "Billing Date" },
                { id: "ActualBillingTime", title: "Billing Time" },
                { id: "IsVoid", title: "Is Void" },
                { id: "GuestName", title: "Guest Name" },
                { id: "TotalGuestCount", title: "Total Guest Count" },
                // { id: "cashAmount", title: "Cash Amount" },
                // { id: "cardAmount", title: "Card Amount" },
                // { id: "upiAmount", title: "UPI Amount" },
                // { id: "onlinePayu", title: "Online Payu" },
                // { id: "settledByCompany", title: "Settle By Company" },
                { id: "TotalBillAmount", title: "Total Bill Amount" },
                { id: "PaymentMode", title: "Payment Mode" },
                // { id: "ShiftId", title: "Shift Type" },
                // { id: "upiId", title: "UPI Id" },
                // { id: "cardHoldersName", title: "CardHolders Name" },
                // { id: "cardNumber", title: "Card Number" },
                // { id: "cardType", title: "Card Type" },
                { id: "PackageName", title: "PackageName" },
                // { id: "ItemName", title: "Item Name" },
                // { id: "packageGuestCount", title: "Package Guest Count" },
                // { id: "KidsCount", title: "Kids Count" },
                // { id: "KidsItemName", title: "Kids Item Name" },
                // { id: "KidsRate", title: "Kids Rate" },
                // // { id: "Rate", title: "Rate" },
                // {id: "gstTaxable", title: "GST Taxable" },
                // { id: "vatTaxable", title: "VAT Taxable" },
                // { id: "CGST 14 %", title: "CGST 14 %" },
                // { id: "SGST 14 %", title: "SGST 14 %" },
                // { id: "CGST 9 %", title: "CGST 9 %" },
                // { id: "SGST 9 %", title: "SGST 9 %" },
                // { id: "VAT 22 %", title: "VAT 22 %" },
                // { id: "ItemTaxName", title: "TaxName" },
                // { id: "ItemTax", title: "ItemTax" },
                // { id: "Address", title: "Address"},
                // { id: "Phone", title: "Guest Phone" },
                // { id: "Email", title: "Guest Email" },
                // { id: "GSTNumber", title: "GST Number" },
                // { id: "BookingId", title: "BookingId" },
                // { id: "LocalAgentName", title: "LocalAgentName" },
                { id: "TravelAgentName", title: "TravelAgentName" },
                // { id: "UsersName", title: "UsersName" },
                { id: "bookingCommission", title: "Booking Commission" },
              ],
              generateReportsDBResult,
              "csv",
              "Module",
              // "casinopridefiles/",
              `E:/React/CasinoPride2BE/reports/csv`
	);
	}else{
//		const originalTotalSettledAmount = generateReportsDBResult.reduce(
 // (sum, item) => {
   // const totalBillAmount = parseFloat(item["TotalBillAmount"]);
  //  return isNaN(totalBillAmount) ? sum : sum + totalBillAmount;
 // },
 // 0
//);
//console.log("total amount which is settled ->>> ", originalTotalSettledAmount);
//generateReportsDBResult = generateReportsDBResult.map((row) => {
 // const allPaymentsZero =
  //  (row.CashAmount || 0) === 0 &&
   // (row.CardAmount || 0) === 0 &&
   // (row.UPIAmount || 0) === 0 &&
   // (row.OnlinePayu || 0) === 0;

 // return {
  //  ...row,
  //  CashAmount: row.CashAmount === 0 ? "" : row.CashAmount,
  //  CardAmount: row.CardAmount === 0 ? "" : row.CardAmount,
   // UPIAmount: row.UPIAmount === 0 ? "" : row.UPIAmount,
  //  OnlinePayu: row.OnlinePayu === 0 ? "" : row.OnlinePayu,
  //  SettledByCompany: row.SettledByCompany === 0 ? "" : row.SettledByCompany,
  //  TotalSettledAmount: allPaymentsZero
   //   ? originalTotalSettledAmount
    //  : (row.CashAmount || 0) +
     //   (row.CardAmount || 0) +
     //   (row.UPIAmount || 0) +
     //   (row.OnlinePayu || 0) +
     //   (row.SettledByCompany || 0),
//  };
//});

console.log("inside fake repirt")
//		  console.log("AMOUNR 0")
            data = await reports.generateCSVReport(
              [
                // { id: "BillingId", title: "BillingId" },
                { id: "BillNumber", title: "BillNumber" },
                { id: "ActualBillingDate", title: "Billing Date" },
                { id: "ActualBillingTime", title: "Billing Time" },
                { id: "IsVoid", title: "Is Void" },
                { id: "GuestName", title: "Guest Name" },
                { id: "TotalGuestCount", title: "Total Guest2 Count" },
                { id: "CashAmount", title: "Cash Amount" },
                { id: "CardAmount", title: "Card Amount" },
                { id: "UPIAmount", title: "UPI Amount" },
                { id: "OnlinePayu", title: "Online Payu" },
                { id: "SettledByCompany", title: "Settle By Company" },
                { id: "TotalBillAmount", title: "Total Bill Amount" },
                { id: "PaymentMode", title: "Payment Mode" },
                { id: "ShiftId", title: "Shift Type" },
                { id: "UPIId", title: "UPI Id" },
                { id: "CardHoldersName", title: "CardHolders Name" },
                { id: "CardNumber", title: "Card Number" },
                { id: "CardType", title: "Card Type" },
                { id: "PackageName", title: "PackageName" },
                { id: "ItemName", title: "Item Name" },
                { id: "packageGuestCount", title: "Package Guest Count" },
                { id: "KidsCount", title: "Kids Count" },
                { id: "KidsItemName", title: "Kids Item Name" },
                { id: "KidsRate", title: "Kids Rate" },
                // { id: "Rate", title: "Rate" },
                { id: "gstTaxable", title: "GST Taxable" },
                { id: "vatTaxable", title: "VAT Taxable" },
                { id: "CGST 14 %", title: "CGST 14 %" },
                { id: "SGST 14 %", title: "SGST 14 %" },
                {
                  id: [`Kids CGST ${TeensTax / 2} %`],
                  title: [`Kids CGST ${TeensTax / 2} %`],
                },
                {
                  id: [`Kids SGST ${TeensTax / 2} %`],
                  title: [`Kids SGST ${TeensTax / 2} %`],
                },
                { id: "VAT 22 %", title: "VAT 22 %" },
                { id: "ItemTaxName", title: "TaxName" },
                { id: "ItemTax", title: "ItemTax" },
                { id: "Address", title: "Address" },
                { id: "Phone", title: "Guest Phone" },
                { id: "Email", title: "Guest Email" },
                { id: "GSTNumber", title: "GST Number" },
                { id: "BookingId", title: "BookingId" },
                { id: "LocalAgentName", title: "LocalAgentName" },
                { id: "TravelAgentName", title: "TravelAgentName" },
                { id: "UsersName", title: "UsersName" },
                { id: "bookingCommission", title: "Booking Commission" },
              ],
              generateReportsDBResult,
              "csv",
              "Module",
              // "casinopridefiles/"
              `E:/React/CasinoPride2BE/reports/csv`
            );
          }
          const url = data.fileLink;
          // Require the 'url' and 'path' modules
          const { parse } = require("url");
          const path = require("path");

          // Parse the URL
          const parsedUrl = parse(url);

          // Extract the filename from the path
          const filename = path.basename(parsedUrl.pathname);
          // response(functionContext, responseObj,generateReportsDBResult);
          let uploadReportFileDBResult = await reportsService.uploadReportFile(
            functionContext,
            generateReportsRequest,
            filename
          );
          if (uploadReportFileDBResult.ReportFile != null) {
            const s3 = new AWS.S3({
              accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
              signatureVersion: "v4",
              region: "ap-south-1",
            });

            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
            });
            uploadReportFileDBResult.ReportFile = imageUrl;
            uploadReportFileDBResult.ReportFile = imageUrl;
            response(functionContext, responseObj, uploadReportFileDBResult);
          } else {
            response(functionContext, responseObj, uploadReportFileDBResult);
          }
        } else if (
          generateReportsRequest.settlementDate == null &&
          generateReportsRequest.settlementUpdateDate != null
        ) {
          let generateReportsDBResult =
            await reportsService.generateReportsForAgentSettlementForSettlementUpdateDate(
              functionContext,
              generateReportsRequest
            );
          // Process and modify the UpdatedItemDetails property
          generateReportsDBResult.forEach((item) => {
            TeensTax = item.TeensTax;
            const itemDetails =
              item?.UpdatedItemDetails != null &&
              JSON.parse(item?.UpdatedItemDetails?.replace(/'/g, '"'));
            // Check if UpdatedItemDetails is not an empty object
            if (Object.keys(itemDetails).length !== 0) {
              // Extract key-value pairs and assign them to UpdatedItemDetails
              item.UpdatedItemDetails = Object.entries(itemDetails)
                .map(([key, value]) => {
                  // Add each key as a separate column
                  item[key] = value;
                  return `${key}:${value}`;
                })
                .join(", ");
            } else {
              item.UpdatedItemDetails = ""; // Set to an empty string if it's empty or '{}'
            }

            // Remove square brackets and quotes from PackageGuestCount
            item.PackageGuestCount = item?.PackageGuestCount?.replace(
              /\[|\]|"/g,
              ""
            );

            // Remove square brackets and quotes from PackageName
            item.PackageName = item?.PackageName?.replace(/\[|\]|"/g, "");
          });
          const rateSum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "Rate" value to a number and add it to the sum
            const rate = parseFloat(item.Rate);
            return isNaN(rate) ? sum : sum + rate;
          }, 0);
          const gstTaxableSum = generateReportsDBResult.reduce((sum, item) => {
            const gstTaxable =
              item.ItemTaxName === "GST" ? parseFloat(item.Rate) : 0;
            return isNaN(gstTaxable) ? sum : sum + gstTaxable;
          }, 0);

          const vatTaxableSum = generateReportsDBResult.reduce((sum, item) => {
            const vatTaxable =
              item.ItemTaxName === "VAT" ? parseFloat(item.Rate) : 0;
            return isNaN(vatTaxable) ? sum : sum + vatTaxable;
          }, 0);
          // Calculate the sum of the "CGST 14 %" column
          const cgst14Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "CGST 14 %" value to a number and add it to the sum
            const cgst14 = parseFloat(item["CGST 14 %"]);
            return isNaN(cgst14) ? sum : sum + cgst14;
          }, 0);
          // Calculate the sum of the "SGST 14 %" column
          const sgst14Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "SGST 14 %" value to a number and add it to the sum
            const sgst14 = parseFloat(item["SGST 14 %"]);
            return isNaN(sgst14) ? sum : sum + sgst14;
          }, 0);

          // Calculate the sum of the "CGST 9 %" column
          const cgst9Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "CGST 9 %" value to a number and add it to the sum
            const cgst9 = parseFloat(item[`Kids CGST ${TeensTax / 2} %`]);
            return isNaN(cgst9) ? sum : sum + cgst9;
          }, 0);

          // Calculate the sum of the "SGST 9 %" column
          const sgst9Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "SGST 9 %" value to a number and add it to the sum
            const sgst9 = parseFloat(item[`Kids SGST ${TeensTax / 2} %`]);
            return isNaN(sgst9) ? sum : sum + sgst9;
          }, 0);

          // Calculate the sum of the "VAT 22 %" column
          const vat22Sum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "VAT 22 %" value to a number and add it to the sum
            const vat22 = parseFloat(item["VAT 22 %"]);
            return isNaN(vat22) ? sum : sum + vat22;
          }, 0);

          // Calculate the sum of the "Kids Rate" column
          const kidsRateSum = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "Kids Rate" value to a number and add it to the sum
            const kidsRate = parseFloat(item["KidsRate"]);
            return isNaN(kidsRate) ? sum : sum + kidsRate;
          }, 0);

          // Calculate the sum of the "Total Bill Amount" column
          const totalBillAmountSum = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalBillAmount = parseFloat(item["TotalBillAmount"]);
              return isNaN(totalBillAmount) ? sum : sum + totalBillAmount;
            },
            0
          );
          const totalCashAmount = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalCashAmount = parseFloat(item["cashAmount"]);
              return isNaN(totalCashAmount) ? sum : sum + totalCashAmount;
            },
            0
          );
          const totalCardAmount = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalCardAmount = parseFloat(item["cardAmount"]);
              return isNaN(totalCardAmount) ? sum : sum + totalCardAmount;
            },
            0
          );
          const totalUPIAmount = generateReportsDBResult.reduce((sum, item) => {
            // Convert the "Total Bill Amount" value to a number and add it to the sum
            const totalUPIAmount = parseFloat(item["upiAmount"]);
            return isNaN(totalUPIAmount) ? sum : sum + totalUPIAmount;
          }, 0);
          const totalBookingCommissionAmount = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalBookingCommissionAmount = parseFloat(
                item["bookingCommission"]
              );
              return isNaN(totalBookingCommissionAmount)
                ? sum
                : sum + totalBookingCommissionAmount;
            },
            0
          );

          const totalSettleByCompany = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalSettleByCompany = parseFloat(item["settledByCompany"]);
              return isNaN(totalSettleByCompany)
                ? sum
                : sum + totalSettleByCompany;
            },
            0
          );

          const totalOnlinePayu = generateReportsDBResult.reduce(
            (sum, item) => {
              // Convert the "Total Bill Amount" value to a number and add it to the sum
              const totalOnlinePayu = parseFloat(item["onlinePayu"]);
              return isNaN(totalOnlinePayu) ? sum : sum + totalOnlinePayu;
            },
            0
          );
          // Add two empty rows
          generateReportsDBResult.push({}, {});
          // Add the sum to the report data
          // generateReportsDBResult.push({ Rate: rateSum });

          // Create a new object with "Total" label and sums for relevant columns
          const totalRow = {
            BillNumber: "Total",
            gstTaxable: gstTaxableSum,
            vatTaxable: vatTaxableSum,
            // 'Rate':rateSum,
            "CGST 14 %": cgst14Sum,
            "SGST 14 %": sgst14Sum,
            [`Kids CGST ${TeensTax / 2} %`]: cgst9Sum,
            [`Kids SGST ${TeensTax / 2} %`]: sgst9Sum,
            "VAT 22 %": vat22Sum,
            KidsRate: kidsRateSum,
            TotalBillAmount: totalBillAmountSum,
            cashAmount: totalCashAmount,
            cardAmount: totalCardAmount,
            upiAmount: totalUPIAmount,
            bookingCommission: totalBookingCommissionAmount,
            settledByCompany: totalSettleByCompany,
            onlinePayu: totalOnlinePayu,
            // Add more properties for other columns as needed
          };

          // Add the "Total" row to the beginning of the array
          // generateReportsDBResult.unshift(totalRow);

          // Add the "Total" row to the end of the array
          generateReportsDBResult.push(totalRow);

          const data = await reports.generateCSVReport(
            [
              // { id: "BillingId", title: "BillingId" },
              { id: "BillNumber", title: "BillNumber" },
              { id: "ActualBillingDate", title: "Billing Date" },
              { id: "ActualBillingTime", title: "Billing Time" },
              { id: "IsVoid", title: "Is Void" },
              { id: "GuestName", title: "Guest Name" },
              { id: "TotalGuestCount", title: "Total Guest Count" },
              { id: "cashAmount", title: "Cash Amount" },
              { id: "cardAmount", title: "Card Amount" },
              { id: "upiAmount", title: "UPI Amount" },
              { id: "onlinePayu", title: "Online Payu" },
              { id: "settledByCompany", title: "Settle By Company" },
              { id: "TotalBillAmount", title: "Total Bill Amount" },
              { id: "PaymentMode", title: "Payment Mode" },
              { id: "ShiftId", title: "Shift Type" },
              { id: "upiId", title: "UPI Id" },
              { id: "cardHoldersName", title: "CardHolders Name" },
              { id: "cardNumber", title: "Card Number" },
              { id: "cardType", title: "Card Type" },
              { id: "PackageName", title: "PackageName" },
              { id: "ItemName", title: "Item Name" },
              { id: "packageGuestCount", title: "Package Guest Count" },
              { id: "KidsCount", title: "Kids Count" },
              { id: "KidsItemName", title: "Kids Item Name" },
              { id: "KidsRate", title: "Kids Rate" },
              { id: "gstTaxable", title: "GST Taxable" },
              { id: "vatTaxable", title: "VAT Taxable" },
              // { id: "Rate", title: "Rate" },
              { id: "CGST 14 %", title: "CGST 14 %" },
              { id: "SGST 14 %", title: "SGST 14 %" },
              {
                id: [`Kids CGST ${TeensTax / 2} %`],
                title: [`Kids CGST ${TeensTax / 2} %`],
              },
              {
                id: [`Kids SGST ${TeensTax / 2} %`],
                title: [`Kids SGST ${TeensTax / 2} %`],
              },
              { id: "VAT 22 %", title: "VAT 22 %" },
              { id: "ItemTaxName", title: "TaxName" },
              { id: "ItemTax", title: "ItemTax" },
              { id: "Address", title: "Address" },
              { id: "Phone", title: "Guest Phone" },
              { id: "Email", title: "Guest Email" },
              { id: "GSTNumber", title: "GST Number" },
              { id: "BookingId", title: "BookingId" },
              { id: "LocalAgentName", title: "LocalAgentName" },
              { id: "TravelAgentName", title: "TravelAgentName" },
              { id: "UsersName", title: "UsersName" },
              { id: "bookingCommission", title: "Booking Commission" },
            ],
            generateReportsDBResult,
            "csv",
            "Module",
            // "casinopridefiles/"
            `E:/React/CasinoPride2BE/reports/csv`
          );
          console.log(generateReportsDBResult);
          const url = data.fileLink;
          // Require the 'url' and 'path' modules
          const { parse } = require("url");
          const path = require("path");

          // Parse the URL
          const parsedUrl = parse(url);

          // Extract the filename from the path
          const filename = path.basename(parsedUrl.pathname);
          // response(functionContext, responseObj,generateReportsDBResult);
          let uploadReportFileDBResult = await reportsService.uploadReportFile(
            functionContext,
            generateReportsRequest,
            filename
          );
          if (uploadReportFileDBResult.ReportFile != null) {
            const s3 = new AWS.S3({
              accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
              signatureVersion: "v4",
              region: "ap-south-1",
            });

            let imageUrl = s3.getSignedUrl("getObject", {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
            });
            uploadReportFileDBResult.ReportFile = imageUrl;
            uploadReportFileDBResult.ReportFile = imageUrl;
            response(functionContext, responseObj, uploadReportFileDBResult);
          } else {
            response(functionContext, responseObj, uploadReportFileDBResult);
          }
        }
      }
    } catch (errGenerateReports) {
      if (!errGenerateReports.ErrorMessage && !errGenerateReports.ErrorCode) {
        // logger.logInfo(`generateReportsDBResult :: Error :: ${errGenerateReports}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `generateReportsDBResult :: Error :: ${JSON.stringify(
          errGenerateReports
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  generateNoShowReport: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`generateNoShowReport() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "generateNoShowReport",
      model: new responseModel.generateNoShowReport(),
    };

    let generateNoShowReportRequest = new requestModel.generateNoShowReport(
      req
    );

    // logger.logInfo(`generateNoShowReport() :: Request Object :: ${generateNoShowReportRequest}`);

    let validateRequest = validate.generateNoShowReport(
      generateNoShowReportRequest
    );

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `generateNoShowReport() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let generateNoShowReportDBResult = [];
      //Generate Report By user
      generateNoShowReportDBResult = await reportsService.generateNoShowReport(
        functionContext,
        generateNoShowReportRequest
      );

      generateNoShowReportDBResult?.forEach((item) => {
        // Check if PackageName is not null or undefined
        if (item?.PackageName) {
          // Remove single quotes and square brackets
          const cleanedPackageNames = item?.PackageName.replace(/'/g, "")
            .replace(/\[/g, "")
            .replace(/\]/g, "");
          const cleanedPackageGuestCount = item?.PackageGuestCount.replace(
            /'/g,
            ""
          )
            .replace(/\[/g, "")
            .replace(/\]/g, "");

          // Split the string into an array based on comma and trim spaces
          const PackageNames = cleanedPackageNames
            ?.split(",")
            .map((name) => name.trim());
          const PackageGuestCounts = cleanedPackageGuestCount
            ?.split(",")
            .map((name) => name.trim());

          // Remove double quotes from each element in the array
          const modifiedPackageNames = PackageNames?.map((name) =>
            name.replace(/"/g, "")
          );
          const modifiedPackageGuestCounts = PackageGuestCounts?.map((name) =>
            name.replace(/"/g, "")
          );

          // Replace original PackageName and PackageGuestCount with modified PackageNames and PackageGuestCounts
          item.PackageName = modifiedPackageNames;
          item.PackageGuestCount = modifiedPackageGuestCounts;

          if (item?.PanelDiscount > 0) {
            const discountAmount =
              (item?.PanelDiscount / 100) * item?.TeensPrice;
            item.TeensPrice = item?.TeensPrice - discountAmount;
          } else if (item?.CouponDiscount > 0) {
            const discountAmount =
              (item?.CouponDiscount / 100) * item?.TeensPrice;
            item.TeensPrice = item?.TeensPrice - discountAmount;
          } else if (item?.WebsiteDiscount > 0) {
            const discountAmount =
              (item?.WebsiteDiscount / 100) * item?.TeensPrice;
            item.TeensPrice = item?.TeensPrice - discountAmount;
          } else if (item?.AgentPanelDiscount > 0) {
            const discountAmount =
              (item?.AgentPanelDiscount / 100) * item?.TeensPrice;
            item.TeensPrice = item?.TeensPrice - discountAmount;
          }
        }
      });

      // Function to calculate the total amount based on weekday or weekend
      const calculateTotalAmount = (booking) => {
        const bookingDate = new Date(booking?.FutureDate);
        const dayOfWeek = bookingDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // 0 is Sunday,5 is friday(because in package prices we consider friday as weekend as well), 6 is Saturday
        const packagePrices = isWeekend
          ? booking.PackageWeekendPrice
          : booking.PackageWeekdayPrice;
        const packageGuestCounts = booking.PackageGuestCount.map(Number); // Convert string array to numbers
        let totalAmount = JSON.parse(packagePrices).reduce(
          (sum, price, index) => {
            const totalPrice = parseInt(price) * packageGuestCounts[index];
            return sum + totalPrice;
          },
          0
        );
        if (booking?.PanelDiscount > 0) {
          const discountAmount = (booking?.PanelDiscount / 100) * totalAmount;
          totalAmount = totalAmount - discountAmount;
        } else if (booking?.CouponDiscount > 0) {
          const discountAmount = (booking?.CouponDiscount / 100) * totalAmount;
          totalAmount = totalAmount - discountAmount;
        } else if (booking?.WebsiteDiscount > 0) {
          const discountAmount = (booking?.WebsiteDiscount / 100) * totalAmount;
          totalAmount = totalAmount - discountAmount;
        } else if (booking?.AgentPanelDiscount > 0) {
          const discountAmount =
            (booking?.AgentPanelDiscount / 100) * totalAmount;
          totalAmount = totalAmount - discountAmount;
        }
        return totalAmount;
      };
      // Loop through each booking and calculate the total amount
      generateNoShowReportDBResult.forEach((booking) => {
        const totalAmount = calculateTotalAmount(booking);
        booking.TotalAmount = totalAmount;
      });

      // Calculate the sum of the required columns
      const totalAmountSum = generateNoShowReportDBResult.reduce(
        (sum, item) => {
          // Convert the "AmountAfterDiscount" value to a number and add it to the sum
          const totalAmountSum = parseFloat(item["AmountAfterDiscount"]);
          return isNaN(totalAmountSum) ? sum : sum + totalAmountSum;
        },
        0
      );

      const totalPackageSum = generateNoShowReportDBResult.reduce(
        (sum, item) => {
          const totalPackageSum = parseFloat(item["TotalAmount"]);
          return isNaN(totalPackageSum) ? sum : sum + totalPackageSum;
        },
        0
      );

      const totalCashAmount = generateNoShowReportDBResult.reduce(
        (sum, item) => {
          const totalCashAmount = parseFloat(item["CashAmount"]);
          return isNaN(totalCashAmount) ? sum : sum + totalCashAmount;
        },
        0
      );

      const totalCardAmount = generateNoShowReportDBResult.reduce(
        (sum, item) => {
          const totalCardAmount = parseFloat(item["CardAmount"]);
          return isNaN(totalCardAmount) ? sum : sum + totalCardAmount;
        },
        0
      );

      const totalUPIAmount = generateNoShowReportDBResult.reduce(
        (sum, item) => {
          const totalUPIAmount = parseFloat(item["UPIAmount"]);
          return isNaN(totalUPIAmount) ? sum : sum + totalUPIAmount;
        },
        0
      );

      const totalTeensAmount = generateNoShowReportDBResult.reduce(
        (sum, item) => {
          const totalTeensAmount = parseFloat(item["TeensPrice"]);
          return isNaN(totalTeensAmount) ? sum : sum + totalTeensAmount;
        },
        0
      );

      // Add two empty rows
      generateNoShowReportDBResult.push({}, {});

      // Create a new object with "totalRow" label and sums for relevant columns
      const totalRow = {
        AmountAfterDiscount: totalAmountSum,
        CashAmount: totalCashAmount,
        CardAmount: totalCardAmount,
        UPIAmount: totalUPIAmount,
        TotalAmount: totalPackageSum,
        TeensPrice: totalTeensAmount,
        // Add more properties for other columns as needed
      };
      generateNoShowReportDBResult.push(totalRow);

      const data = await reports.generateCSVReport(
        [
          { id: "BookingId", title: "BookingId" },
          { id: "TotalGuestCount", title: "Total Guest Count" },
          { id: "GuestName", title: "Guest Name" },
          { id: "Address", title: "Address" },
          { id: "Phone", title: "Guest Phone" },
          { id: "Email", title: "Guest Email" },
          { id: "ShiftId", title: "Shift Type" },
          { id: "UsersName", title: "UsersName" },
          { id: "TravelAgentName", title: "Travel Agent Name" },
          { id: "AmountAfterDiscount", title: "Actual Amount" },
          { id: "GSTNumber", title: "GST Number" },
          { id: "FutureDate", title: "Event Date" },
          { id: "NumOfTeens", title: "Kids Count" },
          // { id: "TeensRate", title: "Kids Rate" },
          { id: "TeensPrice", title: "Kids Price" },
          { id: "PackageName", title: "Package Name" },
          { id: "PackageGuestCount", title: "Package Guest Count" },
          { id: "TotalAmount", title: "Package Total Amount" },
          { id: "PaymentMode", title: "Payment Mode" },
          { id: "CashAmount", title: "Cash Amount" },
          { id: "CardAmount", title: "Card Amount" },
          { id: "UPIAmount", title: "UPI Amount" },
          { id: "UPIId", title: "UPI Id" },
          { id: "CardHoldersName", title: "CardHolders Name" },
          { id: "CardNumber", title: "Card Number" },
          { id: "CardType", title: "Card Type" },
        ],
        generateNoShowReportDBResult,
        "csv",
        "Module",
        `E:/React/CasinoPride2BE/reports/csv`
      );

      const url = data.fileLink;
      // Require the 'url' and 'path' modules
      const { parse } = require("url");
      const path = require("path");

      // Parse the URL
      const parsedUrl = parse(url);

      // Extract the filename from the path
      const filename = path.basename(parsedUrl.pathname);
      let uploadReportFileDBResult = await reportsService.uploadReportFile(
        functionContext,
        generateNoShowReportRequest,
        filename
      );
      if (uploadReportFileDBResult.ReportFile != null) {
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });

        let imageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
        });
        uploadReportFileDBResult.ReportFile = imageUrl;
        uploadReportFileDBResult.ReportFile = imageUrl;
        response(functionContext, responseObj, uploadReportFileDBResult);
      } else {
        response(functionContext, responseObj, uploadReportFileDBResult);
      }
    } catch (errGenerateNoShowReport) {
      if (
        !errGenerateNoShowReport.ErrorMessage &&
        !errGenerateNoShowReport.ErrorCode
      ) {
        // logger.logInfo(`generateNoShowReportDBResult :: Error :: ${errGenerateNoShowReport}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `generateNoShowReportDBResult :: Error :: ${JSON.stringify(
          errGenerateNoShowReport
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
  cashierReport: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`cashierReport() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "cashierReport",
      model: new responseModel.cashierReport(),
    };

    let cashierReportRequest = new requestModel.cashierReport(req);

    // logger.logInfo(`cashierReport() :: Request Object :: ${cashierReportRequest}`);

    let validateRequest = validate.cashierReport(cashierReportRequest);

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `cashierReport() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let cashierReportDBResult = await reportsService.cashierReport(
        functionContext,
        cashierReportRequest
      );
      // response(functionContext, responseObj,cashierReportDBResult);
      const GrandTotal =
        cashierReportDBResult?.TotalCashAmount +
        cashierReportDBResult?.TotalCardAmount +
        cashierReportDBResult?.TotalUPIAmount +
        cashierReportDBResult?.TotalOnline +
        cashierReportDBResult?.TotalSettleByCompany;
      // cashierReportDBResult?.TotalMasterCardAmount +
      // cashierReportDBResult?.TotalVISAAmount +
      // cashierReportDBResult?.TotalRupayAmount +
      // cashierReportDBResult?.TotalOtherCardTypeAmount;

      const cashierReportArray = [];
      cashierReportArray.push({
        ...cashierReportDBResult,
        GrandTotal,
        Date: cashierReportRequest?.date,
      });

      //generating reports
      const data = await reportsRowWise.generateCSVReport(
        [
          { id: "Date", title: "Date" },
          { id: "TotalBills", title: "Total Bills" },
          { id: "BillsStart", title: "Bills Start" },
          { id: "BillsEnd", title: "Bills End" },
          { id: "TotalCashAmount", title: "Total Cash Amount" },
          { id: "TotalCardAmount", title: "Total Card Amount" },
          { id: "TotalUPIAmount", title: "Total UPI Amount" },
          { id: "TotalOnline", title: "Online Payment (Payu)" },
          { id: "TotalSettleByCompany", title: "Settle By Company" },
          { id: "TotalMasterCardAmount", title: "Total MasterCard Amount" },
          { id: "TotalVISAAmount", title: "Total VISA Amount" },
          { id: "TotalRupayAmount", title: "Total Rupay Amount" },
          { id: "TotalOtherCardTypeAmount", title: "Others" },
          {
            id: "GrandTotal",
            title:
              "Grand Total (TotalCashAmount+TotalCardAmount+TotalUPIAmount+TotalOnline)",
          },
        ],
        cashierReportArray,
        "csv",
        "Module",
        `E:/React/CasinoPride2BE/reports/csv`
      );

      const url = data.fileLink;
      // Require the 'url' and 'path' modules
      const { parse } = require("url");
      const path = require("path");

      // Parse the URL
      const parsedUrl = parse(url);

      // Extract the filename from the path
      const filename = path.basename(parsedUrl.pathname);
      let uploadReportFileDBResult = await reportsService.uploadReportFile(
        functionContext,
        cashierReportRequest,
        filename
      );
      if (uploadReportFileDBResult.ReportFile != null) {
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });

        let imageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
        });
        uploadReportFileDBResult.ReportFile = imageUrl;
        uploadReportFileDBResult.ReportFile = imageUrl;
        response(functionContext, responseObj, uploadReportFileDBResult);
      } else {
        response(functionContext, responseObj, uploadReportFileDBResult);
      }
    } catch (errCashierReport) {
      if (!errCashierReport.ErrorMessage && !errCashierReport.ErrorCode) {
        // logger.logInfo(`cashierReportDBResult :: Error :: ${errCashierReport}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `cashierReportDBResult :: Error :: ${JSON.stringify(errCashierReport)}`
      );
      response(functionContext, responseObj, null);
    }
  },
  cashierReportShiftWise: async (req, res) => {
    let logger = new applib.Logger(req.originalUrl);

    logger.logInfo(`cashierReportShiftWise() invoked!!`);

    let functionContext = {
      error: null,
      res: res,
      logger: logger,
      currentTs: momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "),
    };

    const responseObj = {
      name: "cashierReportShiftWise",
      model: new responseModel.cashierReportShiftWise(),
    };

    let cashierReportShiftWiseRequest = new requestModel.cashierReportShiftWise(
      req
    );

    // logger.logInfo(`cashierReportShiftWise() :: Request Object :: ${cashierReportShiftWiseRequest}`);

    let validateRequest = validate.cashierReportShiftWise(
      cashierReportShiftWiseRequest
    );

    if (validateRequest.error) {
      functionContext.error = new ErrorModel(
        validateRequest.error.details[0]["message"],
        errorCode.invalidRequest
      );
      logger.logInfo(
        `cashierReportShiftWise() Error:: Invalid Request :: ${JSON.stringify(
          validateRequest
        )}`
      );
      response(functionContext, responseObj, null);
      return;
    }

    try {
      let cashierReportShiftWiseDBResult =
        await reportsService.cashierReportShiftWise(
          functionContext,
          cashierReportShiftWiseRequest
        );
      console.log({ cashierReportShiftWiseDBResult });
      // response(functionContext, responseObj,cashierReportShiftWiseDBResult);
      const GrandTotal =
        cashierReportShiftWiseDBResult?.TotalCashAmount +
        cashierReportShiftWiseDBResult?.TotalCardAmount +
        cashierReportShiftWiseDBResult?.TotalUPIAmount +
        cashierReportShiftWiseDBResult?.TotalOnline +
        cashierReportShiftWiseDBResult?.TotalSettleByCompany;
      //cashierReportShiftWiseDBResult?.TotalMasterCardAmount +
      //cashierReportShiftWiseDBResult?.TotalVISAAmount +
      //cashierReportShiftWiseDBResult?.TotalRupayAmount +
      //cashierReportShiftWiseDBResult?.TotalOtherCardTypeAmount;

      const cashierReportArray = [];
      cashierReportArray.push({
        ...cashierReportShiftWiseDBResult,
        GrandTotal,
        Date: cashierReportShiftWiseRequest?.date,
        Shift: cashierReportShiftWiseRequest?.shiftId,
      });

      //generating reports
      const data = await reportsRowWise.generateCSVReport(
        [
          { id: "Date", title: "Date" },
          { id: "Shift", title: "Shift" },
          { id: "TotalBills", title: "Total Bills" },
          { id: "BillsStart", title: "Bills Start" },
          { id: "BillsEnd", title: "Bills End" },
          { id: "TotalCashAmount", title: "Total Cash Amount" },
          { id: "TotalCardAmount", title: "Total Card Amount" },
          { id: "TotalUPIAmount", title: "Total UPI Amount" },
          { id: "TotalOnline", title: "Online Payment (Payu)" },
          { id: "TotalSettleByCompany", title: "Settle By Company" },
          { id: "TotalMasterCardAmount", title: "Total MasterCard Amount" },
          { id: "TotalVISAAmount", title: "Total VISA Amount" },
          { id: "TotalRupayAmount", title: "Total Rupay Amount" },
          { id: "TotalOtherCardTypeAmount", title: "Others" },
          {
            id: "GrandTotal",
            title:
              "Grand Total (TotalCashAmount+TotalCardAmount+TotalUPIAmount+TotalOnline)",
          },
        ],
        cashierReportArray,
        "csv",
        "Module",
        `E:/React/CasinoPride2BE/reports/csv`
      );

      const url = data.fileLink;
      // Require the 'url' and 'path' modules
      const { parse } = require("url");
      const path = require("path");

      // Parse the URL
      const parsedUrl = parse(url);

      // Extract the filename from the path
      const filename = path.basename(parsedUrl.pathname);
      let uploadReportFileDBResult = await reportsService.uploadReportFile(
        functionContext,
        cashierReportShiftWiseRequest,
        filename
      );
      if (uploadReportFileDBResult.ReportFile != null) {
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: "v4",
          region: "ap-south-1",
        });

        let imageUrl = s3.getSignedUrl("getObject", {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: "casinopridefiles/" + uploadReportFileDBResult.ReportFile,
        });
        uploadReportFileDBResult.ReportFile = imageUrl;
        uploadReportFileDBResult.ReportFile = imageUrl;
        response(functionContext, responseObj, uploadReportFileDBResult);
      } else {
        response(functionContext, responseObj, uploadReportFileDBResult);
      }
    } catch (errCashierReport) {
      if (!errCashierReport.ErrorMessage && !errCashierReport.ErrorCode) {
        // logger.logInfo(`cashierReportShiftWiseDBResult :: Error :: ${errCashierReport}`);
        functionContext.error = new ErrorModel(
          errorMessage.applicationError,
          errorCode.applicationError
        );
      }
      logger.logInfo(
        `cashierReportShiftWiseDBResult :: Error :: ${JSON.stringify(
          errCashierReport
        )}`
      );
      response(functionContext, responseObj, null);
    }
  },
};

module.exports = reportsController;
