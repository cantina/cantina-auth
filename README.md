cantina-auth
==============

Wraps [passport]() to provde authentication for your cantina application.

Dependencies
------------
- **middler** - A middler instance provided by [cantina-middler](https://github.com/cantina/cantina-middler)

Optional Dependencies
---------------------
- You application can/should provide:
  - `app.serializeUser()`
  - `app.deserializeUser()`

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

Example
-------
```js
var cantina = require('cantina'),
    plugins = ['http', 'middleware', 'cantina-auth'],
    conf = { http: {port: 3000} };

cantina.createApp(plugins, conf, function(err, app) {
  if (err) return console.log(err);
  // Your application now is set up to handle authentication.
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
