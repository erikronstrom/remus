var misc = require('./misc');
var defaults = require('./defaults');
var chalk = require('chalk');
var Chord = require('./chord');

function ChordSequence(properties, env) {
  if (!(this instanceof ChordSequence)) return new ChordSequence(properties, env);
  this.contents = properties.contents || [];
  
  this.env = env || properties.env || {};
}

ChordSequence.prototype = {
  inspect: function() {
    var color = chalk.yellow;
    return color('<') + color.bold('ChordSequence') + color(': [') + this.contents.join(', ') + color(']>');
  },
  
  init: function() {
    this.contents = misc.initSubObjects(this.contents, this.env, Chord);
    return this;
  }
}

ChordSequence.coerce = function(source, env, copy) {
  if (source instanceof ChordSequence) return copy ? new ChordSequence(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a chord sequence!");
}

module.exports = ChordSequence;