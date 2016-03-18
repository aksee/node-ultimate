var BasicStrategy = require('passport-http').BasicStrategy;
var util = require('util');

exports.attach = function (_app) {
  return new BasicStrategy(
    function (username, password, done) {

      var fn = String(function (data) {
        var db = require('org/arangodb').db;
        var apps = db.apps.byExample({"_key": data.username, "secret": data.password}).toArray();
        if (apps.length > 0) {
          var app = apps[0]
          return {id: app._key, name: app.name}
        }
        else {
          return false
        }
      });

      _done = function (done_results) {
        if (done_results) {
          done(null, done_results);
        } else {
          done(null, false, {message: 'Invalid password'});
        }
      };
      _error = function (errors) {
        console.error(errors)
        done(null, false, errors);
      };

      _app.arango.transaction({"read": ['apps']}, fn, {username: username, password: password}).then(_done, _error);
    }
  )
};
