const { HoneycombSDK } = require('@honeycombio/opentelemetry-node');
const { trace } = require('@opentelemetry/api');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const sdk = new HoneycombSDK({
  apiKey: process.env.HONEYCOMB_API_KEY || '',
  serviceName: process.env.OTEL_SERVICE_NAME || 'hello-node-express',
  debug: true,
  instrumentations: [getNodeAutoInstrumentations()],
});

// alternatively, use HONEYCOMB_API_KEY and OTEL_SERVICE_NAME and DEBUG environment variables
// const sdk = new HoneycombSDK();

const express = require('express');
const app = express();
const hostname = '0.0.0.0';
const port = 3000;

app.get('/', (req, res) => {
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

app.listen(port, hostname, () => {
  console.log(`Listening on http://${hostname}:${port}/`);
});

sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));
