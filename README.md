cantina-auth
==============

Wraps [passport]() to provde authentication for your cantina application.

Dependencies
------------
- Session middleware provided by [cantina-session](https://github.com/cantina/cantina-session)

Provides
--------
- **app.passport** - An initialized passport instance.

Adds Middleware
---------------
- `extendRequest()` - Adds: `req.logIn`, `req.logOut`, `req.isAuthenticated`, `req.isUnauthenticated`, `res.redirect(location, status)`
- `passport.initialize()`
- `passport.session()`
- GET '/logout' - Route handler to log a user out.

Configuration
-------------
- **logoutPath**: The path that should log a user out.
- **logoutRedirect**: The path a logged-out user should be redirected to.

**Defaults**

```js
{
  logoutPath: '/logout',
  logoutRedirect: '/'
}
```

Usage
-----
Your application MUST provide handlers for serializing and deserializing users.

- app.serializeUser (user) - Returns a user's id.
- auth:deserialize (id, cb) - Should load user and call `cb` with `(err, user)`

Example
-------

```js
var app = require('cantina');

app.boot(function (err) {
  if (err) throw err;

  app.serializeUser = function (user) {
    return user.id;
  };
  app.deserializeUser = function(id, done) {
    loadUser(id, function(err, user) {
      done(err, user);
    });
  };

  require('cantina-web');
  require('cantina-auth');

  app.start();
});
```

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.

