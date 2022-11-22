import {
  Context,
  context,
  propagation,
  trace,
  Tracer,
} from '@opentelemetry/api';
import express, { Express, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const app: Express = express();
const hostname = '0.0.0.0';
const port = 3000;

app.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const sayHello = () => 'Hello world!';
    const tracer: Tracer = trace.getTracer('hello-world-tracer');
    // new context based on current, with key/values added to baggage
    const ctx: Context = propagation.setBaggage(
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
        await sleepy();
        console.log('sleeping a bit!');
        span.end();
      });
    });
    sayHello();
    res.end('Hello, World!\n');
  }),
);

function sleepy(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('awake now!');
    }, 100);
    resolve();
  });
}

app.listen(port, hostname, () => {
  console.log(`Now listening on: http://${hostname}:${port}/`);
});
