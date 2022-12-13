import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { configureHoneycombGrpcTraceExporter } from './grpc-trace-exporter';
import { HoneycombOptions } from './honeycomb-options';
import { configureHoneycombHttpProtoMetricExporter } from './http-proto-metrics-exporter';
import { configureHoneycombHttpProtoTraceExporter } from './http-proto-trace-exporter';

export const TEAM_HEADER_KEY = 'x-honeycomb-team';
export const DATASET_HEADER_KEY = 'x-honeycomb-dataset';
export const OTLP_HEADER_KEY = 'x-otlp-version';
export const OTLP_PROTO_VERSION = '0.16.0';

/**
 * Configures and returns a {@link SpanExporter} based on the OTLP protocol
 * provided via options.
 *
 * Defaults to a http/protobuf exporter if not configured.
 *
 * @param options the {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb
 */
export function getHoneycombSpanExporter(
  options?: HoneycombOptions,
): SpanExporter {
  if (options?.protocol == 'grpc') {
    return configureHoneycombGrpcTraceExporter(options);
  }
  return configureHoneycombHttpProtoTraceExporter(options);
}

/**
 * Builds and returns an OTLP Metric reader that configures a metric exporter to send data over http/protobuf periodically
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link PeriodicExportingMetricReader} configured to send telemetry to Honeycomb over http/protobuf
 */
export function getHoneycombMetricReader(options?: HoneycombOptions) {
  return new PeriodicExportingMetricReader({
    // when we add grpc exporter support, we can do the check here to deicde which exporter to pass in
    exporter: configureHoneycombHttpProtoMetricExporter(options),
  });
}
