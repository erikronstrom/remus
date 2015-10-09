Remus
=====

## Basic types

----------------------

### Pitch

#### Types of pitch

Three types of pitches are supported:

* Absolute frequencies (in Hertz) OR Mel-ish/float MIDI note number
* Tone-height category (number of units, usually semitones, above C0)
* Structural pitch category, i.e. tones including "spelling" (F# ≠ Gb)

Structural pitches are stored as [Intervals](# Interval) relative to C0

*(Possible extensions: pitch-class/chroma, i.e. tone-height without octave information, and corresponding tonal representation without octave)*

Note that more than one of the pitch types can be simultanously present in the same Pitch object. For example, an imported MIDI file will only have tone-heights set, while tonal categorization data may be added later by some analysis process.

#### Additional data

The tone-height and tonal representations can be complemented by a value for *pitch deviation* in cents.

Vibrato (min/max pitch)
“Pitch envelope”
Glissando

#### Coercing

In places where a pitch is expected, the following inputs can be coerced to a pitch (using Pitch.coerce):

* Strings of tonal pitches in scientific notation (e.g. "Ab4" or "C3")
* Strings of frequencies (e.g. "440 Hz")
* Numbers, interpreted as tone-height
* An [interval](# Interval), interpreted as relative to C0
* A list of two numbers, which is first coerced to an [interval](# Interval)

#### Questions

* Should non-pitched sounds be represented *inside* the Pitch class, or by using another class (or e.g. `null`) in the referencing object?
* Multiple representations are probably not strictly needed in the case of pitch – if pitch-deviation is stored, no information is lost when going "up" from a frequency to a tone-height or tonal representation. Having a single representation at any given time would probably make it easier using the class, however, that could possibly close the door for future extensions of the pitch class.
* Unpitched / Semi-pitched as separate classes, or as variants of the Pitch class?

-----------------

### Interval

Intervals are "qualified", i.e. they consist of a *quality* (perfect, major, minor, augmented, diminished) and a *value* (second, third, octave, etc).

Internally, intervals are stored as arrays of two numbers: `[steps, semitones]`. A major second up (M2) represented by `[1, 2]`, because it means one diatonic step and two semitones up. A perfect fifth down is `[-4, -7]`.

Note that the first number has to be an integer, while the second number can be a floating point number, in order to represent a microtonal interval. For example, `[2, 3.5]` is a third of 3.5 semitones, which is in between a minor and major third.

#### Coercing

Where an interval is expected, the following input formats are accepted and coerced to an interval:

* Strings of shorthand notation ("m2" = minor second up, "d-5" = diminished fifth down)
* Number. The quality is implicitly that of a major scale (i.e perfect/major for upwards intervals, and perfect/minor for downwards intervals)
* A list of an integer and a number, as described above

#### Questions

* Would it be smart to have types of intervals corresponding to the different types of pitches? In that case, we would need a "frequency interval" and a "tone-height interval" in addition to the qualified interval. As they would both be represented by a simple numeric difference in Hz or semitones, respectively, it would be simple to implement, but on the other hand, is there really a need for it?
* Johan’s comment: “diatonic” intervals (step only)
* TODO: step numbers mustn’t be locked to a heptatonical context

-----------------

### Duration

A duration consists of a *value* and a *unit*. While durations can be used on their own, they are typically used as parts of bigger objects, such as [notes](# Note).

The duration class in itself has no knowledge of semantics of the value and unit – it is up to the containing context to define their meaning. However, at least these units can be expected to be used:

* `ms` (milliseconds)
* `divisions` (as in MusicXML, divisions of a quarter note, the resolution is set in the surrounding context)
* `measures`
* `beats`
* `beat-groups`

TODO: clarify metrical/non-metrical structure

-----------

### Note

A note consists mainly of [position](# Positioning), [pitch](# Pitch), velocity and a [duration](# Duration). The duration is the "nominal duration", i.e. it reflects a duration *category* (quarter note, dotted half note, etc) rather than an exact amount of time the note sounds.

In addition to the nominal duration, an *actual duration* can be specified. In case of a not-yet-analyzed recording, notes will generally lack nominal duration values, in which case the actual duration is the only available value.

TODO: document position

#### Additional data

Additional data is not specified here, but could include parameters such as

* performance duration / duration deviation
* performance timing
* articulation
* ornamentation
* stress
* score information (courtesy accidental, etc)
* other display information (color, graphical offset ,etc)

TODO: tremolo – recurring events, or grouping events into “super-events” (e.g. trills)

---------------

### NoteList

A collection of simultanous [notes](# Note), sharing "horizontal" properties (such as timing and duration), but with different pitches and possibly other differing properties (such as velocity and articulation).

If a note in a NoteList specifies its own nominal position, it is ignored. Durations can differ, however.


---------------

### Harmony

(Under work!)

Properties:

* List of actual [pitches](# Pitch)
* Root
* Categorization
  - Main category
  - Main tension
  - Additional tensions
  - Modifiers
* List of chord degrees
* String representation (optional)

Actual pitches is generally only present when the harmony originates from a performance. If a chord is chosen from a list or created from a text representation (such as "Cm7b5"), the list of actual pitches will be empty, unless it is filled in with some pre-defined or computed voicing.

#### Categories

Main category includes `major`, `minor`, `suspended-fourth`, `augmented`, `diminished` and `power`. Main tension is `sixth`, `minor-seventh` and `major-seventh`. Additional tensions can then be added, such as 9, 11 and 13. Modifiers can add, remove or alter chord degrees present from the category and tensions.

#### Chord degrees

The list of chord degrees is mainly redundant to the categorization, but enables the use of harmonies for which there are no pre-defined categories. While the list of supported categories could of course be extended, should the need arise, a category system can never contain all possible harmonies.

Note that these chord degrees denote a "nominal harmony" rather than voicing. E.g. a 7sus4 chord would be represented as `[P4, P5, m7]`, even if the seventh was actually played in the octave below the fourth. Octave equivalence is generally assumed, with the exception that the intervals between octave and 13th can be used for tensions, as in common in Western harmonic systems.

The list contains of values that can be coerced to [Interval objects](# Interval). Note that microtonal intervals are supported.

From a list of intervals, a hash can be generated, which is often much easier to work with:

`[M3, A5, m7]` ==> `{3: M3, 5: A5, 7: m7}` or even `{3: 'M', 5: 'A', 7: 'm'}`

This approach is limited to one version of each chord degree, (e.g. both perfect and augmented fifth is not supported). However this is rarely a problem in practice, at least when working with tonal music.

TODO: relation to tonal context?


#### Questions

* In MusicXML, unknown harmonies are accomplished by using the category `other`, and specifying all included chord degrees as *add* degrees. While this is perhaps not very elegant, it still makes it possible to represent arbitrary harmonies. A list of chord degrees could therefore be calculated instead of stored separetely, which would reduce redundancy. On the other hand a chord degree list is in many ways a "cleaner" solution than a cateogry-based representation, and it may be useful to specify the components of a harmony explicitly.

  As an example, a 13th chord may or may not include the fifth, ninth and 11th. While the addition or subtraction of the fifth does not change the categorization of the chord as a 13th chord, it still changes the "color". The presence or absence of a perfect fifth may also be important in a tonal context where the fifth would otherwise be altered.
  
  (So, is a chord degree list motivated or not?) YES!

-------------

### Chord

Chord relates to [harmony](# Harmony) in a similar way that [note](# Note) relates to [pitch](# Pitch) – that is, it represents an actual occurrence of a harmony. Thus, it includes a reference to a Harmony object, as well as a position and a [duration](# Duration) (and more?)

#### TODO

* reference to multiple harmonies, in order to provide multiple possible interpretations
* store actual note list in chord, rather than in harmony (or both?)


-------------

## Songs

Objects are organized hierarchially, with a Song being the root object.

Conceptually, a song consists of

* a timeline, or [spine](# Spine)
* objects relating to the spine (events)
* objects that do not relate to the spine, and therefore have no timing (a resource pool)

Examples of the latter can be links, audio files not [yet] used in the actual song, imported lyrics, MIDI-files, etc.

(Technically, resources may be stored in the same list as timed events, but lacking an explicit position or reference to the spine)

### Events

We need to support at least the following types:

* Audio files (or rather, references thereto)
* Chord sequences
* Voices (can be polyphonic, or divided into monophonic subvoices)
* Lyrics
* Generic containers, used for grouping events (vertically and/or horizontally)

TODO: Maybe a "timeline object" is also needed, a container which specifies time signature and tempo (and possibly other semi-global properties) for the contained objects.

An audio recording will first result in an audio file. After audio analysis, there will be a voice, where the individual notes have no nominal positions and durations, only actual ditto. After music analysis, nominal values are added.

(An alternative solution would be to have two different kinds of voices, like in SC Studio where the listener format is a simple time/pitch grid and the voice structure used by songs is a different format)


### Positioning

#### Relativity

Events are generally positioned in relation to their parent container. For example, notes specify their position in relation to their voice.

Each event has a origo (anchor point), which may be different from the "start" of the event. This enables e.g. voices with pickups to sync to other events on their first downbeat, rather than their first note.

In addition to the hierarchical positioning, events may also refer to the spine. This makes it possible to sync events directly to events in other containers.

#### Spine

The spine concept is borrowed from IEEE 1599. Quoting from [http://www.mx.lim.di.unimi.it/reference_manual/spine.php]():

>  Spine is made of a sorted list of music events, where the definition and granularity of the term "event" can be defined by the author of the encoding. In this sense, spine represents an abstraction level, as the events identified do not have to correspond necessarily to score symbols, or audio samples, or anything else. The author can decide each time what goes under the definition of "music event", according to the needs.
>  
>  ...
>
>  [S]pine acts also as a glue in a multi-layer structure, in which music events are not only listed and ordered by spine, but also tagged by unique identifiers. These identifiers, conceptually similar to unique key constraints in a database, are referred to by all instances of the corresponding event representations in other layers.

#### Questions

* How is time-line consistency guaranteed? The ordering of events must be enforced, while spine references makes time-line inconsistencies possible. Some kind of validation function perhaps, that can remove illegal spine references.



## Global/local parameters

Tonal resolution (heptatonic, pentatonic etc)
Tone-height resolution (how many pitches per octave) (what about non-uniform distribution and temperment?)



## TODO: Metrical layers / metrical structure

## TODO: Non-metrical structure (phrase-based?)

## TODO: Tonality

## TODO: Macro objects – for example loop a sequence of notes for a certain time, or a certain number of events

## TODO: group objects and render them as something else, e.g. trills




