var BasicStrategy = require('passport-http').BasicStrategy;
var util = require('util');

exports.attach = function (_app) {
  return new BasicStrategy(
    function (username, password, done) {
      if(username=="test" && password=="test"){
        return done(null, {"user_id":1});
      }else{
        return done(null, false, {message: 'Invalid password'});
      }

    }
  )
};
