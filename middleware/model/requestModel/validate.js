class validateRequest {
    constructor(req) {
      (this.apiUri = req.path), (this.authorization = req.headers.authorization);
      (this.appAuth = req.headers.authtoken);
    }
  }
  
  class validateResponse {
    constructor() {
      (this.Error = null), (this.Details = null);
    }
  }
  
  module.exports.ValidateRequest = validateRequest;
  module.exports.ValidateResponse = validateResponse;
  