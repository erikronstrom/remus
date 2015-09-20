var teoria = require('teoria');

var obj1 = {
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
          type: "Note",
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

$(document).ready(function() {
  testRender();
});

function testRender() {
  realizeTime(obj1, [4, 180]);
  //document.getElementById("rendered").innerHTML = render2(obj1);
  document.getElementById('rendered').innerHTML = '';
  document.getElementById('rendered').appendChild(render3(obj1));
}

window.teoria = teoria;
