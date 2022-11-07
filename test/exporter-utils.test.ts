import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPTraceExporter as HttpProtoOTLPExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { getHoneycombSpanExporter } from '../src/exporter-utils';

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
    expect(exporter instanceof GrpcOTLPTraceExporter);
  });
  it('http/protobuf return http/proto exporter', () => {
    const exporter = getHoneycombSpanExporter({
      protocol: 'http/protobuf',
    });
    expect(exporter instanceof HttpProtoOTLPExporter);
  });
  it('http/json return http/proto exporter', () => {
    const exporter = getHoneycombSpanExporter({
      protocol: 'http/json',
    });
    expect(exporter instanceof HttpProtoOTLPExporter);
  });
});
