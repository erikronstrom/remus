var misc = require('./misc');
var defaults = require('./defaults');
var chalk = require('chalk');
var Harmony = require('./harmony');

function Chord(properties, env) {
  if (!(this instanceof Chord)) return new Chord(properties, env);
  this.harmony = properties.harmony;
  
  this.env = env || properties.env || {};
}

Chord.prototype = {
  inspect: function() {
    var color = chalk.yellow;
    return color("<chord>"); // temp
    return color('<') + color.bold(this.harmony) + color('>');
  },
  
  init: function() {
    this.harmony = misc.initSubObject(this.harmony, this.env, Harmony);
    return this;
  },

  toString: function() {
    return "<chord>"; // temp
    return this.harmony.toString();
  },
}

Chord.coerce = function(source, env, copy) {
  return new Chord({}, env); // temp
  throw new Error("Cannot coerce " + source + " to a chord!");
}

module.exports = Chord;