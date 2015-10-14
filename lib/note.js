var Pitch = require('./pitch');
var Duration = require('./duration');
var knowledge = require('./knowledge');
var misc = require('./misc');
var xml2js = require('xml2js');
var chalk = require('chalk');

function pad(str, ch, len) {
  for (; len > 0; len--) {
    str += ch;
  }

  return str;
}


function Note(pitch, duration) {
  if (!(this instanceof Note)) return new Note(pitch, duration);
  this.pitch = pitch;
  this.duration = duration;
}

Note.prototype = {
  // inspect: function() {
  //   return chalk.magenta('<') + chalk.magenta.bold(this.pitch.toString()) + chalk.magenta('>');
  // },
  
  transpose: function(interval) {
    this.pitch.transpose(interval);
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
};

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
