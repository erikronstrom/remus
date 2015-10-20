"use strict";
var Event = require('./event');
var Pitch = require('./pitch');
var Duration = require('./duration');
var knowledge = require('./knowledge');
var misc = require('./misc');
var xml2js = require('xml2js');
var chalk = require('chalk');
var lodash = require('lodash');
var isObject = lodash.isObject;

// function Note(properties, env) {
//   if (!(this instanceof Note)) return new Note(properties, env);
//
//   Event.call(this, properties, env);
// }

//var Note = misc.createItemClass(Event, ["pitch"], {
var Note = Event.extend("Note", ["pitch"], {
  // inspect: function() {
  //   return chalk.magenta('<') + chalk.magenta.bold(this.pitch.toString()) + chalk.magenta('>');
  // },
  
  transpose: function(interval) {
    this.pitch.transpose(interval);
    return this;
  },
  
  init: function() {
    Event.prototype.init.call(this);
    this.pitch = misc.initSubObject(this.pitch, this.env, Pitch);
    return this;
  },
  
  /**
   * Returns the name of the note, with an optional display of octave number
   */
  toString: function() {
    return this.name().toUpperCase() + this.accidental() + (dont ? '' : this.octave());
  },
  
  toXML: function(rootName) {
    return misc.buildXML(this.toXMLObject(), {rootName: rootName || 'note'});
  },
  
  toXMLObject: function() {
    return {pitch: this.pitch.toXMLObject(), duration: this.duration.toXMLObject()};
  }
});

Note.coerce = function(source, env, copy) {
  if (source instanceof Note) {
    if (copy || (source.env !== env)) return new Note(source, env);
    else return source;
  }
  if (source instanceof Pitch)
    return new Note({pitch: source}, env);
  if (isObject(source))
    return new Note(source, env);
  throw new Error("Cannot coerce " + source + " to a note!");
}

Note.fromXML = function(xml, o) {
  var obj = misc.parseXML(xml, {explicitArray: false, mergeAttrs: true, explicitCharkey: false});
  return Note.fromXMLObject(obj);
}

Note.fromXMLObject = function(obj) {
  var pitch = Pitch.fromXMLObject(obj.pitch);
  var duration = Duration.fromXMLObject(obj.duration);
  return new Note(pitch, duration);
}

module.exports = Note;
