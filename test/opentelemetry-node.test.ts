import { configureHoneycombSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPTraceExporter as HttpProtoExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { getSpanExporter } from '../src/exporter-utils';

test('it should return a NodeSDK', () => {
  const honeycomb = configureHoneycombSDK();
  expect(honeycomb instanceof NodeSDK);
});

describe('getSpanExporter', () => {
  it('gprc returns grpc exporter', () => {
    const exporter = getSpanExporter({
      protocol: 'grpc',
    });
    expect(exporter instanceof GrpcOTLPTraceExporter);
  });
  it('http/protobuf return http/proto exporter', () => {
    const exporter = getSpanExporter({
      protocol: 'http/protobuf',
    });
    expect(exporter instanceof HttpProtoExporter);
  });
  it('http/json return http/proto exporter', () => {
    const exporter = getSpanExporter({
      protocol: 'http/json',
    });
    expect(exporter instanceof HttpProtoExporter);
  });
});
