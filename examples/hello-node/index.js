const {
  Honeycomb,
  honeycombTraceExporter,
} = require('@honeycombio/opentelemetry-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sayHello = () => 'Hello world!';

console.log(sayHello());
const sdk = Honeycomb({
  traceExporter: honeycombTraceExporter,
});

sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));
