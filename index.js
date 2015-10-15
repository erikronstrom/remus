var Base = require('./lib/base.js');
var Render = require('./lib/render.js');
var Store = require('./lib/store.js');

var Interval = require('./lib/interval');
var Pitch = require('./lib/pitch');
var Duration = require('./lib/duration');
var Harmony = require('./lib/harmony');
var Chord = require('./lib/chord');
var ChordSequence = require('./lib/chord-sequence');
var Note = require('./lib/note');
knowledge = require('./lib/knowledge');

Store.typeMap = {
  Interval: Interval,
  Pitch: Pitch,
  Duration: Duration,
  Harmony: Harmony,
  Chord: Chord,
  ChordSequence: ChordSequence,
  Note: Note
}

var remus = {
  realizeTime: Base.realizeTime,
  render: Render.render,
  Store: Store,
  
  Interval: Interval,
  Pitch: Pitch,
  Duration: Duration,
  Note: Note,
  Harmony: Harmony,
  Chord: Chord,
  ChordSequence: ChordSequence,
  
  interval: Interval.coerce,
  pitch: Pitch.coerce,
  duration: Duration.coerce,
  note: Note.coerce,
  harmony: Harmony.coerce,
  chord: Chord.coerce,
  chordSequence: ChordSequence.coerce
};

exports = module.exports = remus;
