var misc = require('./misc');
var defaults = require('./defaults');
var chalk = require('chalk');
var Harmony = require('./harmony');

function Chord(properties, env) {
  if (!(this instanceof Chord)) return new Chord(properties, env);
  this.harmony = properties.harmony;
  
  this.env = env || properties.env || new Env();
}

Chord.prototype = {
  inspect: function() {
    var color = chalk.yellow;
    if (this.harmony) return color('<') + color.bold(this.harmony) + color('>');
    return color("<chord>");
  },
  
  init: function() {
    this.harmony = misc.initSubObject(this.harmony, this.env, Harmony);
    return this;
  },

  toString: function() {
    if (this.harmony) return '<' + this.harmony.toString() + '>';
    return "<chord>";
  },
}

Chord.coerce = function(source, env, copy) {
  return new Chord({}, env); // temp
  throw new Error("Cannot coerce " + source + " to a chord!");
}

module.exports = Chord;