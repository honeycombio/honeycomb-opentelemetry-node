const { sayHello, addHoneycomb } = require('@honeycombio/opentelemetry-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

console.log(sayHello());
addHoneycomb().start();
