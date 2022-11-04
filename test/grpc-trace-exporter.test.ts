import { configureHoneycombGrpcTraceExporter } from '../src/grpc-trace-exporter';
import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from '../src/exporter-utils';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const dataset = 'my-dataset';
const apikey = '0000000000000000000000'; // 22 chars
const classicApikey = '00000000000000000000000000000000'; // 32 chars

test('it should return an OTLPTraceExporter', () => {
  const traceExporter = configureHoneycombGrpcTraceExporter();
  expect(traceExporter instanceof OTLPTraceExporter);
});

describe('with a regular apikey', () => {
  test('it should set the team and not the dataset headers', () => {
    const traceExporter = configureHoneycombGrpcTraceExporter({
      apiKey: apikey,
      dataset: dataset,
    });
    expect(traceExporter.url).toBe('api.honeycomb.io');
    expect(traceExporter.metadata?.get(OTLP_HEADER_KEY)[0]).toBe(
      OTLP_PROTO_VERSION,
    );
    expect(traceExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(apikey);
    expect(traceExporter.metadata?.get(DATASET_HEADER_KEY)[0]).toBeUndefined();
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
      const traceExporter = configureHoneycombGrpcTraceExporter({
        apiKey: 'apikey',
        dataset: 'dataset',
      });
      expect(traceExporter.url).toBe('api.honeycomb.io');
      expect(traceExporter.metadata?.get(OTLP_HEADER_KEY)[0]).toBe(
        OTLP_PROTO_VERSION,
      );
      expect(traceExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(apikey);
      expect(
        traceExporter.metadata?.get(DATASET_HEADER_KEY)[0],
      ).toBeUndefined();
    });
  });
});

describe('with a classic apikey', () => {
  test('it should set the team and dataset headers', () => {
    const traceExporter = configureHoneycombGrpcTraceExporter({
      apiKey: classicApikey,
      dataset: dataset,
    });
    expect(traceExporter.url).toBe('api.honeycomb.io');
    expect(traceExporter.metadata?.get(OTLP_HEADER_KEY)[0]).toBe(
      OTLP_PROTO_VERSION,
    );
    expect(traceExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(classicApikey);
    expect(traceExporter.metadata?.get(DATASET_HEADER_KEY)[0]).toBe(dataset);
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
      const traceExporter = configureHoneycombGrpcTraceExporter({
        apiKey: 'apikey',
        dataset: 'dataset',
      });
      expect(traceExporter.url).toBe('api.honeycomb.io');
      expect(traceExporter.metadata?.get(OTLP_HEADER_KEY)[0]).toBe(
        OTLP_PROTO_VERSION,
      );
      expect(traceExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(
        classicApikey,
      );
      expect(traceExporter.metadata?.get(DATASET_HEADER_KEY)[0]).toBe(dataset);
    });
  });
});