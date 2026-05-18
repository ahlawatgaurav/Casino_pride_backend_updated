const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { uploadFile } = require("./fileUpload");

function checkIfDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
      // Directory doesn't exist, create it
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log("Directory created successfully.");
    } else {
      console.log("Directory already exists.");
    }
  }
  
  module.exports.generateCSVReport = async (
    dataHeaders,
    reportData,
    reportType,
    spacesFolderName,
    directoryPath
  ) => {
    checkIfDirectoryExists(directoryPath);
    return new Promise((resolve, reject) => {
      const filePath = `${directoryPath}/report_${Math.random()}.${reportType}`;
  
      const csvWriter = createCsvWriter({
        path: filePath,
        header: dataHeaders,
        // header: [{ id: 'title', title: 'Title' }, { id: 'value', title: 'Value' }],
      });
  
      const data = reportData;
      // const data = dataHeaders.map(header => ({
      //   title: header.title,
      //   value: reportData[0][header.id], // Assuming reportData is an array with a single object
      // }));
  
      csvWriter.writeRecords(data).then(async () => {
        const fileStats = fs.statSync(filePath);
  
        const response = {
          path: filePath,
          filename: filePath.split("/").pop(),
          size: fileStats.size,
          Message: `${reportType} file has been written successfully`,
        };
  
        const file = fs.readFileSync(response.path);
        const fileUpload = await uploadFile(
          file,
          spacesFolderName,
          path.basename(filePath),
          filePath
        );
  
        const returnData = { ...response, fileLink: fileUpload };
        // const returnData = { ...response};
  

        resolve(returnData);

      });
    }).catch(() => {
      return "Error writin CSV file";
    });
  };
