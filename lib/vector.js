module.exports = {
  add: function(pitch, interval) {
    return [pitch[0] + interval[0], pitch[1] + interval[1]];
  },

  sub: function(pitch, interval) {
    return [pitch[0] - interval[0], pitch[1] - interval[1]];
  },

  mul: function(pitch, interval) {
    if (typeof interval === 'number')
      return [pitch[0] * interval, pitch[1] * interval];
    else
      return [pitch[0] * interval[0], pitch[1] * interval[1]];
  },

  sum: function(coord) {
    return coord[0] + coord[1];
  }
}
