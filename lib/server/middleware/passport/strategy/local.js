/*
 * Copyright (c) 2015.
 * Ali Sait TEKE
 */

/*
 * ultimate.server.middleware.passport.local
 */

'use strict';

var util = require('util');

var passportLocal = require('passport-local');

var _app = null;

/**
 * Attach local strategy.
 *
 * @private
 * @return {undefined}
 */

exports.attach = function (app) {
  return new passportLocal.Strategy(function (username, password, done) {
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
  })
};

