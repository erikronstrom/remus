var misc = require('./misc');
var defaults = require('./defaults');
var chalk = require('chalk');

function Song(properties, env) {
  if (!(this instanceof Song)) return new Song(properties, env);
  this.events = properties.events || [];
  this.items  = properties.items  || [];
  
  this.env = env || properties.env || {};
}

Song.prototype = {
  // inspect: function() {
  //   var color = chalk.blue;
  //   return color('<Song>');
  // },
  
  init: function() {
    this.events = misc.initSubObjects(this.events, this.env);
    this.items  = misc.initSubObjects(this.items, this.env);
    return this;
  }
}

Song.coerce = function(source, env, copy) {
  if (source instanceof Song) return copy ? new Song(source, env) : source;
  throw new Error("Cannot coerce " + source + " to a song!");
}

module.exports = Song;