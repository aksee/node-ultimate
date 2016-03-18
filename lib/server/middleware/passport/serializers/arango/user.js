var ultimateUUID = require('../../../../../util/uuid');


exports.serializeUser = function (_app) {
  return function (user, done) {
    var token = ultimateUUID({length: 30, dash: false});
    done(null, {"name": "ali", accessToken: token})
  };
}


exports.deserializeUser = function (_app) {
  return function (token, done) {
    var token = ultimateUUID({length: 30, dash: false});
    done(null, {"name": "ali", accessToken: token})
  }
}
