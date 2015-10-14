var misc = require('./misc');
var chalk = require('chalk');

function Duration(value, unit) {
  if (!(this instanceof Duration)) return new Duration(value, unit);
  this.value = value;
  this.unit = unit || 'ms';
}

Duration.prototype = {
  inspect: function() {
    return chalk.blue.bold(this.value) + ' ' + chalk.blue(this.unit);
  },

  toString: function() {
    return this.value + ' ' + this.unit;
  },
  
  toXML: function(rootName) {
    return misc.buildXML(this.toXMLObject(), {rootName: rootName || 'duration'});
  },
  
  toXMLObject: function() {
    if (this.unit == '' || this.unit === 'divisions') return {_: this.value};
    return {_: this.value, '$': {unit: this.unit}};
  }
}

Duration.fromString = function(str) {
  var matches = str.match(/^([0-9\.]+)\s*([A-Za-z]*)$/);
  if (matches) {
    return new Duration(parseFloat(matches[1]), matches[2]);
  }
}

Duration.coerce = function(source, copy) {
  if (source instanceof Duration) return copy ? new Duration(source.value, source.unit) : source;
  if (typeof source === 'string') return Duration.fromString(source);
  if (typeof source === 'number') return new Duration(source);
  if (source instanceof Array && source.length === 2) return new Duration(source[0], source[1]);
  throw new Error("Cannot coerce " + source + " to a duration!");
}

Duration.fromXML = function(xml) {
  var obj = misc.parseXML(xml, {explicitArray: false, mergeAttrs: true, explicitCharkey: true});
  return Duration.fromXMLObject(obj);
}

Duration.fromXMLObject = function(obj) {
  if (typeof obj === 'string') return new Duration(parseInt(obj), 'divisions');
  return new Duration(parseInt(obj._), obj.unit || 'divisions');
}

module.exports = Duration;
