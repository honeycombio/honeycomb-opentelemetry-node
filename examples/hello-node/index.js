const { configureHoneycombSDK } = require('@honeycombio/opentelemetry-node');
const { trace } = require('@opentelemetry/api');

const http = require('node:http');
const hostname = '0.0.0.0';
const port = 3000;

// uses HONEYCOMB_API_KEY and OTEL_SERVICE_NAME environment variables
const sdk = configureHoneycombSDK({ debug: true });

// alternatively, provide apikey and service name using options
// const sdk = configureHoneycombSDK({
//   apiKey: "{apikey}",
//   serviceName: "my-web-app",
// })

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
