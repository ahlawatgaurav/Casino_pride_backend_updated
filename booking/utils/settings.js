module.exports.FileConfiguration = {
  FileSize: 2,
  Storage: "FileUploads2/",
  // FileUrl: process.env.FileUrl,
  secure: false,
};

module.exports.EmailCreds = {
  username: process.env.EmailUsername,
  password: process.env.EmailPassword,
};

module.exports.CRMPanelURL = `${process.env.CRM_PANEL_URL}:${process.env.CRM_PANEL_PORT}`
module.exports.billingInternalMails = ['jetty@casinoprideofficial.com', 'accounts@casinoprideofficial.com'];
// module.exports.billingInternalMails = ["aggarwalabhi1470@gmail.com"];
// module.exports.billingInternalMails = [
//   "edp@casinoprideofficial.com",
//   "viveksalgaonkar83@gmail.com",
//   "aggarwalabhi1470@gmail.com"
// ];
