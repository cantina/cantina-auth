/**
 * Auth cantina plugin.
 */

var passport = require('passport')
  , connect = require('connect')
  ;

// Expose this service's package info.
require('pkginfo')(module);

// The plugin is being attached to an app.
exports.attach = function(options) {
  if (options.serializeUser) {
    passport.serializeUser(options.serializeUser);
  }
  if (options.deserializeUser) {
    passport.deserializeUser(options.deserializeUser);
  }

  this.http.before = this.http.before.concat([
    connect.cookieParser('keyboard cat'),
    connect.bodyParser(),
    connect.session({secret: 'keyboard cat'}),
    extendRequest(),
    passport.initialize(),
    passport.session()
  ]);

  this.passport = passport;
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