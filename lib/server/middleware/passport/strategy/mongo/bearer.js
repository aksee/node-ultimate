var BearerStrategy = require('passport-http-bearer').Strategy;

exports.attach = function (app) {
  return new BearerStrategy(
    function (accessToken, callback) {

      var query = "MATCH (t:AccessToken {token:{token},active:true})<-[:HAVE]-(u:User) RETURN t as token, u as user";
      var sync = new app.sync(app)
      sync.addQuery(query, {token: accessToken}, "check");
      sync.exec(function (err, results) {

        //console.log(results);
        if (err) {
          console.error(err);
          return callback(null, false);
        }
        else {
          //console.log(results.check.length);
          //console.log(results);
          if (results.check!=undefined && results.check.length > 0) {

            var user = results.check[0].user;
            var token = results.check[0].token;
            //console.log(123);

            return callback(null, user, {scope: ["read", "write"], token: token, app_id: 123});
          } else {
            return callback(null, false);
          }
        }
      });
    }
  );
};

exports.create = function (app, user_id, app_id, cb) {
  cb(null, 123)
};
