var Env = require('./env');

module.exports = {
  typeMap: {},
  ignoredProperties: ['parent', 'cache'],
  
  store: function(obj) {
    var getObjectTypeString = this.getObjectTypeString.bind(this);
    var ignoredProperties = this.ignoredProperties;
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
    var strToProto = this.strToProto.bind(this);
    var typeMap = this.typeMap;
    var root = JSON.parse(str, function (k, v) {
      var proto = (v && v.type) ? strToProto(v.type) : null;
      if (proto && proto.prototype) {
        var obj = Object.create(proto.prototype);
        for (var i in v) {
          if (i != 'type') obj[i] = v[i];
        }
        return obj;
      } else {
        return v;
      }
    });
    root.env = new Env(root.env);
    if (root.init) root.init();
    return root;
  },
    
  bless: function(obj) {
    return this.restore(this.store(obj));
  },
  
  strToProto: function(str) {
    return this.typeMap[str];
  },

  getObjectTypeString: function(obj) {
    for (var typeStr in this.typeMap) {
      var proto = this.typeMap[typeStr];
      if (proto.isPrototypeOf(obj) || obj instanceof proto) return typeStr;
    }
    return null;
  }
}
