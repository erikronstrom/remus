"use strict";
var Item = require('./item');
var scientific = require('scientific-notation');
var helmholtz = require('helmholtz');
var defaults = require('./defaults');
var knowledge = require('./knowledge');
var notecoord = require('notecoord');
var vector = require('./vector');
var Interval = require('./interval');
var misc = require('./misc');
var xml2js = require('xml2js');
var chalk = require('chalk');
var lodash = require('lodash');
var isNumber = lodash.isNumber;
var isUndefined = lodash.isUndefined;
var isObject = lodash.isObject;

function pad(str, ch, len) {
  for (; len > 0; len--) {
    str += ch;
  }

  return str;
}

var Pitch = Item.extend("Pitch", ["mmel", "tcu", "coord", "pitchDeviation"], {
  inspect: function() {
    var repr = [];
    var color = chalk.green;
    if (this.coord) {
      var text = color.bold(this.scientific());
      if (this.pitchDeviation)
        text += color(' ' + (this.pitchDeviation > 0 ? '+' : '') + this.pitchDeviation + 'c');
      repr.push(text);
    }
    if (this.tcu) repr.push(color.bold(this.tcu) + ' ' +
      (this.env.tcuPerOctave == defaults.tcuPerOctave ? color('tcu') : color('tcu[' + this.env.tcuPerOctave + ']')));
    if (this.mmel) repr.push(color.bold(this.mmel.toFixed(2)) + ' ' + color('mmel'));
    return color('<') + repr.join(', ') + color('>');
  },
  
  octave: function() {
    if (this.coord) return Math.floor(this.coord[0] / this.env.stepsPerOctave);
    if (isNumber(this.mmel)) return Math.floor(this.mmel / 12);
    if (isNumber(this.tcu)) return Math.floor(this.tcu / this.env.tcuPerOctave);
  },

  name: function() {
    if (this.coord && this.env.stepsPerOctave % 7 === 0) {
      return knowledge.tones[misc.mod(this.coord[0], this.env.stepsPerOctave) / (this.env.stepsPerOctave / 7)];
    }
  },

  accidentalValue: function() {
    if (this.coord) {
      var spo = this.env.stepsPerOctave;
      var tpo = this.env.tcuPerOctave;
      if (spo % 7 === 0 && tpo % 12 === 0) {
        return this.coord[1] - (this.octave() * this.env.tcuPerOctave + knowledge.pitches[this.name()][1] * (tpo / 12));
      }
    }
  },

  accidental: function() {
    if (this.coord) {
      var accVal = this.accidentalValue();
      if (!accVal) return '';
      if (this.env.tcuPerOctave === 12) {
        return knowledge.quarterToneAccidentals[accVal * 2 + 4] || '!';
      } else if (this.env.tcuPerOctave % 24 === 0) {
        accVal /= (this.env.tcuPerOctave / 24);
        return knowledge.quarterToneAccidentals[accVal + 4] || '!';
      } else {
        return '!';
      }
    }
    return '';
  },

  /**
   * Returns the piano key number of the pitch
   */
  pianoKey: function(white) {
    if (white)
      return this.coord[0] - 4; // TODO: fix
    else
      return this.midi() - 8;
  },

  /**
  * Returns a number ranging from 0-127 representing a MIDI pitch value
  */
  midi: function() {
    if (isNumber(this.tcu)) return Math.round(this.tcu / (this.env.tcuPerOctave / 12));
    if (this.coord) return Math.round(this.coord[1] / (this.env.tcuPerOctave / 12));
    if (isNumber(this.mmel)) return Math.round(this.mmel);
  },

  /**
   * Calculates and returns the frequency of the pitch.
   * Optional concert pitch (def. 440)
   */
  toFrequency: function(concertPitch) {
    concertPitch = concertPitch || 440;

    var tpo = this.env.tcuPerOctave;
    if (isNumber(this.tcu))
      return concertPitch * Math.pow(2, ((this.tcu / (tpo / 12)) - knowledge.A4[1]) / tpo);
    if (this.coord)
      return concertPitch * Math.pow(2, ((this.coord[1] / (tpo / 12)) - knowledge.A4[1]) / tpo);
  },

  /**
   * Returns the pitch class index (chroma) of the pitch
   */
  chroma: function() {
    var tpo = this.env.tcuPerOctave;
    if (this.coord) return ((this.coord[1] % tpo) + tpo) % tpo;  // works with negatvive numbers
    if (this.tcu) return ((this.tcu % tpo) + tpo) % tpo;
    return ((this.toTcu() % tpo) + tpo) % tpo;
  },
    
  toMmel: function() {
    if (isNumber(this.mmel)) return this.mmel;
    if (isNumber(this.tcu)) return this.tcu / (this.env.tcuPerOctave / 12);
    if (this.coord) return this.coord[1] / (this.env.tcuPerOctave / 12);
  },
  
  toTcu: function() {
    if (isNumber(this.tcu)) return this.tcu;
    if (isNumber(this.mmel)) return Math.round(this.mmel * (this.env.tcuPerOctave / 12));
    if (this.coord) return this.coord[1];
  },
  
  toCoord: function() {
    if (this.coord) return this.coord;
    var tcu = this.toTcu();
    if (isNumber(tcu)) {
      steps = Math.round(tcu / (this.env.tcuPerOctave / this.env.stepsPerOctave)); // TODO: better algorithm
      return [steps, tcu];
    }
  },

  interval: function(interval) {
    if (typeof interval === 'string') interval = Interval.fromString(interval);

    if (interval instanceof Interval)
      return new Pitch(vector.add(this.coord, interval.coord));
    else if (interval instanceof Pitch)
      return new Interval(vector.sub(interval.coord, this.coord));
  },

  transpose: function(interval) {
    this.coord = vector.add(this.coord, interval.coord);
    return this;
  },

  /**
   * Returns the Helmholtz notation form of the pitch (fx C,, d' F# g#'')
   */
  helmholtz: function() {
    var octave = this.octave();
    var name = this.name();
    name = octave < 3 ? name.toUpperCase() : name.toLowerCase();
    var padchar = octave < 3 ? ',' : '\'';
    var padcount = octave < 2 ? 2 - octave : octave - 3;

    return pad(name + this.accidental(), padchar, padcount);
  },

  /**
   * Returns the scientific notation form of the pitch (fx E4, Bb3, C#7 etc.)
   */
  scientific: function() {
    return this.name().toUpperCase() + this.accidental() + this.octave();
  },

  // /**
  //  * Returns pitches that are enharmonic with this pitch.
  //  */
  // enharmonics: function(oneaccidental) {
  //   var key = this.key(), limit = oneaccidental ? 2 : 3;
  //
  //   return ['m3', 'm2', 'm-2', 'm-3']
  //     .map(this.interval.bind(this))
  //     .filter(function(pitch) {
  //     var acc = pitch.accidentalValue();
  //     var diff = key - (pitch.key() - acc);
  //
  //     if (diff < limit && diff > -limit) {
  //       pitch.coord = vector.add(pitch.coord, vector.mul(knowledge.sharp, diff - acc));
  //       return true;
  //     }
  //   });
  // },
  //
  // solfege: function(scale, showOctaves) {
  //   var interval = scale.tonic.interval(this), solfege, stroke, count;
  //   if (interval.direction() === 'down')
  //     interval = interval.invert();
  //
  //   if (showOctaves) {
  //     count = (this.key(true) - scale.tonic.key(true)) / 7;
  //     count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
  //     stroke = (count >= 0) ? '\'' : ',';
  //   }
  //
  //   solfege = knowledge.intervalSolfege[interval.simple(true).toString()];
  //   return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
  // },
  //
  // scaleDegree: function(scale) {
  //   var inter = scale.tonic.interval(this);
  //
  //   // If the direction is down, or we're dealing with an octave - invert it
  //   if (inter.direction() === 'down' ||
  //      (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
  //     inter = inter.invert();
  //   }
  //
  //   inter = inter.simple(true).coord;
  //
  //   return scale.scale.reduce(function(index, current, i) {
  //     var coord = Interval.fromString(current).coord;
  //     return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
  //   }, 0);
  // },

  /**
   * Returns the name of the pitch, with an optional display of octave number
   */
  toString: function(dont) {
    return this.name().toUpperCase() + this.accidental() + (dont ? '' : this.octave());
  },
  
  toJSON: function() {
    if (isNumber(this.mmel) && !this.coord && !isNumber(this.tcu)) return [this.mmel, 'mmel'];
    if (this.coord && !isNumber(this.tcu) && !isNumber(this.mmel) && !this.pitchDeviation &&
      this.env.stepsPerOctave === 7 && (this.env.tcuPerOctave === 12 || this.env.tcuPerOctave % 24 === 0) &&
      this.coord[1] % 1 === 0 && this.accidental() !== '!')
      return this.scientific();
    return this;
  },
  
  toXML: function(rootName) {
    return misc.buildXML(this.toXMLObject(), {rootName: rootName || 'pitch'});
  },
  
  toXMLObject: function() {
    return {step: this.name().toUpperCase(), alter: this.accidentalValue(), octave: this.octave() };
  }
});

