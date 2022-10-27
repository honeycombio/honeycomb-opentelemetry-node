import { honeycombTraceExporter } from '../src/http-trace-exporter';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

test('it should return an OTLPTraceExporter', () => {
  const traceExporter = honeycombTraceExporter({ apiKey: 'foo' });
  expect(traceExporter instanceof OTLPTraceExporter);
});

test('it should set properties on the exporter object', () => {
  const traceExporter = honeycombTraceExporter({
    apiKey: 'foo',
  });
  expect(traceExporter.url).toBe('https://api.honeycomb.io/v1/traces');
  expect(traceExporter.headers['x-honeycomb-team']).toBe('foo');
  // TODO: get value instead of hard-coding
  expect(traceExporter.headers['x-otlp-version']).toBe('0.16.0');
});
