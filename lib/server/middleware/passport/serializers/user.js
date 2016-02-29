var ultimateUUID = require('../../../../util/uuid');

var token = ultimateUUID({length: 30, dash: false});
exports.serializeUser = function (_app) {
  return function (user, done) {

    done(null, {"name": "ali", accessToken: token})
  };
}


exports.deserializeUser = function (_app) {
  return function (token, done) {
    done(null, {"name": "ali", accessToken: token})
  }
}
