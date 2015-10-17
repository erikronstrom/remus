var misc = require('./misc');
var defaults = require('./defaults');
var chalk = require('chalk');

function Voice(properties, env) {
  if (!(this instanceof Voice)) return new Voice(properties, env);
  this.contents = properties.contents || [];
  
  this.env = env || properties.env || new Env();
}

Voice.prototype = {
  inspect: function() {
    var color = chalk.blue;
    return color('<Voice>');
  },
  
  init: function() {
    this.contents = misc.initSubObjects(this.contents, this.env);
    return this;
  }
}

Voice.coerce = function(source, env, copy) {
  if (source instanceof Voice) return copy ? new Voice(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a voice!");
}

module.exports = Voice;