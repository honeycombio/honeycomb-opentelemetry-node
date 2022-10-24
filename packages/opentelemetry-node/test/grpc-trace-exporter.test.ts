import { honeycombGrpcTraceExporter } from '../src/grpc-trace-exporter';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

test('it should return an OTLPTraceExporter', () => {
  const traceExporter = honeycombGrpcTraceExporter({ apiKey: 'foo' });
  expect(traceExporter instanceof OTLPTraceExporter);
});

test('it should set properties on the exporter object', () => {
  const traceExporter = honeycombGrpcTraceExporter({
    apiKey: 'foo',
  });
  expect(traceExporter.url).toBe('https://api.honeycomb.io');
  // TODO: this needs to be metadata now
  expect(traceExporter.headers['x-honeycomb-team']).toBe('foo');
  // TODO: this needs to be metadata now
  // TODO: get value instead of hard-coding
  expect(traceExporter.headers['x-otlp-version']).toBe('0.16.0');
};);

test('it should prefer the apiKey and x-otlp-version property from HoneycombOptions over passed-in headers', () => {
  // TODO: if a duplicate key is found, which should win?
  // i.e. if x-honeycomb-team is passed as a header
  // AND passed as an API Key... which should win?
  const traceExporter = honeycombGrpcTraceExporter({
    apiKey: 'foo',
    headers: { 'x-honeycomb-team': 'bar', 'x-otlp-version': '42' },
  });
  // TODO: this needs to be metadata now
  expect(traceExporter.headers['x-honeycomb-team']).toBe('foo');
  // TODO: this needs to be metadata now
  // TODO: get value instead of hard-coding
  expect(traceExporter.headers['x-otlp-version']).toBe('0.16.0');
});
