var notecoord = require('notecoord');

// Pitch coordinates [octave, fifth] relative to C
module.exports = {
  pitches: notecoord.notes,

  intervals: {
    unison: [0, 0],
    second: [1, 1],
    third: [2, 3],
    fourth: [3, 5],
    fifth: [4, 7],
    sixth: [5, 8],
    seventh: [6, 10],
    octave: [7, 12]
  },

  intervalFromFifth: ['second', 'sixth', 'third', 'seventh', 'fourth',
                         'unison', 'fifth'],

  intervalsIndex: ['unison', 'second', 'third', 'fourth', 'fifth',
                      'sixth', 'seventh', 'octave', 'ninth', 'tenth',
                      'eleventh', 'twelfth', 'thirteenth', 'fourteenth',
                      'fifteenth'],

// linaer index to fifth = (2 * index + 1) % 7
  fifths: ['f', 'c', 'g', 'd', 'a', 'e', 'b'],
  tones: ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
  accidentals: ['bb', 'b', '', '#', 'x'],
  quarterToneAccidentals: ['bb', '¾b', 'b', '¼b', '', '¼#', '#', '¾#', 'x'],

  sharp: notecoord.sharp,
  A4: notecoord.A4,

  durations: {
    '0.25': 'longa',
    '0.5': 'breve',
    '1': 'whole',
    '2': 'half',
    '4': 'quarter',
    '8': 'eighth',
    '16': 'sixteenth',
    '32': 'thirty-second',
    '64': 'sixty-fourth',
    '128': 'hundred-twenty-eighth'
  },

  qualityLong: {
    P: 'perfect',
    M: 'major',
    m: 'minor',
    A: 'augmented',
    AA: 'doubly augmented',
    d: 'diminished',
    dd: 'doubly diminished'
  },

  alterations: {
    perfect: ['dd', 'd', 'P', 'A', 'AA'],
    minor: ['dd', 'd', 'm', 'M', 'A', 'AA']
  },

  symbols: {
    'min': ['m3', 'P5'],
    'm': ['m3', 'P5'],
    '-': ['m3', 'P5'],

    'M': ['M3', 'P5'],
    '': ['M3', 'P5'],

    '+': ['M3', 'A5'],
    'aug': ['M3', 'A5'],

    'dim': ['m3', 'd5'],
    'o': ['m3', 'd5'],

    'maj': ['M3', 'P5', 'M7'],
    'dom': ['M3', 'P5', 'm7'],
    'ø': ['m3', 'd5', 'm7'],

    '5': ['P5']
  },

  chordShort: {
    'major': '',
    'minor': 'm',
    'augmented': '+',
    'diminished': 'o',
    'dominant': '7',
    'major-seventh': 'M7',
    'minor-seventh': 'm7',
    'diminished-seventh': 'o7',
    'augmented-seventh': '+7',
    'half-diminished': 'ø',
    'major-minor': 'mM',
    'dominant-suspended-fourth': '7sus4',
    'major-sixth': '6',
    'minor-sixth': 'm6',
    'dominant-ninth': '9',
    'major-ninth': 'M9',
    'minor-ninth': 'm9',
    'dominant-11th': '11',
    'major-11th': 'M11',
    'minor-11th': 'm11',
    'dominant-13th': '13',
    'major-13th': 'M13',
    'minor-13th': 'm13',
    'suspended-second': 'sus2',
    'suspended-fourth': 'sus4',
    'Neapolitan': 'N',
    // 'Italian'
    // 'French'
    // 'German'
    // 'pedal'
    'power': '5',
    'Tristan': 'tristan'
  },
  
  // chordDegrees: {
  //   'major': ['M3', 'P5'],
  //   'minor': ['m3', 'P5'],
  //   'augmented': ['M3', 'A5'],
  //   'diminished': ['m3', 'd5'],
  //   'dominant': ['M3', 'P5', 'm7'],
  //   'major-seventh': ['M3', 'P5', 'M7'],
  //   'minor-seventh': ['m3', 'P5', 'm7'],
  //   'diminished-seventh': ['m3', 'd5', 'd7'],
  //   'augmented-seventh': ['M3', 'A5', 'm7'],
  //   'half-diminished': ['m3', 'd5', 'm7'],
  //   'major-minor': ['m3', 'P5', 'M7'],
  //   'dominant-suspended-fourth': ['P4', 'P5', 'm7'], // not present in MusicXML
  //   'major-sixth': ['M3', 'P5', 'M6'],
  //   'minor-sixth': ['m3', 'P5', 'M6'],
  //   'dominant-ninth': ['M3', 'P5', 'm7', 'M9'],
  //   'major-ninth': ['M3', 'P5', 'M7', 'M9'],
  //   'minor-ninth': ['m3', 'P5', 'm7', 'M9'],
  //   'dominant-11th': ['M3', 'P5', 'm7', 'M9', 'P11'],
  //   'major-11th': ['M3', 'P5', 'M7', 'M9', 'P11'],
  //   'minor-11th': ['m3', 'P5', 'm7', 'M9', 'P11'],
  //   'dominant-13th': ['M3', 'P5', 'm7', 'M9', 'P11'],
  //   'major-13th': ['M3', 'P5', 'M7', 'M9', 'P11', 'M13'],
  //   'minor-13th': ['m3', 'P5', 'm7', 'M9', 'P11', 'M13'],
  //   'suspended-second': ['M2', 'P5'],
  //   'suspended-fourth': ['P4', 'P5'],
  //   'Neapolitan': ['M3', 'm6'],
  //   // 'Italian'
  //   // 'French'
  //   // 'German'
  //   // 'pedal'
  //   'power': ['P5'],
  //   'Tristan': ['A4', 'A6', 'A9']
  // },
    
    chordDegrees: {
      'major': {3: 'M', 5: 'P'},
      'minor': {3: 'm', 5: 'P'},
      'augmented': {3: 'M', 5: 'A'},
      'diminished': {3: 'm', 5: 'd'},
      'dominant': {3: 'M', 5: 'P', 7: 'm'},
      'major-seventh': {3: 'M', 5: 'P', 7: 'M'},
      'minor-seventh': {3: 'm', 5: 'P', 7: 'm'},
      'diminished-seventh': {3: 'm', 5: 'd', 7: 'd'},
      'augmented-seventh': {3: 'M', 5: 'A', 7: 'm'},
      'half-diminished': {3: 'm', 5: 'd', 7: 'm'},
      'major-minor': {3: 'm', 5: 'P', 7: 'M'},
      'dominant-suspended-fourth': {4: 'P', 5: 'P', 7: 'm'}, // not present in MusicXML
      'major-sixth': {3: 'M', 5: 'P', 6: 'M'},
      'minor-sixth': {3: 'm', 5: 'P', 6: 'M'},
      'dominant-ninth': {3: 'M', 5: 'P', 7: 'm', 9: 'M'},
      'major-ninth': {3: 'M', 5: 'P', 7: 'M', 9: 'M'},
      'minor-ninth': {3: 'm', 5: 'P', 7: 'm', 9: 'M'},
      'dominant-11th': {3: 'M', 5: 'P', 7: 'm', 9: 'M', 11: 'P'},
      'major-11th': {3: 'M', 5: 'P', 7: 'M', 9: 'M', 11: 'P'},
      'minor-11th': {3: 'm', 5: 'P', 7: 'm', 9: 'M', 11: 'P'},
      'dominant-13th': {3: 'M', 5: 'P', 7: 'm', 9: 'M', 11: 'P', 13: 'M'},
      'major-13th': {3: 'M', 5: 'P', 7: 'M', 9: 'M', 11: 'P', 13: 'M'},
      'minor-13th': {3: 'm', 5: 'P', 7: 'm', 9: 'M', 11: 'P', 13: 'M'},
      'suspended-second': {2: 'M', 5: 'P'},
      'suspended-fourth': {4: 'P', 5: 'P'},
      'Neapolitan': {3: 'M', 6: 'm'},
      // 'Italian'
      // 'French'
      // 'German'
      // 'pedal'
      'power': {5: 'P'},
      'Tristan': {4: 'A', 6: 'A', 9: 'A'}
    },

  stepNumber: {
    'unison': 1,
    'first': 1,
    'second': 2,
    'third': 3,
    'fourth': 4,
    'fifth': 5,
    'sixth': 6,
    'seventh': 7,
    'octave': 8,
    'ninth': 9,
    'eleventh': 11,
    'thirteenth': 13
  },

  // Adjusted Shearer syllables - Chromatic solfege system
  // Some intervals are not provided for. These include:
  // dd2 - Doubly diminished second
  // dd3 - Doubly diminished third
  // AA3 - Doubly augmented third
  // dd6 - Doubly diminished sixth
  // dd7 - Doubly diminished seventh
  // AA7 - Doubly augmented seventh
  intervalSolfege: {
    'dd1': 'daw',
    'd1': 'de',
    'P1': 'do',
    'A1': 'di',
    'AA1': 'dai',
    'd2': 'raw',
    'm2': 'ra',
    'M2': 're',
    'A2': 'ri',
    'AA2': 'rai',
    'd3': 'maw',
    'm3': 'me',
    'M3': 'mi',
    'A3': 'mai',
    'dd4': 'faw',
    'd4': 'fe',
    'P4': 'fa',
    'A4': 'fi',
    'AA4': 'fai',
    'dd5': 'saw',
    'd5': 'se',
    'P5': 'so',
    'A5': 'si',
    'AA5': 'sai',
    'd6': 'law',
    'm6': 'le',
    'M6': 'la',
    'A6': 'li',
    'AA6': 'lai',
    'd7': 'taw',
    'm7': 'te',
    'M7': 'ti',
    'A7': 'tai',
    'dd8': 'daw',
    'd8': 'de',
    'P8': 'do',
    'A8': 'di',
    'AA8': 'dai'
  }
}
