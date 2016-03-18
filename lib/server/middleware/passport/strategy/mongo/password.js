var oauth2orize = require('oauth2orize');
var _ = require("lodash");

exports.attach = function (_app) {

  return oauth2orize.exchange.password(function (app, email, password, scope, done) {
    var User = _app.models.User;
    var Token = _app.models.User;
    User.findOne({'auth.local.username': username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: util.format('Unknown user "%s"', username)
        });
      }
      user.comparePassword(password, function (err, matched) {
        if (err) {
          return done(err);
        }
        if (matched) {
          var _Token = new _app.models.Token();
          _Token.user_id = user._id;
          _Token.type = "access";
          _Token.token = "test_token";
          _Token.scope = [];
          _Token.save(function (err, result) {
            //console.log(err, result)
            return done(null, _Token);
          });

        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  })
};
