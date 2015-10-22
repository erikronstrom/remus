"use strict";
var Event = require('./event');
var misc = require('./misc');
var chalk = require('chalk');

var VerticalContainer = Event.extend("VerticalContainer", ["contents"], {
  inspect: function(level, options) {
    var color = chalk.yellow;
    //return color('<') + color.bold('VerticalContainer') + color(': [') + this.contents.join(', ') + color(']>');
    return color("VerticalContainer\n") + util.inspect(this.contents, options);
  },
  
  init: function() {
    Event.prototype.init.call(this);
    this.contents = misc.initSubObjects(this.contents, this.env);
    return this;
  },
  
  toString: function() {
    return '[VerticalContainer]';
  }
});

VerticalContainer.coerce = function(source, env, copy) {
  if (source instanceof VerticalContainer) return copy ? new VerticalContainer(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a VerticalContainer!");
}

module.exports = VerticalContainer;
