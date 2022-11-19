import { context, propagation, trace } from '@opentelemetry/api';
import express from 'express';
import asyncHandler from 'express-async-handler';

const app = express();
const hostname = '0.0.0.0';
const port = 3000;

const tracer = trace.getTracer('hello-world-tracer');

app.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const sayHello = () => 'Hello world!';
    // new context based on current, with key/values added to baggage
    const ctx = propagation.setBaggage(
      context.active(),
      propagation.createBaggage({
        for_the_children: { value: 'another important value' },
      }),
    );
    // within the new context, do some "work"
    await context.with(ctx, async () => {
      await tracer.startActiveSpan('sleep', async (span) => {
        console.log('saying hello to the world');
        span.setAttribute('message', 'hello-world');
        span.setAttribute('delay_ms', 100);
        console.log('sleeping a bit!');
        await sleepy();
        span.end();
      });
    });
    sayHello();
    res.end('Hello, World!\n');
  }),
);

function sleepy() {
  return new Promise(() =>
    setTimeout(() => {
      console.log('awake now!');
    }, 100),
  );
}

app.listen(port, hostname, () => {
  console.log(`Now listening on: http://${hostname}:${port}/`);
});
