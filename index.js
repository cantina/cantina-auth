/**
 * Auth cantina plugin.
 */

var app = require('cantina')
  , passport = require('passport')
  , parseUrl = require('url').parse

app.conf.add({
  auth: {
    logoutPath: '/logout',
    logoutRedirect: '/'
  }
});

app.on('init', function () {
  var conf = app.conf.get('auth');

  // Applications MUST listen for serialization events.
  passport.serializeUser(app.invoke.bind(app, 'auth:serialize'));
  passport.deserializeUser(app.invoke.bind(app, 'auth:deserialize'));

  // Add auth middleware.
  app.middleware.add(function (req, res, next) {
    // Passport on express's res.redirect() so insert shim for that.
    res.redirect = function (url, status) {
      if (req.session.destination && (!req.query.destination || req.url.indexOf(conf.logoutPath) === 0)) {
        url = req.session.destination;
        delete req.session.destination;
      }
      res.writeHead(status || 302, {'Location': url});
      res.end();
    };
    // Also depends on req.query. sigh.
    if (!req.query) {
      req.query = ~req.url.indexOf('?') ? parseUrl(req.url, true).query : {};
    }
    // Add support for ?destination=/some-path
    if (req.query.destination && !~req.query.destination.indexOf('://')) {
      req.session.destination = req.query.destination;
    }
    next();
  });
  app.middleware.add(passport.initialize());
  app.middleware.add(passport.session());

  // Add a logout route.
  if (conf.logoutPath) {
    app.middleware.get(conf.logoutPath, function (req, res) {
      req.logOut();
      res.redirect(conf.logoutRedirect);
    });
  }

  app.passport = passport;
});