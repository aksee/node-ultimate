var oauth2orize = require('oauth2orize');
var _ = require("lodash");

exports.attach = function (_app) {

  return oauth2orize.exchange.password(function (app, email, password, scope, done) {
    var User = _app.models.User;
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
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  })
};
