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
  }
  
}