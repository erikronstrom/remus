"use strict";

// Tempo is defined as [beat, bpm]
// E.g. [4, 120] means 1/4 = 120

// Time is [amount, unit], where unit can be 'ms' or 'note'
// [430, 'ms']   ==> 430 ms
// [8, 'note']   ==> eighth note

function toMs(time, tempo) {
  tempo = tempo || [4, 120];
  if (time[1] == 'ms') return time[0];
  wpm = tempo[1] / tempo[0];
  if (time[1] == 'note') return 60000 / (time[0] * wpm);
  return undefined;
}

module.exports = {

  realizeTime: function(obj, tempo, startTime, lastTime) {
    obj.startTime = obj.position ? startTime + toMs([obj.position[0], obj.position[1]], tempo) : lastTime;
    var maxEnd = 0;
    var lastEnd = 0;
    if (obj.contents) {
      var row = 0;
      for (var i = 0; i < obj.contents.length; i++) {
        //obj.contents[i].parent = obj;
        if (obj.contents[i].position && i > 0) row++;
        obj.contents[i].row = row;
        lastEnd = this.realizeTime(obj.contents[i], tempo, obj.startTime, lastEnd);
        if (lastEnd > maxEnd) maxEnd = lastEnd;
      }
    }
    if (obj.duration) obj.endTime = obj.startTime + toMs(obj.duration, tempo);
    else obj.endTime = obj.startTime + maxEnd;
    return obj.endTime - startTime;
  },

  removeObj: function(obj) {
    if (obj.parent) {
      obj.parent.contents = obj.parent.contents.filter(function(x) { return x != obj });
    } else {
      alert("Cannot remove root!");
    }
  },

  objToString: function(obj, type) {
    var s = [];
    if (type) s.push(obj.type);
    s.push("Position: " + (obj.position ? (obj.position[0] + ' ' + obj.position[1]) : '--'));
    s.push("Duration: " + (obj.duration ? (obj.duration[0] + ' ' + obj.duration[1]) : '--'));
    var ignore = ["type", "contents", "duration", "pos", "parent"];
    for (p in obj) {
      if (obj.hasOwnProperty(p) && (ignore.indexOf(p) < 0)) s.push(p + ': ' + obj[p]);
    }
    return s.join("\n");
  }
}