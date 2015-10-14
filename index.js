var Base = require('./lib/base.js');
var Render = require('./lib/render.js');
var Store = require('./lib/store.js');

var Interval = require('./lib/interval');
var Pitch = require('./lib/pitch');
var Duration = require('./lib/duration');
var Chord = require('./lib/chord');
var Note = require('./lib/note');
knowledge = require('./lib/knowledge');

var remus = {
  realizeTime: Base.realizeTime,
  render: Render.render,
  Store: Store,
  
  Interval: Interval,
  Pitch: Pitch,
  Duration: Duration,
  Note: Note,
  Chord: Chord,
  
  interval: Interval.coerce,
  pitch: Pitch.coerce,
  duration: Duration.coerce,
  note: Note.coerce,
  chord: Chord.coerce
};

exports = module.exports = remus;
