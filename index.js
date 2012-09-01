/**
 * Auth cantina plugin.
 */

var passport = require('passport');

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
    app.middleware.add(extendRequest());
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

/**
 * Passport relies on req being descended from http.IncomingMessage, and
 * modifies that prototype with custom methods. Bad, bad, bad!
 * This little hack mirrors those methods on req, since union uses a custom set
 * of classes that don't inherit from http.IncomingMessage.
 * Passport also relies on express's res.redirect() so insert shim for that too.
 */
function extendRequest() {
  var reqPrototype = require('http').IncomingMessage.prototype;
  return function(req, res, next) {
    var methods = ['logIn', 'logOut', 'isAuthenticated', 'isUnauthenticated'], prop;
    for (var i in methods) {
      prop = methods[i];
      req[prop] = reqPrototype[prop].bind(req);
    }
    res.redirect = (function(url, status) {
      this.statusCode = status || 302;
      this.setHeader('Location', url);
      this.end();
    }).bind(res);
    next();
  };
}