Pitch.coerce = function(source, env, copy) {
  if (source instanceof Pitch) {
    if (copy || (source.env !== env)) return new Pitch(source, env);
    else return source;
  }
  if (typeof source === 'string')
    return Pitch.fromString(source, env);
  if (source instanceof Array && source.length === 2 && typeof source[1] === 'string')
    return Pitch.fromUnit(source[0], source[1], env);
  if (source instanceof Array && source.length === 2 && typeof source[1] === 'number')
    return new Pitch({coord: source}, env);
  if (isNumber(source))
    return new Pitch({tcu: source}, env);
  if (isObject(source) && (isNumber(source.mmel) || isNumber(source.tcu) || source.coord))
    return new Pitch(source, env);
  throw new Error("Cannot coerce " + source + " to a pitch!");
}

Pitch.fromString = function(name, env) {
  var match = name.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (match) return Pitch.fromUnit(match[1], match[2]);
  var coord = scientific(name);
  if (!coord) coord = helmholtz(name);
  if (!coord) throw new Error("Cannot coerce " + name + " to a pitch!");
  
  var spo = (env || {}).stepsPerOctave || defaults.stepsPerOctave;
  var tpo = (env || {}).tcuPerOctave || defaults.tcuPerOctave;
  if (spo % 7 === 0 && tpo % 12 === 0) {
    coord[0] *= (spo / 7);
    coord[1] *= (tpo / 12);
    return new Pitch({coord: coord}, env);
  }
  throw new Error("Cannot use fromString unless tcuPerOctave is a multiple of 12 and stepsPerOctave is a multiple of 7");
}

