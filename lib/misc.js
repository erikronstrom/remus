var xml2js = require('xml2js');

module.exports = {
  
  dashToCamel: function(str) {
    return str.replace(/-([a-z])/gi, function(s, group1) {
        return group1.toUpperCase();
    });
  },
  
  parseXML: function(xml, settings) {
    settings = settings || {};
    if (!settings.hasOwnProperty('tagNameProcessors')) settings.tagNameProcessors = [this.dashToCamel];
    if (!settings.hasOwnProperty('explicitRoot')) settings.explicitRoot = false;
    settings.async = false;
    var parser = xml2js.Parser(settings);
    var result, error;
    parser.parseString(xml, function(err, res) {
      result = res;
      error = err;
    });
    if (error) throw new Error(error);
    return result;
  },
  
  buildXML: function(obj, settings) {
    settings = settings || {};
    if (!settings.hasOwnProperty('headless')) settings.headless = true;
    var builder = new xml2js.Builder(settings);
    return builder.buildObject(obj);
  },
  
  extendObject: function(obj, proto) {
    var o = Object.create(proto);
    if (obj) {
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) o[p] = obj[p];
      }
    }
    return o;
  },
  
  initSubObject: function(obj, env, clazz) {
    if (obj === undefined) return undefined;
    if (clazz && !(obj instanceof clazz)) {
      //console.log("Coercing to ", clazz.name, env.tcuPerOctave);
      obj = clazz.coerce(obj, this.extendObject(obj.env, env));
    } else {
      obj.env = this.extendObject(obj.env, env);
    }
    if (obj.init) obj.init();
    return obj;
  },
  
  initSubObjects: function(objArray, env, clazz) {
    if (!env) {
      throw new Error("env is undefined in initSubObjects");
    }
    for (var i = 0; i < objArray.length; i++)
      objArray[i] = this.initSubObject(objArray[i], env, clazz);
    return objArray;
  }
}