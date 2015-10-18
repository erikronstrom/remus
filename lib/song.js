"use strict";
var Env = require('./env');
var misc = require('./misc');
var chalk = require('chalk');

function Song(properties, env) {
  if (!(this instanceof Song)) return new Song(properties, env);
  this.events = properties.events || [];
  this.items  = properties.items  || [];
  
  this.env = env || properties.env || new Env();
}

Song.prototype = {
  // inspect: function(indent, options) {
  //   var color = chalk.blue;
  //   var lines = [];
  //   for (key in this) {
  //     if (this.hasOwnProperty(key)) {
  //       lines.push(key + ': ' + util.inspect(this[key], options));
  //     }
  //   }
  //   return color.bold("Song ") + color("{\n") + lines.join(",\n") + color(" }");
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