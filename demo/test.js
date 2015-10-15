//teoria = require('teoria');
remus = require('../index.js');
//JSON.minify = JSON.minify || require("node-json-minify");


obj1 = {
  type: "Song",
  duration: [8700, 'ms'],
  contents: [
    {
      type: "Audio",
      duration: [5500, 'ms'],
      anchor: [0, 10, 'ms'],
      pos: [0.1, 400, 'ms']
    },
    {
      type: "Notes",
      pos: [0, 0, 'ms'],
      contents: [
        {
          type: "note",
          duration: [4, 'note'],
          pitch: [30, 60],
          velocity: 80
        },
        {
          type: "Note",
          // pos: [0, 0, 'ms'],
          duration: [8, 'note'],
          pitch: [31, 62],
          velocity: 81
        },
        {
          type: "Note",
          pos: [0, 5000, 'ms'],
          duration: [6, 'note'],
          pitch: [29, 58],
          velocity: 81
        },
      ]
    }
  ]
}


//obj2 = JSON.parse(JSON.minify());

obj2 = {
  "type": "Song",
  "spine": {
    "type": "Spine",
    "events": [
      {"id": 1},
      {"id": 2},
      {"id": 3},
      {"id": 4},
      {"id": 5},
      {"id": 6}
    ]
  },
  "items": [], // resources not related to time, i.e. non-events
  "contents": [
    {
      "type": "VerticalContainer",
      "contents":
      [
        {
          "type": "Timeline",
          "master": true,
          "duration": null,
          "events": [
            [0, {"type": "Tempo", "bpm": 108, "beat": 4}],
            [0, {"type": "Time", "num": 4, "denom": 4}],
            [0, {"type": "Key", "root": "C", "mode": "major"}]
          ]
        },
        // {
        //   "type": "horizontal-container",
        //   "contents":
        //   [
        //     {"type": "harmony", "harmony": "C", "duration": [4, "beats"], "sync": 1},
        //     {"type": "harmony", "harmony": "Am", "duration": [4, "beats"]},
        //     {"type": "harmony", "harmony": "F", "duration": [4, "beats"]},
        //     {"type": "harmony", "harmony": "G", "duration": [4, "beats"]},
        //     {"type": "harmony", "harmony": "Em", "duration": [6, "beats"], "sync": 2},
        //     {"type": "harmony", "harmony": "Bm", "duration": [2, "beats"]},
        //     {"type": "harmony", "harmony": "Am", "duration": [8, "beats"]}
        //   ]
        // }
        {
          "type": "ChordSequence",
          "name": "chords", // to identify the object
          "title": "Mina ackord",
          "contents":
          [
            {"type": "Harmony", "harmony": "C", "duration": [4, "beats"], "sync": 1},
            {"type": "Harmony", "harmony": "Am", "duration": [4, "beats"]},
            // {"harmony": "F", "duration": [4, "beats"]},
            // {"harmony": "G", "duration": [4, "beats"]},
            // {"harmony": "Em", "duration": [6, "beats"], "sync": 2},
            // {"harmony": "Bm", "duration": [2, "beats"]},
            // {"harmony": "Am", "duration": [8, "beats"]}
          ]
        },
        {
          "type": "Voice", // as in "second voice", not "vocals"
          "name": "notes", // to identify the object
          "sync": 1,
          "title": "Sång",
          "meta": [], // possibility to override time, key, etc
          "sound": "keyboard.piano.grand",
          "contents": [
            {"type": "Note", "pitch": 65, "position": [50, "ms"], "duration": [437, "ms"]},
            {"type": "Note", "pitch": 64, "position": [250, "ms"], "duration": [437, "ms"]},
            {"type": "Note", "pitch": 65, "position": [530, "ms"], "duration": [437, "ms"]},
            {"type": "Note", "pitch": 67, "position": [800, "ms"], "duration": [437, "ms"]},
            {"type": "Note", "pitch": 65, "position": [1245, "ms"], "duration": [437, "ms"]},
            {"type": "Note", "pitch": 64, "position": [1530, "ms"], "duration": [437, "ms"]},
            {"type": "Note", "pitch": 62, "position": [1780, "ms"], "duration": [437, "ms"]}
          ]
        },
        {
          "type": "AudioFile",
          "name": "original-audio",
          "id": "FD56BA72A9F",
          "title": "Sång",
          "duration": [10768, "ms"],
          "channels": 1,
          "sampleRate": 44100,
          "fileType": "AIFF",
          "anchor": [1220, "ms"],  // this means that the sync point of this object is 1220 ms into the audio file
          "trimLeft": [520, "ms"], // independent of anchor
          "trimRight": 0
          //"offset": [2, "beats"]
        }
      ]
    }
  ]
}



$(document).ready(function() {
  testRender();
});

window.testRender = function() {
  remus.realizeTime(obj2, [4, 180]);
  //document.getElementById("rendered").innerHTML = render2(obj1);
  //document.getElementById('rendered').innerHTML = 'ape';
  document.getElementById('rendered').appendChild(remus.render(obj2));
}

window.xml2js = require('xml2js');

