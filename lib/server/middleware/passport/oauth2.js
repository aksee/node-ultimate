/*
 * Copyright (c) 2015.
 * Ali Sait TEKE
 */

'use strict';

var util = require('util');
var oauth2orize = require('oauth2orize');
var requireDir = require("require-dir");
var serilalizers = requireDir("./serializers");
var strategies = requireDir("./strategy");
var passport = require('passport');

var _app = null;
// CREATE SERVER


/**
 * Attach passport middleware.
 *
 * @param {App} app Application.
 * @return {undefined}
 */
function attach(app) {

  var server = oauth2orize.createServer();

  server.serializeClient(serilalizers.client.serializeClient(app));
  server.deserializeClient(serilalizers.client.deserializeClient(app));

  passport.serializeUser(serilalizers.user.serializeUser(app));
  passport.deserializeUser(serilalizers.user.deserializeUser(app));


  server.grant(strategies.code.attach(app));
  server.exchange(strategies.code.exchange(app));
  server.exchange(strategies.refresh_token.attach(app));
  server.exchange(strategies.password.attach(app));

  passport.use(strategies.local.attach(app));
  passport.use(strategies.basic.attach(app));
  passport.use(strategies.bearer.attach(app));

  server.exchange(strategies.facebook.attach(app));
  server.exchange(strategies.google.attach(app));
  server.exchange(strategies.twitter.attach(app));


  var _auth = {
    isAuthenticated: passport.authenticate(['basic', 'bearer'], {session: false}),
    isClientAuthenticated: passport.authenticate(['basic'], {session: false}),
    isBearerAuthenticated: passport.authenticate('bearer', {session: false})
  };

  _auth.token = [
    _auth.isClientAuthenticated,
    server.token(),
    server.errorHandler()
  ];

  app.auth = _auth;
  _app = app;
}

// Public API
exports.attach = attach;
