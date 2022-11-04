import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPTraceExporter as HttpProtoOTLPExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { getSpanExporter } from '../src/exporter-utils';

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
    expect(exporter instanceof HttpProtoOTLPExporter);
  });
  it('http/json return http/proto exporter', () => {
    const exporter = getSpanExporter({
      protocol: 'http/json',
    });
    expect(exporter instanceof HttpProtoOTLPExporter);
  });
});
