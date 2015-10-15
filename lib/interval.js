var knowledge = require('./knowledge');
var vector = require('./vector');
var toCoord = require('interval-coords');
var chalk = require('chalk');

function Interval(properties, env) {
  if (!(this instanceof Interval)) return new Interval(properties, env);
  
  this.coord = properties.coord;
  
  this.env = env || (properties || {}).env || {};
  //this.env.tcuPerOctave = this.env.tcuPerOctave || defaults.tcuPerOctave;
  //this.env.stepsPerOctave = this.env.stepsPerOctave || defaults.stepsPerOctave;
}

Interval.prototype = {
  inspect: function() {
    return chalk.red('<') + chalk.red.bold(this.toString()) + chalk.red('>');
  },
  
  // Display name ("unison", "second", "third", etc)
  name: function() {
    return knowledge.intervalsIndex[this.number() - 1];
  },

  // Number of semitones, positive for all intervals except P1
  semitones: function() {
    return Math.abs(this.coord[1]);
  },

  // The displayed number, always positive (all seconds return 2, thirds 3, decimas 10, etc)
  number: function() {
    return Math.abs(this.value());
  },

  // The interval number, positive or negative (2 means second up, -2 second down)
  value: function() {
    return this.coord[0] < 0 ? this.coord[0] - 1 : this.coord[0] + 1;
  },

  // Internal: can the interval be perfect, or is it a minor/major interval?
  type: function() {
    return [0, 3, 4, 7].indexOf(Math.abs(this.coord[0]) % 7) >= 0 ? 'perfect' : 'minor';
  },

  // Returns the "simple part", e.g. "third" for M10 and "second" for m9
  // The global Interval.octaveIsSimple determines if octave is treated as
  // a base interval or not (so P15 can be "octave" + 1 octave, or "unison" + 2 octaves)
  base: function() {
    if (Interval.octaveIsSimple) {
      return knowledge.intervalsIndex[this.isCompound() ? (this.number() - 2) % 7 + 1 : (this.number() - 1)];
    } else {
      return knowledge.intervalsIndex[(this.number() - 1) % 7];
    }
  },
  
  // Returns number of octaves for compound intervals.
  // Note that if Interval.octaveIsSimple is set
  octaves: function() {
    if (Interval.octaveIsSimple)
      return this.isCompound() ? Math.floor((this.number() - 2) / 7) : 0;
    else
      return Math.floor((this.number() - 1) / 7);
  },

  direction: function(dir) {
    if (dir) {
      var is = this.value() >= 1 ? 'up' : 'down';
      if (is !== dir)
        this.coord = vector.mul(this.coord, -1);

      return this;
    }
    else
      return this.value() >= 1 ? 'up' : 'down';
  },

  simple: function(ignore) {
    // Get the (upwards) base interval (with quality)
    var octaves = this.octaves();
    var simple = [Math.abs(this.coord[0]) - octaves * 7, Math.abs(this.coord[1]) - octaves * 12];
    
    // Turn it around if necessary
    if (!ignore)
      simple = this.direction() === 'down' ? vector.mul(simple, -1) : simple;

    return new Interval(simple);
  },

  isCompound: function() {
    return this.number() > (Interval.octaveIsSimple ? 8 : 7);
  },
  
  isSimple: function() {
    return !this.isCompound();
  },

  invert: function() {
    var simple = this.simple();
    // Special: even when octaveIsSimple is false, we want unisons to
    // invert to octaves
    if (this.coord[0] % 7 === 0 && this.coord[0]) {
      if (this.direction() === 'up')
        return new Interval([0, -simple.coord[1]]);
      else 
        return new Interval([0, simple.coord[1]]);
    }
    
    if (this.direction() === 'up')
      return new Interval([7 - simple.coord[0], 12 - simple.coord[1]]);
    else
      return new Interval([-7 - simple.coord[0], -12 - simple.coord[1]]);
  },

  quality: function(lng) {
    var quality = knowledge.alterations[this.type()][this.qualityValue() + 2];

    return lng ? knowledge.qualityLong[quality] : quality;
  },

  qualityValue: function() {
    if (this.direction() === 'down')
      return (-this.coord[1] % 12) - knowledge.intervals[knowledge.intervalsIndex[(this.number() - 1) % 7]][1];
    else
      return (this.coord[1] % 12) - knowledge.intervals[knowledge.intervalsIndex[(this.number() - 1) % 7]][1];
  },

  equal: function(interval) {
      return this.coord[0] === interval.coord[0] &&
          this.coord[1] === interval.coord[1];
  },

  greater: function(interval) {
    var semi = this.semitones();
    var isemi = interval.semitones();

    // If equal in absolute size, measure which interval is bigger
    // For example P4 is bigger than A3
    return (semi === isemi) ?
      (this.number() > interval.number()) : (semi > isemi);
  },

  smaller: function(interval) {
    return !this.equal(interval) && !this.greater(interval);
  },

  add: function(interval) {
    return new Interval(vector.add(this.coord, interval.coord));
  },

  toString: function(ignore) {
    // If given true, return the positive value
    var number = ignore ? this.number() : this.value();

    return this.quality() + number;
  }
}

Interval.fromString = function(simple) {
  var coord = toCoord(simple);
  if (!coord)
    throw new Error('Invalid simple format interval');

  return new Interval({coord: coord});
}

Interval.coerce = function(source, copy) {
  if (source instanceof Interval) return copy ? new Interval(source.coord) : source;
  if (typeof source === 'string') return Interval.fromString(source);
  if (source instanceof Array && source.length === 2) return new Interval(source);
  throw new Error("Cannot coerce " + source + " to an interval!");
}

Interval.from = function(from, to) {
  return from.interval(to);
}

Interval.between = function(from, to) {
  return new Interval(vector.sub(to.coord, from.coord));
}

Interval.invert = function(sInterval) {
  return Interval.fromString(sInterval).invert().toString();
}

Interval.octaveIsSimple = false;

module.exports = Interval;
