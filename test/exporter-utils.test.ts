import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPTraceExporter as HttpProtoOTLPExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import {OTLPMetricExporter as GrpcMetricExporter} from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPMetricExporter as HttpProtoMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import {
  getHoneycombMetricExporter,
  getHoneycombMetricReader,
  getHoneycombSpanExporter,
} from '../src/exporter-utils';
import { OtlpProtocolKind } from '../src/honeycomb-options';

beforeEach(() => {
  // enable fake timers so timeouts work more relieably. This is required
  // to stop import errors from otlp-grpc-trace-base originating from onInit
  // https://jestjs.io/docs/timer-mocks#enable-fake-timers
  jest.useFakeTimers();
});

describe('getHoneycombSpanExporter', () => {
  it('gprc returns grpc exporter', () => {
    const exporter = getHoneycombSpanExporter({
      protocol: 'grpc',
    });
    expect(exporter).toBeInstanceOf(GrpcOTLPTraceExporter);
  });
  it('http/protobuf return http/proto exporter', () => {
    const exporter = getHoneycombSpanExporter({
      protocol: 'http/protobuf',
    });
    expect(exporter).toBeInstanceOf(HttpProtoOTLPExporter);
  });
  it('http/json return http/proto exporter', () => {
    const exporter = getHoneycombSpanExporter({
      protocol: 'http/json',
    });
    expect(exporter).toBeInstanceOf(HttpProtoOTLPExporter);
  });
});

describe('getHoneycombMetricReader', () => {
  it('returns a PeriodicExportingMetricReader if dataset provided', () => {
    const metricReader = getHoneycombMetricReader({
      metricsDataset: 'metrics-dataset',
    });
    expect(metricReader).toBeInstanceOf(PeriodicExportingMetricReader);
  });
  it('returns a undefined if theres no metrics dataset provided', () => {
    const metricReader = getHoneycombMetricReader();
    expect(metricReader).toBeUndefined();
  });
  it('no protocol returns http/proto exporter', () => {
    const exporter = getHoneycombMetricExporter({
      metricsDataset: 'metrics-dataset',
    });
    expect(exporter).toBeInstanceOf(HttpProtoMetricExporter);
  });
  it('specified http/proto returns http/proto exporter', () => {
    const exporter = getHoneycombMetricExporter({
      metricsDataset: 'metrics-dataset',
      protocol: OtlpProtocolKind.HttpProtobuf,
    });
    expect(exporter).toBeInstanceOf(HttpProtoMetricExporter);
  });
  it('specified grpc returns grpc exporter', () => {
    const exporter = getHoneycombMetricExporter({
      metricsDataset: 'metrics-dataset',
      protocol: OtlpProtocolKind.Grpc,
    });
    expect(exporter).toBeInstanceOf(GrpcMetricExporter);
  });
});
