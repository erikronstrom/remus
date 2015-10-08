var repl = require("repl").start({prompt: "> ", useGlobal: true});
repl.context["teoria"] = require("teoria");
repl.context["remus"] = require("./index");

require('repl.history')(repl, process.env.HOME + '/.node_history');

