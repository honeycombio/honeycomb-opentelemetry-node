const { HoneycombSDK } = require('@honeycombio/opentelemetry-node');
const { trace } = require('@opentelemetry/api');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

// uses HONEYCOMB_API_KEY and OTEL_SERVICE_NAME environment variables
// enable debug output with env var DEBUG=true
const sdk = new HoneycombSDK({
  instrumentations: [new HttpInstrumentation()],
});

// alternatively, provide apikey and service name using options
// const sdk = new HoneycombSDK({
//   apiKey: "{apikey}",
//   serviceName: "my-web-app",
//   instrumentations: [new HttpInstrumentation()],
// })

const http = require('node:http');
const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
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
