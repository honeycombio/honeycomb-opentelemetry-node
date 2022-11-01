import {
  honeycombTraceExporter,
  TEAM_HEADER_KEY,
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
} from '../src/http-trace-exporter';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { DEFAULT_API_ENDPOINT } from '../src/honeycomb-options';

const dataset = 'my-dataset';
const apikey = '0000000000000000000000'; // 22 chars
const classicApikey = '00000000000000000000000000000000'; // 32 chars

test('it should return an OTLPTraceExporter', () => {
  const traceExporter = honeycombTraceExporter();
  expect(traceExporter instanceof OTLPTraceExporter);
});

describe('with a regular apikey', () => {
  test('it should set the team and not the dataset headers', () => {
    const traceExporter = honeycombTraceExporter({
      apiKey: apikey,
      dataset: dataset,
    });
    expect(traceExporter.url).toBe(DEFAULT_API_ENDPOINT);
    expect(traceExporter.headers[OTLP_HEADER_KEY]).toBe(OTLP_PROTO_VERSION);
    expect(traceExporter.headers[TEAM_HEADER_KEY]).toBe(apikey);
    expect(traceExporter.headers[DATASET_HEADER_KEY]).toBeUndefined();
  });

  describe('when env vars are set', () => {
    beforeEach(() => {
      process.env.HONEYCOMB_API_KEY = apikey;
      process.env.HONEYCOMB_DATASET = dataset;
    });

    afterEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
      delete process.env.HONEYCOMB_DATASET;
    });

    test('it should set the team and dataset headers from env vars', () => {
      const traceExporter = honeycombTraceExporter({
        apiKey: 'apikey',
        dataset: 'dataset',
      });
      expect(traceExporter.url).toBe(DEFAULT_API_ENDPOINT);
      expect(traceExporter.headers[OTLP_HEADER_KEY]).toBe(OTLP_PROTO_VERSION);
      expect(traceExporter.headers[TEAM_HEADER_KEY]).toBe(apikey);
      expect(traceExporter.headers[DATASET_HEADER_KEY]).toBeUndefined();
    });
  });
});

describe('with a classic apikey', () => {
  test('it should set the team and dataset headers', () => {
    const traceExporter = honeycombTraceExporter({
      apiKey: classicApikey,
      dataset: dataset,
    });
    expect(traceExporter.url).toBe(DEFAULT_API_ENDPOINT);
    expect(traceExporter.headers[OTLP_HEADER_KEY]).toBe(OTLP_PROTO_VERSION);
    expect(traceExporter.headers[TEAM_HEADER_KEY]).toBe(classicApikey);
    expect(traceExporter.headers[DATASET_HEADER_KEY]).toBe(dataset);
  });

  describe('when env vars are set', () => {
    beforeEach(() => {
      process.env.HONEYCOMB_API_KEY = classicApikey;
      process.env.HONEYCOMB_DATASET = dataset;
    });

    afterEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
      delete process.env.HONEYCOMB_DATASET;
    });

    test('it should set the team and dataset headers from env vars', () => {
      const traceExporter = honeycombTraceExporter({
        apiKey: 'apikey',
        dataset: 'dataset',
      });
      expect(traceExporter.url).toBe(DEFAULT_API_ENDPOINT);
      expect(traceExporter.headers[OTLP_HEADER_KEY]).toBe(OTLP_PROTO_VERSION);
      expect(traceExporter.headers[TEAM_HEADER_KEY]).toBe(classicApikey);
      expect(traceExporter.headers[DATASET_HEADER_KEY]).toBe(dataset);
    });
  });
});
