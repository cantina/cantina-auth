cantina-auth
==============

Wraps [passport]() to provde authentication for your cantina application.

Dependencies
------------
- **session** - Session middleware provided by [cantina-session](https://github.com/cantina/cantina-session)

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
Your application MUST listend for the authentication serialization events:
- `auth:serialize`
- `auth:deserialize`

Example
-------
```js
var app = require('cantina');

app.load(function (err) {
  if (err) return console.error(err);

  // Load plugins.
  require(app.plugins.http);
  require(app.plugins.middleware);
  require('cantina-redis');
  require('cantina-session');
  require('cantina-auth');

  // Listen for serialization requests.
  app.on('auth:serialize', function (user) {
    return user.id;
  });
  app.on('auth:deserialize', function(id, done) {
    loadUser(id, function(err, user) {
      done(err, user);
    });
  });

  // Initialize the app.
  app.init();
});
```

- - -
### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.
- - -
### License: MIT
Copyright (C) 2012 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
