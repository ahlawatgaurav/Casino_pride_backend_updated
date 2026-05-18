const AWS = require("aws-sdk");
const multer = require("multer");
const moment = require("moment");
const fileConfiguration = require("./settings").FileConfiguration;
const fs = require("fs")

async function FileUploadFunction(file, folderName, fileUrl,BillFile,path) {

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  });

  try {
    const uploadedImage = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `casinopridefiles/${folderName}`,
        Body: fileUrl,
      })
      .promise();
    // Delete the file from the local filesystem after uploading to S3
    fs.unlink(path, (err) => {
      if (err) {
        console.log('Error deleting Bill file:',err);
      } else {
        console.log('Bill File deleted from:',path);
      }
    });

    return uploadedImage.Location;
  } catch (err) {
    logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);
    functionContext.error = new coreRequestModel.ErrorModel(
      constant.ErrorMessage.ApplicationError,

      constant.ErrorCode.ApplicationError
    );
    throw functionContext.error;
  }
}

const today = moment(new Date()).format(`DD-MM-YYYY_HH-mm-ss`);
const getFileUploadConfig = multer({
  storage: multer.diskStorage({
    destination: fileConfiguration.Storage,
    filename: function (_req, file, cb) {
      cb(null, `${today}_${file.originalname.replace(/ /g, "_")}`);
    },
  }),
  
});

module.exports.FileUploadFunction = FileUploadFunction;
module.exports.FileUploadConfig = getFileUploadConfig;
