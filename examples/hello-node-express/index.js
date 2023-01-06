const { HoneycombSDK } = require('@honeycombio/opentelemetry-node');
const { context, metrics, propagation, trace } = require('@opentelemetry/api');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');

const sdk = new HoneycombSDK({
  apiKey: process.env.HONEYCOMB_API_KEY || '',
  serviceName: process.env.OTEL_SERVICE_NAME || 'hello-node-express',
  debug: true,
  instrumentations: [getNodeAutoInstrumentations()],
  metricsDataset:
    process.env.HONEYCOMB_METRICS_DATASET || 'hello-node-express-metrics',
  // add app level attributes to appear on every span
  resource: new Resource({
    'global.build_id': process.env.APP_BUILD_ID,
  }),
});

// alternatively, use environment variables for
// HONEYCOMB_API_KEY, OTEL_SERVICE_NAME, DEBUG, and HONEYCOMB_METRICS_DATASET
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
  const meter = metrics.getMeter('hello-world-meter');
  const counter = meter.createCounter('sheep');
  counter.add(1);
  // new context based on current, with key/values added to baggage
  const ctx = propagation.setBaggage(
    context.active(),
    propagation.createBaggage({
      for_the_children: { value: 'another important value' },
    }),
  );
  // within the new context, do some "work"
  context.with(ctx, () => {
    tracer.startActiveSpan('sleep', (span) => {
      console.log('saying hello to the world');
      span.setAttribute('message', 'hello-world');
      span.setAttribute('delay_ms', 100);
      sleepy().then(() => console.log('sleeping a bit!'));
      span.end();
    });
  });
  sayHello();
  res.end('Hello, World!\n');
});

async function sleepy() {
  await setTimeout(() => {
    console.log('awake now!');
  }, 100);
}

app.listen(port, hostname, () => {
  console.log(`Now listening on: http://${hostname}:${port}/`);
});

sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));
