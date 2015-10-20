"use strict";
var Event = require('./event');
var misc = require('./misc');
var defaults = require('./defaults');
var chalk = require('chalk');

// TODO: inherit from some generic container

var Voice = Event.extend("Voice", ["contents"], {
  inspect: function() {
    var color = chalk.blue;
    return color('<Voice>');
  },
  
  init: function() {
    this.contents = misc.initSubObjects(this.contents, this.env);
    return this;
  }
});

Voice.coerce = function(source, env, copy) {
  if (source instanceof Voice) return copy ? new Voice(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a voice!");
}

module.exports = Voice;
