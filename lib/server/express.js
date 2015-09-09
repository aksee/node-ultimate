/*
 * ultimate.server.express
 */

'use strict';

var crypto = require('crypto'),
    path = require('path');

var _ = require('lodash'),
    connectFlash = require('connect-flash'),
    express = require('express'),
    expressValidator = require('express-validator'),
    expressHandlebars = require('express-handlebars'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport');

var Restify = require('./route/restify'),
    ultimateRequire = require('../require'),
    ultimateUUID = require('../util/uuid');

var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');


var _app = null,
    _server = null;

function _configure() {
    var hbs = expressHandlebars.create({
        defaultLayout: 'default',
        extname: '.hbs',
        helpers: ultimateRequire(_app.dir + '/views/_helpers'),
        layoutsDir: _app.dir + '/views/_layouts',
        partialsDir: _app.dir + '/views/_partials'
    });

    _server.enable('case sensitive routing');
    _server.enable('strict routing');
    _server.engine('hbs', hbs.engine);
    _server.set('view engine', 'hbs');
    _server.set('views', _app.dir + '/views');
    _server.use(favicon(path.join(_app.dir, '..', _app.project.path.static, 'favicon.ico')));
    _server.use(morgan('combined'));

    if (_.isFunction(_app.registerWinstonLogger)) {
        _app.registerWinstonLogger();
    }
    _server.use(compression());


    if (_.isObject(_app.config.cookie) && _.isString(_app.config.cookie.secret)) {
        _server.use(cookieParser(_app.config.cookie.secret));
    } else {
        _server.use(cookieParser());
    }
    _server.use(bodyParser.json());

    // Save received session cookie for later use.
    _server.use(function (req, res, next) {
        req.receivedSessionCookie = req.cookies[_app.config.session.key];
        next();
    });

    var session = {
        _use: require('./middleware/session/_use'),
        mongo: require('./middleware/session/mongo'),
        redis: require('./middleware/session/redis')
    };


    // connect-session middleware.
    if (_.isObject(_app.config.session) && _.isObject(_app.config.session.store)) {
        switch (session._use(_app.config, ['mongo', 'redis'])) {
            case 'mongo':
                _app.logger.debug('app.config.session.store.mongo: '.cyan + JSON.stringify(_app.config.session.store.mongo, null, 2));
                session.mongo.attach(_app);
                break;
            case 'redis':
                _app.logger.debug('app.config.session.store.redis: '.cyan + JSON.stringify(_app.config.session.store.redis, null, 2));
                session.redis.attach(_app);
                break;
            default:
                throw new Error('Missing session.store.{mongo,redis} in config');
        }
    } else {
        throw new Error('Missing object in config: session.store');
    }

    // Generate CSRF token.
    _server.use(function (req, res, next) {
        function createToken(salt, secret) {
            return salt + crypto
                    .createHash('sha1')
                    .update(salt + secret)
                    .digest('base64');
        }

        if (!req.session._csrfSecret) {
            req.session._csrfSecret = ultimateUUID({length: 24, dash: false});
        }
        var token = createToken(
            ultimateUUID({length: 10, dash: false}),
            req.session._csrfSecret
        );
        req.csrfToken = function () {
            return token;
        };
        res.cookie('XSRF-TOKEN', token);
        next();
    });

    _server.use(expressValidator());
    _server.use(connectFlash());

    if (_.isFunction(_app.attachMiddlewares)) {
        _app.attachMiddlewares();
    }

    // Set additional session cookie information.
    _server.use(function (req, res, next) {
        res.cookie(_app.config.session.key + '+', JSON.stringify({
            expired: !req.cookies[_app.config.session.key] ||
            (req.receivedSessionCookie !== req.cookies[_app.config.session.key]),
            expires: req.session.cookie.expires
        }));
        next();
    });

    // connect-static middleware.
    var env = process.env.NODE_ENV || 'development';
    if ('development' == env) {
        _server.use(serveStatic(path.join(_app.dir, '..', _app.project.path.static)));
        _server.use(serveStatic(path.join(_app.dir, '..', _app.project.path.temp)));
        _server.use(serveStatic(path.join(_app.dir, '..', _app.project.path.client)));
    }else{
        var maxAge = 0;
        _server.use(serveStatic(path.join(_app.dir, '..', _app.project.path.static), { maxAge: maxAge }));
        _server.use(serveStatic(path.join(_app.dir, '..', _app.project.path.dist), { maxAge: maxAge }));
    }

    // Routes.
    _app.routes.register(_app, new Restify(_server));

    // Passport serializer & deserializer.
    passport.serializeUser(function (user, done) {
        var createAccessToken = function () {
            var token = ultimateUUID({ length: 30, dash: false });
            _app.models.User.findOne({
                accessToken: token
            }, function (err, existingUser) {
                if (err) { return done(err); }
                if (existingUser) {
                    createAccessToken();
                } else {
                    user.set('accessToken', token);
                    user.save(function (err) {
                        if (err) { return done(err); }
                        return done(null, user.get('accessToken'));
                    });
                }
            });
        };
        if (user._id) {
            createAccessToken();
        }
    });
    passport.deserializeUser(function (token, done) {
        _app.models.User.findOne({
            accessToken: token
        }, function (err, user) {
            done(err, user);
        });
    });

    // Winston error logger.



    // connect-errorHandler middleware.
    if ('development' == env) {
        _server.use(errorhandler({
            dumpExceptions: true,
            showStack: true
        }));
    }else{
        _server.use(function (err, req, res) {
            console.error(err.stack);
            res.status(err.status);
            res.render('error', {
                layout: false,
                message: err.message
            });
        });
    }

}

function getServer() {
    return _server;
}

function run(app) {
    _app = app;
    _app.servers.express = exports;
    _server = express();
    _configure();
}

// Public API
exports.getServer = getServer;
exports.run = run;
