/**
 * Auth cantina plugin.
 */

var app = require('cantina'),
    passport = require('passport');

app.conf.add({
  auth: {
    logoutPath: '/logout',
    logoutRedirect: '/'
  }
});

app.on('init', function() {
  var conf = app.conf.get('auth');

  // Applications MUST listen for serialization events.
  passport.serializeUser(app.invoke.bind(app, 'auth:serialize'));
  passport.deserializeUser(app.invoke.bind(app, 'auth:deserialize'));

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
});

/**
 * Passport relies on req being descended from http.IncomingMessage, and
 * modifies that prototype with custom methods. Bad, bad, bad!
 * This little hack mirrors those methods on req, since union uses a custom set
 * of classes that don't inherit from http.IncomingMessage.
 * Passport also relies on express's res.redirect() so insert shim for that too.
 */
function extendRequest () {
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
