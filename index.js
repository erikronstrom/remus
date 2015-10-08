var Base = require('./lib/base.js');
var Render = require('./lib/render.js');
var Store = require('./lib/store.js');
var teoria = require('teoria');

var remus = {
  realizeTime: Base.realizeTime,
  render: Render.render,
  Store: Store,
  
  Interval: teoria.Interval,
  Pitch: teoria.Pitch,
  Duration: teoria.Duration,
  Note: teoria.Note,
  Chord: teoria.Chord,
  
  interval: teoria.Interval.coerce,
  pitch: teoria.Pitch.coerce,
  duration: teoria.Duration.coerce,
  note: teoria.Note.coerce,
  chord: teoria.Chord.coerce
};

exports = module.exports = remus;
