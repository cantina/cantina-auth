/**
 * Cantina Auth
 * ------------
 *
 * Authentication base plugin for Cantina.
 *
 * @module cantina
 * @submodule auth
 * @main auth
 */

// Modules dependencies.
var utils = require('cantina-utils');

// Export sub-modules.
utils.lazy(exports, __dirname, {
  plugin: './plugin'
});
