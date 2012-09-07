/**
 * Auth cantina plugin.
 */

var passport = require('passport')
  , parseUrl = require('url').parse

module.exports = {

  name: 'auth',

  dependencies: {
    "middleware": "~1.0.0",
    "session": "~1.0.0"
  },

  defaults: {
    logoutPath: '/logout',
    logoutRedirect: '/'
  },

  init: function(app, done) {
    var conf = app.conf.get('auth');

    // Applications can/should provide serialization methods.
    if (app.serializeUser) {
      passport.serializeUser(app.serializeUser);
    }
    if (app.deserializeUser) {
      passport.deserializeUser(app.deserializeUser);
    }

    // Add auth middleware.
    app.middleware.add(function (req, res, next) {
      // Passport on express's res.redirect() so insert shim for that.
      res.redirect = function(url, status) {
        res.writeHead(status || 302, {'Location': url});
        res.end();
      };
      // Also depends on req.query. sigh.
      if (!req.query) {
        req.query = ~req.url.indexOf('?') ? parseUrl(req.url, true).query : {};
      }
      next();
    });
    app.middleware.add(passport.initialize());
    app.middleware.add(passport.session());

    // Add a logout route.
    app.middleware.get(conf.logoutPath, function(req, res) {
      req.logOut();
      res.redirect(conf.logoutRedirect);
    });

    app.passport = passport;
    done();
  }
};