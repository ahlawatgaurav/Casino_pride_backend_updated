class validateUser {
    constructor(req) {
      this.Username = req.body.Username ? req.body.Username : null;
      this.Password = req.body.Password ? req.body.Password : null;
    }
  }
  class loginUser {
    constructor(req) {
      this.UserId = req.body.UserId ? req.body.UserId : 0;
      this.UserType = req.body.UserType ? req.body.UserType : 0;
    }
  }
  class logoutUser {
    constructor(req) {
      this.UserId = req.body.UserId ? req.body.UserId : 0;
      this.AuthToken = req.headers.authtoken ? req.headers.authtoken : null;
    }
  }
  
  module.exports.validateUser = validateUser;
  module.exports.loginUser = loginUser;
  module.exports.logoutUser = logoutUser;
  