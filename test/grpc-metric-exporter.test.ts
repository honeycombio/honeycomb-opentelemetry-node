import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from '../src/exporter-utils';
import { configureHoneycombGrpcMetricExporter } from '../src/grpc-metric-exporter';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';

const dataset = 'my-metrics-dataset';
const apikey = '0000000000000000000000'; // 22 chars
const metricsApiKey = '1111111111111111111111' // 22 chars
const endpoint = 'my-generic-endpoint.com';
const metricsEndpoint = 'my-metrics-endpoint.com';

beforeEach(() => {
  // enable fake timers so timeouts work more relieably. This is required
  // to stop import errors from otlp-grpc-trace-base originating from onInit
  // https://jestjs.io/docs/timer-mocks#enable-fake-timers
  jest.useFakeTimers();
});

test('it should return an OTLPMetricExporter', () => {
  const metricExporter = configureHoneycombGrpcMetricExporter();
  expect(metricExporter).toBeInstanceOf(OTLPMetricExporter);
});

describe('with a regular apikey', () => {
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
    delete process.env.HONEYCOMB_DATASET;
  });
  test('it should set the team and dataset headers', () => {
    const metricExporter = configureHoneycombGrpcMetricExporter({
      apiKey: apikey,
      metricsDataset: dataset
    });
    expect(metricExporter._otlpExporter.metadata?.get(OTLP_HEADER_KEY)[0]).toBe(OTLP_PROTO_VERSION);
    expect(metricExporter._otlpExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(apikey);
    expect(metricExporter._otlpExporter.metadata?.get(DATASET_HEADER_KEY)[0]).toBe(dataset);
  });

  test('it should use the default URL if no url is specified', () => {
    const metricExporter = configureHoneycombGrpcMetricExporter({
      apiKey: apikey,
      metricsDataset: dataset,
    });

    expect(metricExporter._otlpExporter.url).toBe('api.honeycomb.io');
  });

  test('it should set the URL from endpoint', () => {
    const metricExporter = configureHoneycombGrpcMetricExporter({
      apiKey: apikey,
      metricsDataset: dataset,
      endpoint: metricsEndpoint,
    });

    expect(metricExporter._otlpExporter.url).toBe(metricsEndpoint);
  });

  test('it should set the URL from metricsEndpoint', () => {
    const metricExporter = configureHoneycombGrpcMetricExporter({
      apiKey: apikey,
      metricsDataset: dataset,
      endpoint: endpoint,
      metricsEndpoint: metricsEndpoint,
    });

    expect(metricExporter._otlpExporter.url).toBe(metricsEndpoint);
  });

  test('it should prefer metricsApiKey over apiKey', () => {
    const metricExporter = configureHoneycombGrpcMetricExporter({
      apiKey: apikey,
      metricsApiKey: metricsApiKey,
      metricsDataset: dataset,
    });

    expect(metricExporter._otlpExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(metricsApiKey);
  });

  describe('when env vars are set', () => {
    beforeEach(() => {
      process.env.HONEYCOMB_API_KEY = apikey;
      process.env.HONEYCOMB_METRICS_DATASET = dataset;
    });

    afterEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
      delete process.env.HONEYCOMB_DATASET;
    });

    test('it should set the team and dataset headers from env vars', () => {
      const metricExporter = configureHoneycombGrpcMetricExporter({
        apiKey: 'something else',
        metricsDataset: 'something else',
      });
      expect(metricExporter._otlpExporter.url).toBe('api.honeycomb.io');
      expect(metricExporter._otlpExporter.metadata?.get(OTLP_HEADER_KEY)[0]).toBe(OTLP_PROTO_VERSION);
      expect(metricExporter._otlpExporter.metadata?.get(TEAM_HEADER_KEY)[0]).toBe(apikey);
      expect(metricExporter._otlpExporter.metadata?.get(DATASET_HEADER_KEY)[0]).toBe(dataset);
    });
  });
});
