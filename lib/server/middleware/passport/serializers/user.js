var ultimateUUID = require('../../../../util/uuid');


exports.serializeUser = function (_app) {
  return function (user, done) {
    var createAccessToken = function () {
      var token = ultimateUUID({length: 30, dash: false});
      _app.models.User.findOne({
        accessToken: token
      }, function (err, existingUser) {
        if (err) {
          return done(err);
        }
        if (existingUser) {
          createAccessToken();
        } else {
          user.set('accessToken', token);
          user.save(function (err) {
            if (err) {
              return done(err);
            }
            return done(null, user.get('accessToken'));
          });
        }
      });
    };
    if (user._id) {
      createAccessToken();
    }
  };
}


exports.deserializeUser = function (_app) {
  return function (token, done) {
    _app.models.User.findOne({
      accessToken: token
    }, function (err, user) {
      done(err, user);
    });
  }
}
