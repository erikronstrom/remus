"use strict";
var Event = require('./event');
var misc = require('./misc');
var chalk = require('chalk');
var Harmony = require('./harmony');

var Chord = Event.extend("Chord", ["harmony"], {
  inspect: function() {
    var color = chalk.yellow;
    if (this.harmony) return color('<') + color.bold(this.harmony) + color('>');
    return color("<chord>");
  },
  
  init: function() {
    this.harmony = misc.initSubObject(this.harmony, this.env, Harmony) || null;
    return this;
  },

  toString: function() {
    if (this.harmony) return '<' + this.harmony.toString() + '>';
    return "<chord>";
  },
});

Chord.coerce = function(source, env, copy) {
  if (source instanceof Chord) {
    if (copy || (source.env !== env)) return new Chord(source, env);
    else return source;
  }
  if (source instanceof Harmony) return new Chord({harmony: source}, env);
  return new Chord(source, env);
  throw new Error("Cannot coerce " + source + " to a chord!");
}

module.exports = Chord;