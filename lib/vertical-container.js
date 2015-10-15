var misc = require('./misc');
var chalk = require('chalk');

function VerticalContainer(properties, env) {
  if (!(this instanceof VerticalContainer)) return new VerticalContainer(properties, env);
  this.contents = properties.contents || [];
  
  this.env = env || properties.env || {};
}

VerticalContainer.prototype = {
  // inspect: function() {
  //   var color = chalk.yellow;
  //   return color('<') + color.bold('VerticalContainer') + color(': [') + this.contents.join(', ') + color(']>');
  // },
  
  init: function() {
    this.contents = misc.initSubObjects(this.contents, this.env);
    return this;
  },
  
  toString: function() {
    return '[VerticalContainer]';
  }
}

VerticalContainer.coerce = function(source, env, copy) {
  if (source instanceof VerticalContainer) return copy ? new VerticalContainer(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a VerticalContainer!");
}

module.exports = VerticalContainer;