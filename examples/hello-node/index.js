const {
  // Honeycomb,
  honeycombTraceExporter,
} = require('@honeycombio/opentelemetry-node');
const {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  trace,
} = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');

const http = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const HONEYCOMB_API_KEY = process.env.HONEYCOMB_API_KEY || 'testkey';
const serviceName = process.env.OTEL_SERVICE_NAME || 'hello-node';

// use Honeycomb Exporter with Node SDK
const sdk = new NodeSDK({
  traceExporter: honeycombTraceExporter({ apiKey: HONEYCOMB_API_KEY }),
  serviceName,
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'http/plain');
  const sayHello = () => 'Hello world!';
  const tracer = trace.getTracer('hello-world-tracer');
  tracer.startActiveSpan('main', (span) => {
    console.log('saying hello to the world');
    span.setAttribute('message', 'hello-world');
    span.end();
  });
  sayHello();
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));
