const { addHoneycomb } = require('@honeycombio/opentelemetry-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sayHello = () => 'Hello world!';

console.log(sayHello());
addHoneycomb().start();
