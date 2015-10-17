var chalk = require('chalk');
var defaults = require('./defaults');

function Env(properties, def) {
  if (def === undefined) def = defaults;
  for (key in def) this[key] = def[key];
  for (key in properties) this[key] = properties[key];
}

Object.defineProperty(Env.prototype, "inspect", {
  value: function (depth, options) {
    if (options.seen.length > 1) return chalk.dim("...");
    var lines = [];
    for (key in this) {
      var own = this.hasOwnProperty(key);
      var color = own ? chalk.cyan.bold : chalk.dim;
      if (own) {
        lines.push(color(key) + ': ' + color(this[key]));
      } else {
        lines.push(color(key + ': ' + this[key]));
      }
    }
    if (lines.length > 3) return "{ " + lines.join(",\n  ") + " }";
    else return "{ " + lines.join(", ") + " }";
  },
  enumerable: false,
  configurable: false
})

module.exports = Env;