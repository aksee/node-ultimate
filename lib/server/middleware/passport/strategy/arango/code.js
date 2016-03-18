var oauth2orize = require('oauth2orize');

exports.attach = function(app){
  return oauth2orize.grant.code(function (app, redirectUri, user, ares, callback) {
    callback(null, "code_123");
  })
};

exports.exchange = function(app){
  return oauth2orize.exchange.code(function (app, code, redirectUri, callback) {
    if (code == "123") {
      callback(null, "access_token", "refresh_token");
    } else {
      callback(null, false);
    }
  })
};
