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
    return done(null, {"name": "ali", "id": 1});
  })
};

