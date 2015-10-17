var Env = require('./env');
var misc = require('./misc');
var chalk = require('chalk');
var Harmony = require('./harmony');

function Chord(properties, env) {
  if (!(this instanceof Chord)) return new Chord(properties, env);
  this.harmony = properties.harmony;
  this.duration = properties.duration;
  
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
  if (source instanceof Chord) {
    if (copy || (source.env !== env)) return new Chord(source, env);
    else return source;
  }
  if (source instanceof Harmony) return (new Chord({harmony: source}, env)).init();
  return new Chord(source, env).init();
  throw new Error("Cannot coerce " + source + " to a chord!");
}

module.exports = Chord;