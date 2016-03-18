var oauth2orize = require('oauth2orize');
var uid = require("./../../../../../util/uid");

exports.attach = function (_app) {
  return oauth2orize.exchange.refreshToken(function (app, code, redirectUri, callback) {
    if (code == "123") {
      var _uid = uid(64);
      callback(null, _uid);
    } else {
      callback(null, false);
    }
  })
};
