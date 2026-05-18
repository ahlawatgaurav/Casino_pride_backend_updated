const AWS = require("aws-sdk");
let logger = require("./logger").LoggerModel
const fs = require("fs")

async function FileUploadFunction(file, folderName, fileUrl,path) {
  // const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");

  // const s3 = new AWS.S3({
  //   endpoint: spacesEndpoint,
  //   accessKeyId: process.env.AccessKeyId,
  //   secretAccessKey: process.env.SecretAccessKey,
  // });

  // const params = {
  //   Bucket: process.env.Bucket,
  //   Key: `${folderName}/${fileUrl}`,
  //   // Key: `${process.env.Folder}/${folderName}`,
  //   Body: file,
  //   ACL: "public-read",
  // };


  // try {
  //   const response = await s3.upload(params).promise();
  //   return response.Location;
  // } catch (err) {
  //   return JSON.stringify(err);
  // }

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  });

  try {
    const uploadedImage = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `casinopridefiles/${fileUrl}`,
        Body: file,
        ContentType: 'text/csv',

      })
      .promise();
          // Delete the file from the local filesystem after uploading to S3
          fs.unlink(path, (err) => {
            if (err) {
              console.log('Error deleting Csv file:',err);
            } else {
              console.log('CSV File deleted:',path);
            }
          });
    return uploadedImage.Location;
  } catch (err) {
    // logger.logInfo(`fileUpload() :: Error :: ${JSON.stringify(err)}`);
    // functionContext.error = new coreRequestModel.ErrorModel(
    //   constant.ErrorMessage.ApplicationError,

    //   constant.ErrorCode.ApplicationError
    // );
    // throw functionContext.error;
    return JSON.stringify(err);
  }
}

module.exports.uploadFile = FileUploadFunction;
