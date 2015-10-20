"use strict";
var Item = require('./item');
var misc = require('./misc');
var Duration = require('./duration');

// function Event(properties, env) {
//   // if (!(this instanceof Event)) return new Event(properties, env);
//   // this.position = properties.position;
//   // this.duration = properties.duration;
//   // this.anchor   = properties.anchor;
//   // this.offset   = properties.offset;
//
//   Item.call(this, properties, env);
// }

//var Event = misc.createItemClass(Item, ["position", "duration", "anchor", "offset"], {
var Event = Item.extend("Event", ["position", "duration", "anchor", "offset"], {
  
  init: function() {
    Item.prototype.init.call(this);
    this.position = misc.initSubObject(this.position, this.env, Duration);
    this.duration = misc.initSubObject(this.duration, this.env, Duration);
    this.anchor   = misc.initSubObject(this.anchor, this.env, Duration);
    this.offset   = misc.initSubObject(this.offset, this.env, Duration);
    return this;
  },
  
  toJSON: function() {
    return Item.prototype.toJSON.call(this);
  }
});

module.exports = Event;
