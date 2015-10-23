"use strict";
var Item = require('./item');
var misc = require('./misc');
var chalk = require('chalk');
var Chord = require('./chord');

var ChordSequence = Event.extend("ChordSequence", ["contents"], {
  inspect: function() {
    var color = chalk.yellow;
    return color.bold('ChordSequence') + color(' [') + this.contents.join(', ') + color(']');
  },
  
  init: function() {
    Event.prototype.init.call(this);
    this.contents = misc.initSubObjects(this.contents, this.env, Chord);
    return this;
  }
});

ChordSequence.coerce = function(source, env, copy) {
  if (source instanceof ChordSequence) return copy ? new ChordSequence(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a chord sequence!");
}

module.exports = ChordSequence;