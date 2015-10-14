var repl = require("repl").start({prompt: "> ", useGlobal: true});
//repl.context["teoria"] = require("teoria");
repl.context["remus"] = require("./index");
repl.context["JSON"].minify = require("node-json-minify");

require('repl.history')(repl, process.env.HOME + '/.node_history');

