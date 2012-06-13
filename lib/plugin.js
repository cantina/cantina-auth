/**
 * Auth cantina plugin.
 */

var utils = require('cantina-utils'),
    cantina_session = require('cantina-session'),
    passport = require('passport');

// Expose this service's package info.
utils.pkginfo(module);

// The plugin is being attached to an app.
exports.attach = function(options) {
  var app = this;

  options = options || {};

  app.utils.defaults(options, {
    logoutPath: '/logout'
  });

  if (options.serializeUser) {
    passport.serializeUser(options.serializeUser);
  }
  if (options.deserializeUser) {
    passport.deserializeUser(options.deserializeUser);
  }

  if (!app.plugins['cantina-session']) {
    app.use(cantina_session.plugin, options);
  }

  app.middleware([
    extendRequest(),
    passport.initialize(),
    passport.session()
  ]);

  app.passport = passport;

  // Add a logout route.
  app.router.get('/logout', function() {
    this.req.logOut();
    this.res.redirect('/');
  });
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

    res.emit('next');
  };
}
