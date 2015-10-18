"use strict";
var daccord = require('daccord');
var knowledge = require('./knowledge');
var Env = require('./env');
var Pitch = require('./pitch');
var Interval = require('./interval');
var misc = require('./misc');
var xml2js = require('xml2js');
var chalk = require('chalk');
var _ = require('lodash');
var get = _.get; // require('lodash.get');
var includes = _.includes;
//var difference = _.difference;

function Harmony(properties, env) {
  if (!(this instanceof Harmony)) return new Harmony(properties, env);
  
  this.root = properties.root;
  this.intervals = properties.intervals || [];
  this.bass = properties.bass;
  this.text = properties.text;
  
  this.env = env || properties.env || new Env();
  
  
  // if (bass instanceof Pitch) {
  //   var intervals = this.intervals, bassInterval, pitch, text = bass.text;
  //   // Make sure the bass is atop of the root pitch
  //   pitch = Pitch.fromString(bass.toString(true) + (root.octave() + 1)); // crude
  //
  //   bassInterval = Interval.between(root, pitch);
  //   bass = bassInterval.simple();
  //   bass.text = text;
  // }
}

function simpleInterval(i) {
  return i.toString();
}

Harmony.prototype = {
  inspect: function() {
    return chalk.dim('<') + chalk.yellow.bold(this.toString()) + ' ' + chalk.yellow(this.intervals) + chalk.dim('>');
  },
  
  init: function() {
    //this.bass = misc.initSubObject(this.harmony, this.env, Pitch);
    this.intervals = misc.initSubObjects(this.intervals, this.env, Interval);
    return this;
  },
  
  pitches: function() {
    var root = this.root;
    return this.intervals.map(function(interval) {
      return root.interval(interval);
    });
  },

  simple: function() {
    return this.pitches().map(function(n) { return n.toString(true); });
  },

  isMajor: function() {
    return this.intervals.map(simpleInterval).indexOf('M3') >= 0;
  },
  
  isMinor: function() {
    return this.intervals.map(simpleInterval).indexOf('m3') >= 0;
  },
  
  isDominant: function() {
    var intervals = this.intervals.map(simpleInterval);
    return intervals.indexOf('M3') >= 0 && intervals.indexOf('m7') >= 0;
  },

  dominant: function(additional) {
    return this.interval('P5');
  },

  subdominant: function(additional) {
    return this.interval('P4');
  },

  parallel: function() {
    var quality = this.quality();

    if (this.harmonyType() !== 'triad' || !(quality === 'major' || quality === 'minor')) {
      throw new Error('Only major/minor triads have parallel harmonies');
    }

    if (this.isMajor()) {
      return new Harmony(this.root.interval('m3', 'down'), 'minor');
    } else {
      return new Harmony(this.root.interval('m3', 'up'), 'major');
    }
  },

  quality: function() {
    var third, fifth, seventh, intervals = this.intervals;

    for (var i = 0, length = intervals.length; i < length; i++) {
      if (intervals[i].number() === 3) {
        third = intervals[i];
      } else if (intervals[i].number() === 5) {
        fifth = intervals[i];
      } else if (intervals[i].number() === 7) {
        seventh = intervals[i];
      }
    }

    if (!third) {
      return;
    }

    third = (third.direction() === 'down') ? third.invert() : third;
    third = third.simple().toString();

    if (fifth) {
      fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
      fifth = fifth.simple().toString();
    }

    if (seventh) {
      seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
      seventh = seventh.simple().toString();
    }

    if (third === 'M3') {
      if (fifth === 'A5') {
        return 'augmented';
      } else if (fifth === 'P5') {
        return (seventh === 'm7') ? 'dominant' : 'major';
      }

      return 'major';
    } else if (third === 'm3') {
      if (fifth === 'P5') {
        return 'minor';
      } else if (fifth === 'd5') {
        return (seventh === 'm7') ? 'half-diminished' : 'diminished';
      }

      return 'minor';
    }
  },
  
  kind: function() {
    var degrees = {};
    [2, 3, 4, 5, 6, 7].map(function(x) {
      var interval = this.getDegree(x);
      degrees[x] = interval ? interval.quality() : null;
    }, this);
    
    // SPECIAL
    if (!degrees[3] && degrees[7] === 'm' && degrees[2] === 'M' && degrees[4] === 'P')
      return "dominant-11th";
    if (degrees[7] === 'm' && degrees[3] === 'M' && degrees[6] === 'M')
      return "dominant-13th";
    
    // MAJOR CHORDS
    if (degrees[3] === 'M') {
      // Augmented
      if (degrees[5] === 'A') {
        if (degrees[7] === 'm') return "augmented-seventh";
        return "augmented";
      }
      // Dominants
      if (degrees[7] === 'm') {
        if (degrees[2] === 'M') return "dominant-ninth";
        if (degrees[4] === 'P') return "dominant-ninth";
        return "dominant";
      }
      // Major sevenths
      if (degrees[7] === 'M') {
        if (degrees[6] === 'M') return 'major-13th';
        if (degrees[2] === 'M') return "major-ninth";
        return "major-seventh";
      }
      // Other major harmonies
      if (degrees[5] === 'A') return "augmented";
      if (degrees[6] === 'M') return "major-sixth";
      return "major";
    }
    
    // MINOR CHORDS
    if (degrees[3] === 'm') {
      // Diminished & half-diminished
      if (degrees[5] === 'd') {
        if (degrees[7] === 'd') return "diminished-seventh";
        if (degrees[7] === 'm') return "half-diminished";
        return "diminished";
      }
      // Sevenths
      if (degrees[7] === 'm') {
        if (degrees[2] === 'M') return "minor-ninth";
        return "minor-seventh";
      }
      // Other minor harmonies
      if (degrees[6] === 'M') return "minor-sixth";
      if (degrees[7] === 'M') return "major-minor";
      return "minor";
    }
    
    // SUSPENDED
    if (degrees[5] === 'P' || !degrees[5]) {
      if (degrees[2] === 'M') return "suspended-second";
      if (degrees[4] === 'P') return "suspended-fourth";
    }
      
    return "other";
  },

  harmonyType: function() { // In need of better name
    var intervals = this.intervals();
    var length = intervals.length, interval, has, invert, i, name;

    if (length === 2) {
      return 'dyad';
    } else if (length === 3) {
      has = {first: false, third: false, fifth: false};
      for (i = 0; i < length; i++) {
        interval = intervals[i];
        invert = interval.invert();
        if (interval.base() in has) {
          has[interval.base()] = true;
        } else if (invert.base() in has) {
          has[invert.base()] = true;
        }
      }

      name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
    } else if (length === 4) {
      has = {first: false, third: false, fifth: false, seventh: false};
      for (i = 0; i < length; i++) {
        interval = intervals[i];
        invert = interval.invert();
        if (interval.base() in has) {
          has[interval.base()] = true;
        } else if (invert.base() in has) {
          has[invert.base()] = true;
        }
      }

      if (has.first && has.third && has.fifth && has.seventh) {
        name = 'tetrad';
      }
    }

    return name || 'unknown';
  },

  getDegree: function(interval) {
    var intervals = this.intervals, i, length;
    interval = (interval - 1) % 7;
    for (i = 0, length = intervals.length; i < length; i++) {
      if ((intervals[i].number() - 1) % 7 === interval) {
        return intervals[i];
      }
    }
    return null;
  },

  // get: function(interval) {
  //   var intervals = this.intervals, i, length;
  //   if (typeof interval === 'number') {
  //     for (i = 0, length = intervals.length; i < length; i++) {
  //       if (intervals[i].number() === interval) {
  //         return this.root.interval(intervals[i]);
  //       }
  //     }
  //     return null;
  //   } else if (typeof interval === 'string' && interval in knowledge.stepNumber) {
  //     interval = knowledge.stepNumber[interval];
  //     for (i = 0, length = intervals.length; i < length; i++) {
  //       if (intervals[i].number() === interval) {
  //         return this.root.interval(intervals[i]);
  //       }
  //     }
  //
  //     return null;
  //   } else {
  //     throw new Error('Invalid interval name');
  //   }
  // },

  // interval: function(interval) {
  //   return new Harmony(this.root.interval(interval), this.kind, this.bass, this.degrees);
  // },

  transpose: function(interval) {
    this.root.transpose(interval);
    // TODO: update name
    return this;
  },
    
  toXML: function() {
    var root = { step: this.root.name().toUpperCase(), alter: this.root.accidentalValue(), text: this.root.text };
    var bass;
    if (this.bass) {
      bass = this.root.interval(this.bass);
      bass = { step: bass.name().toUpperCase(), alter: bass.accidentalValue(), text: this.bass.text };
    }
    var kind = this.kind();
    var kindText = null; // TODO
    var xml = '';
    xml += "<harmony>\n";
    xml += "  <root>\n";
    if (root.text && root.text !== root.step)
      xml += '    <root-step text="' + root.text + '">' + root.step + "</root-step>\n";
    else
      xml += "    <root-step>" + root.step + "</root-step>\n";
    if (root.alter)
      xml += "    <root-alter>" + root.alter + "</root-alter>\n";
    xml += "  </root>\n";
    if (bass) {
      xml += "  <bass>\n";
      if (bass.text && bass.text !== bass.step)
        xml += '    <bass-step text="' + bass.text + '">' + bass.step + "</bass-step>\n";
      else
        xml += "    <bass-step>" + bass.step + "</bass-step>\n";
      if (bass.alter)
        xml += "    <bass-alter>" + bass.alter + "</bass-alter>\n";
      xml += "  </bass>\n";
    }
    if (kindText)
      xml += '<kind text="' + kindText + '">' + kind + "</kind>\n";
    else
      xml += "<kind>" + kind + "</kind>\n";
    // this.degrees.forEach(function(degree) {
    //   xml += "<degree>\n";
    //   xml += (typeof degree.text === 'string') ? ('  <degree-type text="' + degree.text + '">') : '<degree-type>';
    //   xml += degree.type;
    //   xml += "</degree-type>\n";
    //   xml += "<degree-value>" + degree.step + "</degree-value>\n";
    //   switch (degree.type) {
    //   case "add":
    //     // TODO
    //     break;
    //   case "alter":
    //     xml += "<degree-alter>" + degree.semitones + "</degree-alter>\n";
    //     break;
    //   case "subtract":
    //     // TODO
    //     break;
    //   }
    //   xml += "</degree>\n";
    // });
    xml += "</harmony>\n";
    return xml;
  },

  toString: function() {
    var bass = '';
    // if (this.bass) {
//       if (this.bass.text) {
//         bass = '/' + this.bass.text;
//       } else {
//         bass = this.root.interval(this.bass);
//         bass = '/' + bass.name().toUpperCase() + bass.accidental();
//       }
//     }
    return (this.root.text || (this.root.name().toUpperCase() + this.root.accidental()))
      + knowledge.chordShort[this.kind()] + bass;
  }
};

