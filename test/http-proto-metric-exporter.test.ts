import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from '../src/exporter-utils';
import { DEFAULT_API_ENDPOINT } from '../src/honeycomb-options';
import { configureHoneycombHttpProtoMetricExporter } from '../src/http-proto-metric-exporter';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

const dataset = 'my-dataset';
const apikey = '0000000000000000000000'; // 22 chars
const endpoint = 'https://my-generic-endpoint.com';
const metricsEndpoint = 'https://my-metrics-endpoint.com';

describe('metrics exporter tests', () => {
  test('it should return an OTLPMetricExporter', () => {
    const metricReader = configureHoneycombHttpProtoMetricExporter();
    expect(metricReader).toBeInstanceOf(OTLPMetricExporter);
  });

  describe('code config', () => {
    test('it should set team and dataset headers', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: apikey,
        metricsDataset: dataset,
      });
      expect(metricExporter._otlpExporter.headers[OTLP_HEADER_KEY]).toBe(
        OTLP_PROTO_VERSION,
      );
      expect(metricExporter._otlpExporter.headers[TEAM_HEADER_KEY]).toBe(
        apikey,
      );
      expect(metricExporter._otlpExporter.headers[DATASET_HEADER_KEY]).toBe(
        dataset,
      );
    });

    test('it should use the default URL if no url is specified', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: apikey,
        metricsDataset: dataset,
      });

      expect(metricExporter._otlpExporter.url).toBe(
        DEFAULT_API_ENDPOINT + '/v1/metrics',
      );
    });

    test('it should set the URL from endpoint', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: apikey,
        metricsDataset: dataset,
        endpoint: 'https://my-metrics-endpoint.com',
      });

      expect(metricExporter._otlpExporter.url).toBe(
        'https://my-metrics-endpoint.com/v1/metrics',
      );
    });

    test('it should set the URL from metricsEndpoint', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: apikey,
        metricsDataset: dataset,
        endpoint: 'https://my-generic-endpoint.com',
        metricsEndpoint: 'https://my-metrics-endpoint.com',
      });

      expect(metricExporter._otlpExporter.url).toBe(
        'https://my-metrics-endpoint.com',
      );
    });

    test('it should prefer metricsApiKey over apiKey', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: 'genericApiKey',
        metricsApiKey: 'metricsApiKey',
        metricsDataset: dataset,
      });
      expect(metricExporter._otlpExporter.headers[TEAM_HEADER_KEY]).toBe(
        'metricsApiKey',
      );
    });
  });

  describe('env vars', () => {
    beforeEach(() => {
      process.env.HONEYCOMB_API_KEY = apikey;
      process.env.HONEYCOMB_METRICS_DATASET = dataset;
      process.env.HONEYCOMB_API_ENDPOINT = 'https://my-generic-endpoint.com';
    });

    test('it should set team and dataset headers', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: 'apikey',
        metricsDataset: 'dataset',
      });
      expect(metricExporter._otlpExporter.headers[OTLP_HEADER_KEY]).toBe(
        OTLP_PROTO_VERSION,
      );
      expect(metricExporter._otlpExporter.headers[TEAM_HEADER_KEY]).toBe(
        apikey,
      );
      expect(metricExporter._otlpExporter.headers[DATASET_HEADER_KEY]).toBe(
        dataset,
      );
    });

    test('it should use env var endpoint', () => {
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: apikey,
        metricsDataset: dataset,
      });

      expect(metricExporter._otlpExporter.url).toBe(endpoint + '/v1/metrics');
    });

    test('it should use the metrics env var endpoint', () => {
      process.env.HONEYCOMB_METRICS_ENDPOINT = metricsEndpoint;
      const metricExporter = configureHoneycombHttpProtoMetricExporter({
        apiKey: apikey,
        metricsDataset: dataset,
      });

      expect(metricExporter._otlpExporter.url).toBe(metricsEndpoint);
    });
  });
});
