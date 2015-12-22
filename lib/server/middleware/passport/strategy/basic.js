var BasicStrategy = require('passport-http').BasicStrategy;
var util = require('util');

exports.attach = function (app) {
  var self = app;
  return new BasicStrategy(
    function (username, password, done) {
      var User = app.models.User;
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
    }
  )
};
