"use strict";
var Env = require('./env');
function Item(properties, env) {
  // if (properties) Object.keys(properties).forEach(function(key) {
  //   this[key] = properties[key];
  // });
  this.slots.forEach(function(key) {
    this[key] = properties[key];
  }, this);
  this.env = env || properties.env;
  this.init();
}

Item.prototype = {
  init: function() {
    if (!(this.env instanceof Env)) this.env = new Env(this.env || {});
    return this;
  },
  
  toJSON: function() {
    var obj = {};
    if (this.className) obj.type = this.className;
    Object.keys(this).forEach(function (key) {
      obj[key] = this[key];
    }, this);
    return obj;
  }
};

Object.defineProperty(Item.prototype, "slots", {
  value: ["env"],
  enumerable: false,
  configurable: false
});

Item.extend = function extend(name, slots, properties) {
  // Save the value of this, in case it is shadowed
  var baseClass = this;
  // Create a constructor function, which only calls the super method.
  // Use "new Function" to make a named function.
  // NOTE: in the general case, we would want to pass baseClass, however,
  // as the constructor doesn't do anything, we can delegate to the top
  // class directly (which happens to be Item)
  var subClass = new Function("BaseClass",
    "return function " + name + "(properties, env) { BaseClass.call(this, properties, env); }"
  )(Item);
  // Inherit from the base class
  subClass.prototype = Object.create(baseClass.prototype)
  subClass.prototype.constructor = subClass;
  subClass.prototype.className = name;
  // Copy functions from the properties argument
  Object.keys(properties).forEach(function(p) {
    subClass.prototype[p] = properties[p];
  });
  // Reference this function, so that the subclass can be extended further
  subClass.extend = extend;
  // Add new slots to the slots array
  Object.defineProperty(subClass.prototype, "slots", {
    value: baseClass.prototype.slots.concat(slots),
    enumerable: false,
    configurable: false
  });
  return subClass;
}

module.exports = Item;
