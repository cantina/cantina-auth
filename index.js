/**
 * Auth cantina plugin.
 */

var app = require('cantina')
  , passport = require('passport')
  , parseUrl = require('url').parse
  , conf;

if (!app.middleware) throw new Error('Middleware stack not found on app.middlware');

require('cantina-session');

// Default conf.
app.conf.add({
  auth: {
    weight: -200,
    logoutPath: '/logout',
    logoutRedirect: '/'
  }
});

// Get conf.
conf = app.conf.get('auth');

// Expose passport.
app.passport = passport;

// Applications MUST provide serialization methods.
app.passport.serializeUser(app.serializeUser);
app.passport.deserializeUser(app.deserializeUser);

// Add auth middleware.
app.middleware.add(conf.weight, function (req, res, next) {
  // Passport requires express's res.redirect() so insert shim for that.
  if (!res.redirect) {
    res.redirect = function (url, status) {
      if (req.session.destination && (!req.query.destination || req.url.indexOf(conf.logoutPath) === 0)) {
        url = req.session.destination;
        delete req.session.destination;
      }
      res.writeHead(status || 302, {'Location': url});
      res.end();
    };
  }
  // Also depends on req.query. sigh.
  if (!req.query) {
    if (!req.href) {
      req.query = ~req.url.indexOf('?') ? parseUrl(req.url, true).query : {};
    }
    else {
      req.query = req.href.query;
    }
  }
  // Add support for ?destination=/some-path
  if (req.query.destination && !~req.query.destination.indexOf('://')) {
    req.session.destination = req.query.destination;
  }
  next();
});
app.middleware.add(conf.weight, app.passport.initialize());
app.middleware.add(conf.weight, app.passport.session());

// Add a logout route.
if (conf.logoutPath) {
  app.middleware.get(conf.logoutPath, function (req, res) {
    req.logOut();
    res.redirect(conf.logoutRedirect);
  });
}