Harmony.coerce = function(source, env, copy) {
  if (source instanceof Harmony) {
    if (copy || (source.env !== env)) return new Harmony(source, env);
    else return source;
  }
  if (typeof source === 'string') return Harmony.fromString(source, env);
  var Chord = require('./chord'); // Needed because of circular dependency. TODO: check performance of runtime require!
  if (source instanceof Chord) return (new Harmony(source.harmony, env)).init();
  throw new Error("Cannot coerce " + source + " to a harmony!");
}

function find(elem, array) {
  return array.indexOf(elem) >= 0;
}

function addInterval(step, acc) {
  var defaultAddAlter = "xPMMPPMmPMMPPM";
  var interval = Interval.fromString(defaultAddAlter[step] + step); // concatenation
  interval.coord[1] += acc;
  return interval;
}

Harmony.fromString = function(str, env) {
  env = env || new Env();
  // N.C.
  if (str.match(/^\\s*N\\.?\\s*C\\.?\\s*$/i) || str.match(/^\\s*no\\s*harmony/i))
    return (new Harmony({}, env)).init();
  // Normal harmonies
  var matches = str.match(/^\(?([A-Ga-gHh](?:x|#+|b+)?)\s*\(?((.*?)((?:(?:add|no|omit)[#b]*\d+|[#b]+\d+)*))\)?(?:\/([A-Ga-gHh][#b]*))?$/i);
  if (matches) {
    var root = Pitch.fromString(matches[1], Object.create(env));
    root.text = matches[1];
    var rest = matches[2].trim();
    var main = matches[3].trim().replace(/\(/g, "").replace(/\^/g, "Δ");
    var extra = matches[4].trim().replace(/\^/g, "Δ");
    main = main.replace(/\^/g, "Δ");
    rest = rest.replace(/\^/g, "Δ");
    var bass = matches[5] ? Pitch.fromString(matches[5], Object.create(env)) : null;
    if (bass) bass.text = matches[5];


    var kind, override = {};
    //console.log(root, "rest: " + rest, "main: " + main, "extra: " + extra, bass);
    
    // Triads (excluding diminished, which is tested for below)
    if (!main) kind = 'major';
    else if (find(main, ['-', 'm', 'mi', 'min'])) kind = 'minor';
    else if (find(main, ['aug', '+', '+5', '#5'])) kind = 'augmented';
    // Sevenths
    else if (main === '7') kind = 'dominant';
    else if (find(main, ['ø', 'ø7', 'Ø', 'Ø7', '0', '07']) ||
      find(rest.replace(/\\\(/g, ''), ['-7b5', 'm7b5', 'm7-5', 'mi7b5'])) kind = 'half-diminished';
    else if (find(main, ['aug7', '7#5', '+7', '7+', '7+5'])) kind = 'augmented-seventh';
    else if (find(main, ['maj', 'maj7', 'Δ', 'Δ7', 'M', 'M7'])) kind = 'major-seventh';
    else if (find(main, ['-7', 'm7', 'mi7'])) kind = 'major-seventh';
    else if (find(main, ['dim', 'dim7', 'o', '°', 'o7', '°7'])) kind = 'diminished-seventh';
    else if (find(main, ['7sus', '7sus4', 'sus7'])) kind = 'dominant-suspended-fourth'; // XXX
    else if (rest.match(/^(\-|m|mi|min)[\/\(]?(M9|Δ9|maj9)/)) {
      kind = 'major-minor';
      override[9] = 'M';
    }
    else if (rest.match(/^(\-|m|mi|min)[\/\(]?(\\+7|maj(?!9)|M7?|Δ|Δ7|maj7)/)) kind = 'major-minor';
    else if (rest.match(/(\+5?|aug)?[\/\(]?(\\+7|M7|Δ|Δ7|maj7)/)) {
      kind = 'major-seventh';
      override[5] = 'A';
    }
    // Sixths
    else if (find(main, ['6', 'M6', 'maj6'])) kind = 'major-sixth';
    else if (find(main, ['-6', 'm6', 'mi6'])) kind = 'minor-sixth';
    else if (find(main, ['6/9', '69', '9/6'])) {
      kind = 'major-sixth';
      override[9] = 'M';
    }
    // Ninths
    else if (main === '9') kind = 'dominant-ninth';
    else if (find(main, ['M9', 'maj9', 'Δ9'])) kind = 'major-ninth';
    else if (find(main, ['-9', 'm9', 'mi9'])) kind = 'minor-ninth';
    else if (main === 'm2') { // synonym for madd9
      kind = 'minor';
      override[9] = 'M';
    }
    // 11ths
    else if (find(main, ['11', '9sus', '9sus4'])) kind = 'dominant-11th';
    else if (find(main, ['M11', 'maj11', 'Δ11'])) kind = 'major-11th';
    else if (find(main, ['-11', 'm11', 'mi11'])) kind = 'minor-11th';
    // 13ths
    else if (main === '13') kind = 'dominant-13th';
    else if (find(main, ['M13', 'maj13', 'Δ13'])) kind = 'major-13th';
    else if (find(main, ['-13', 'm13', 'mi13'])) kind = 'minor-13th';
    // Suspended
    else if (main === 'sus2') kind = 'suspended-second';
    else if (find(main, ['sus', 'sus4'])) kind = 'suspended-fourth';
    // Other
    else if (find(main, ['5', 'no3'])) kind = 'power';
    
    var intervals = {};
    var defaultIntervals = knowledge.chordDegrees[kind];
    for (var x in defaultIntervals) intervals[x] = defaultIntervals[x];
    for (var x in override) intervals[x] = override[x];
    
    extra.split(/(\D+\d+)/).forEach(function(x) {
      if (x) {
        var matches = x.match(/^[ \(\)]*(add|no|omit)?([#b]?)(\d+)/);
        if (matches) {
          var acc = knowledge.accidentals.indexOf(matches[2]) - 2;
          if (acc < -2) acc = 0;
          var step = matches[3];
          if (step >= 2 && step <= 13) {
            //console.log(matches[1], acc, step);
            if (matches[1] === 'add') {
              if (acc === 0) intervals[step] = 'xxMMPPMmPMMPPM'[step];
              else if (acc === 1) intervals[step] = 'xxAAAAAAAAAAAA'[step];
              else if (acc === -1) intervals[step] = 'xxmmddmmdmmddm'[step];
            } else if (find(matches[1], ['no', 'omit'])) {
              delete intervals[step];
            } else if (acc != 0) {
              if (acc === 1) intervals[step] = 'xxAAAAAAAAAAAA'[step];
              else if (acc === -1) intervals[step] = 'xxmmddmmdmmddm'[step];
            }
          }
        }
      }
    });
    
    var intervalList = [];
    for (var i in intervals) intervalList.push(Interval.fromString(intervals[i] + i, Object.create(env)));
    
    return (new Harmony({root: root, intervals: intervalList, bass: bass, text: rest}, env)).init();
  }
}

Harmony.fromXML = function(xml) {
  var parser = xml2js.Parser({
    tagNameProcessors: [misc.dashToCamel],
    explicitArray: false,
    mergeAttrs: true,
    explicitCharkey: true});
  var result;
  parser.parseString(xml, function(err, obj) {
    //console.log(get(obj, "harmony.root[0].rootStep[0]"));
    var root = Pitch.fromString(get(obj, "harmony.root.rootStep._"));
    root.coord[1] += parseFloat(get(obj, "harmony.root.rootAlter._", 0));
    var bass = get(obj, "harmony.bass.bassStep._");
    if (bass) {
      bass = Pitch.fromString(bass);
      bass.coord[1] += parseFloat(get(obj, "harmony.bass.bassAlter._", 0));
    }
    var kind = get(obj, "harmony.kind._");
    var text = get(obj, "harmony.kind.text");
    
    // TODO: follow the spec regarding degree-alter:
    // The degree-type element can be add, alter, or
    // subtract. If the degree-type is alter or subtract, the
    // degree-alter is relative to the degree already in the
    // harmony based on its kind element. If the degree-type is
    // add, the degree-alter is relative to a dominant harmony
    // (major and perfect intervals except for a minor
    // seventh).
    // [http://www.musicxml.com/for-developers/musicxml-dtd/direction-elements/]
    
    var degrees = [];
    var ds = get(obj, "harmony.degree");
    if (!(ds instanceof Array)) ds = [ds];
    ds.forEach(function(d) {
      var step = get(d, "degreeValue._");
      var acc = parseInt(get(d, "degreeAlter._", 0));
      var text = get(d, "degreeType.text");
      if (step) {
        switch (d.degreeType._) {
        case "add": degrees.push({type: 'add', step: step, interval: addInterval(step, acc), text: text}); break;
        case "subtract": degrees.push({type: 'subtract', step: step, text: text}); break;
        case "alter": degrees.push({type: 'alter', step: step, semitones: acc, text: text}); break;
        }
      }
    });
    
    result = (new Harmony(root, kind, bass, degrees)).init();
  });
  return result;
};

module.exports = Harmony;
