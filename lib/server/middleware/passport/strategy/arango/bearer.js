var BearerStrategy = require('passport-http-bearer').Strategy;

exports.attach = function (app) {
  return new BearerStrategy(
    function (accessToken, callback) {
      var fn = String(function (data) {
        var db = require('org/arangodb').db;
        var tokens = db.tokens.byExample({"token": data.access_token, "type": "access"}).toArray();
        if (tokens.length > 0) {
          var token = tokens[0]
          var _user_id = "users/" + token.user_id
          var user = db.users.document(_user_id);
          return {user: user, token: token}
        }
        else {
          return false
        }
      });

      _done = function (done_results) {
        if (done_results) {
          //callback(null, false);
          var user = {
            "id": done_results.user._key,
            "demographic": done_results.user.demographic,
            "device": done_results.user.device
          };
          callback(null, user, {
            scope: done_results.token.scope,
            token: done_results.token.token,
            app_id: parseInt(done_results.token.app_id),
            roles: done_results.user.roles
          });
        } else {
          callback(null, false);
        }
      };
      _error = function (errors) {
        console.error(errors)
        callback(null, false);
      };

      app.arango.transaction({"read": ['tokens']}, fn, {access_token: accessToken}).then(_done, _error);


      //return callback(null, {id: 1, name: "ali"}, {scope: ["read", "write"], token: 123, app_id: 123});
    }
  );
};

exports.create = function (app, user_id, app_id, cb) {
  cb(null, 123)
};
