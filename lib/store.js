var typeMap = {};
var ignoredProperties = ['parent', 'cache'];

function strToProto(str) {
  return typeMap[str];
}

function getObjectTypeString(obj) {
  for (var typeStr in typeMap) {
    var proto = typeMap[typeStr];
    if (proto.isPrototypeOf(obj) || obj instanceof proto) return typeStr;
  }
  return null;
}

module.exports = {
  store: function(obj) {
    return JSON.stringify(obj, function(k, v) {
      var typeStr = getObjectTypeString(v);
      if (typeStr) {
        var obj = {type: typeStr};
        for (var i in v) {
          if (ignoredProperties.indexOf(i) < 0)
            obj[i] = v[i];
        }
        return obj;
      } else {
        return v;
      }
    });
  },

  restore: function(str) {
    var root = JSON.parse(str, function (k, v) {
      var proto = strToProto(v.type);
      if (proto) {
        var obj = Object.create(proto);
        for (var i in v) {
          if (i != 'type') obj[i] = v[i];
        }
        return obj;
      } else {
        return v;
      }
    });
    if (root.init) root.init();
  },
    
  bless: function(obj) {
    return this.restore(this.store(obj));
  },
  
  typeMap: typeMap,
  ignoredProperties: ignoredProperties
}