Pitch.fromUnit = function(value, unit, env) {
  switch (unit) {
    case "Hz": return Pitch.fromFrequency(value, env);
    case "mmel": return new Pitch({mmel: parseFloat(value)}, env);
    case "tcu": return new Pitch({tcu: parseInt(value)}, env);
  default:
    throw new Error("Invalid pitch unit: " + unit);
  }
}

// Pitch.fromKey = function(key) {
//   var semitones = key - knowledge.A4[1] + 8;
//   var steps = Math.round(semitones * 7/12)
//   return new Pitch([steps, semitones]);
// }

Pitch.fromFrequency = function(fq, env) {
  var key, cents, originalFq;
  concertPitch = env && env.concertPitch ? env.concertPitch : 440;

  key = knowledge.A4[1] + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
  //key = Math.round(key);
  //originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
  //cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

  return new Pitch({mmel: key}, env); //, pitchDeviation: cents};
}

Pitch.fromMIDI = function(pitch, env) {
  var tpo = (env || {}).tcuPerOctave || defaults.tcuPerOctave;
  if (tpo % 12 === 0)
    return new Pitch({tcu: pitch * (tpo / 12)}, env);
  throw new Error("Cannot use fromMIDI unless tcuPerOctave is a multiple of 12");
}

Pitch.fromXML = function(xml, env) {
  var obj = misc.parseXML(xml, {explicitArray: false, mergeAttrs: true, explicitCharkey: false}, env);
  return Pitch.fromXMLObject(obj, env);
};

Pitch.fromXMLObject = function(obj, env) {
  var coord = notecoord.notes[obj.step.toLowerCase()].slice();
  coord[1] += parseInt(obj.alter) || 0;
  var octave = parseInt(obj.octave);
  coord = vector.add(coord, octave.octaves); // TODO: verify that this is the correct octave!
  return new Pitch({coord: coord}, env);
}

module.exports = Pitch;
