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
var Voice = require('./lib/voice');
var VerticalContainer = require('./lib/vertical-container');
var Song = require('./lib/song');

var knowledge = require('./lib/knowledge');

Store.typeMap = {
  Interval: Interval,
  Pitch: Pitch,
  Duration: Duration,
  Note: Note,
  Harmony: Harmony,
  Chord: Chord,
  ChordSequence: ChordSequence,
  Voice: Voice,
  VerticalContainer: VerticalContainer,
  Song: Song
};

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
  Voice: Voice,
  VerticalContainer: VerticalContainer,
  Song: Song,

  interval: Interval.coerce,
  pitch: Pitch.coerce,
  duration: Duration.coerce,
  note: Note.coerce,
  harmony: Harmony.coerce,
  chord: Chord.coerce,
  chordSequence: ChordSequence.coerce,
  voice: Voice.coerce,
  verticalContainer: VerticalContainer.coerce,
  song: Song.coerce
};

exports = module.exports = remus;
