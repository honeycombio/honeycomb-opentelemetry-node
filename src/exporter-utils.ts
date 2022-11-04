import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { configureHoneycombGrpcTraceExporter } from './grpc-trace-exporter';
import { HoneycombOptions } from './honeycomb-options';
import { configureHoneycombHttpProtoTraceExporter } from './http-proto-trace-exporter';

export const TEAM_HEADER_KEY = 'x-honeycomb-team';
export const DATASET_HEADER_KEY = 'x-honeycomb-dataset';
export const OTLP_HEADER_KEY = 'x-otlp-version';
export const OTLP_PROTO_VERSION = '0.16.0';

/**
 *
 * @param options
 * @returns
 */
export function getSpanExporter(options?: HoneycombOptions): SpanExporter {
  if (options?.protocol == 'grpc') {
    return configureHoneycombGrpcTraceExporter(options);
  }
  return configureHoneycombHttpProtoTraceExporter(options);
}
