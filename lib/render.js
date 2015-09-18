function render(obj) {
  //var x = 0;
  var contents = '';
  if (obj.contents) {
    for (var i = 0; i < obj.contents.length; i++) {
      contents += render(obj.contents[i]);
    }
  }
  var result = '';
  if (obj.pos) result += '<div style="margin-left: ' + (obj.pos[0] * 100) + '%; padding-left: ' + obj.pos[1] + 'px">';
  result += '<div class="object ' + obj.type.toLowerCase() + '" style="';
  if (obj.duration) {
    var w = obj.duration[0];
    result += 'width: ' + w + 'px; ';
  }
  result += '">';
  result += '<h1>' + obj.type + '</h1>';
  if (contents) {
    result += '<div class="contents">' + contents + '</div>';
  }
  result += '</div>';
  if (obj.pos) result += '</div>';
  return result;
}

function render2(obj) {
  var contents = '';
  if (obj.contents) {
    for (var i = 0; i < obj.contents.length; i++) {
      contents += render2(obj.contents[i]);
    }
  }
  var result = '';
  result += '<div style="position: absolute; '
    + 'left: ' + (obj.startTime / 10) + 'px; '
    + 'width: ' + ((obj.endTime - obj.startTime) / 10) + 'px; '
    + 'top: ' + (obj.row ? obj.row * 30 : 0) + 'px">';
  result += '<div class="object ' + obj.type.toLowerCase() + '">';
  result += '<h1>' + obj.type + '</h1>';
  if (contents) {
    result += '<div class="contents" style="position: relative">' + contents + '</div>';
  }
  result += '</div>';
  result += '</div>';
  return result;
}


function createTitle(title) {
  var wrapper = document.createElement('h1');
  var textNode = document.createTextNode(title);
  wrapper.appendChild(textNode);
  return wrapper;
}

function updateInfoField(obj) {
  $('#info h1').text(obj.type);
  $('#info pre').text(objToString(obj));
  document.getElementById('info').style.display = 'block';
}

var hovered;
var selected;

function render3(obj) {
  var node = document.createElement('div');
  node.appendChild(createTitle(obj.type));
  node.className = "object " + obj.type.toLowerCase();
  node.style.left = (obj.startTime / 10) + 'px';
  node.style.width = ((obj.endTime - obj.startTime) / 10) + 'px';
  node.style.top = (obj.row ? obj.row * 40 : 0) + 'px';
  node.dataset.row = obj.row;
  node.obj = obj;
  node.title = objToString(obj); // JSON.stringify(obj, null, 4);
  
  node.onclick = function(e) {
    updateInfoField(node.obj);
    if (selected) $(selected).removeClass("selected");
    selected = node;
    $(node).addClass("selected");
    e.stopPropagation();
  }
  
  node.onmouseover = function(e) {
    if (hovered && (hovered != node)) $(hovered).removeClass('hovered');
    $(node).addClass('hovered');
    hovered = node;
    e.stopPropagation();
  }
  
  node.onmouseout = function(e) {
    if (node == hovered) $(node).removeClass('hovered');
    hovered = null;
  }
  
  var height = 0;
  if (obj.contents) {
    var container = document.createElement('div');
    container.className = 'container';
    for (var i = 0; i < obj.contents.length; i++) {
      var child = obj.contents[i];
      var childNode = render3(child);
      container.appendChild(childNode);
      var h = parseInt(childNode.style.top) + parseInt(childNode.style.height) + 5;
      if (h > height) height = h;
    }
    height += 25;
    if (height < 30) height = 30;
    container.style.height = height + 'px';
    node.appendChild(container);
    node.style.height = container.style.height;
  } else {
    node.style.height = '20px';
  }
  
  return node;
}

