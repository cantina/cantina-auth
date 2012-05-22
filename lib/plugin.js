/**
 * Auth cantina plugin.
 */

var passport = require('passport');

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

  this.passport = passport;
};
