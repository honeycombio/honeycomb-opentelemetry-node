const {
  HoneycombHttp,
  honeycombHttpTraceExporter,
} = require('@honeycombio/opentelemetry-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sdk = HoneycombHttp({
  traceExporter: honeycombHttpTraceExporter({
    apiKey: 'test-key',
  }),
});

sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;
const otel = require('@opentelemetry/api');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'http/plain');
  const sayHello = () => 'Hello world!';
  const tracer = otel.trace.getTracer('hello-world-tracer');
  tracer.startActiveSpan('main', (span) => {
    console.log('saying hello to the world');
    span.setAttribute('important_note', 'heygirl');
    span.end();
  });
  sayHello();
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
