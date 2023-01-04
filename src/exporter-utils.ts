import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { configureHoneycombGrpcMetricExporter } from './grpc-metric-exporter';
import { configureHoneycombGrpcTraceExporter } from './grpc-trace-exporter';
import {
  getMetricsInterval,
  getMetricsTimeout,
  HoneycombOptions,
  OtlpProtocolKind,
} from './honeycomb-options';
import { configureHoneycombHttpProtoMetricExporter } from './http-proto-metric-exporter';
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
  if (options?.protocol == OtlpProtocolKind.Grpc) {
    return configureHoneycombGrpcTraceExporter(options);
  }
  return configureHoneycombHttpProtoTraceExporter(options);
}

/**
 * Builds and returns an OTLP Metric reader that configures a metric exporter to send data over http/protobuf periodically
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link PeriodicExportingMetricReader} configured to send telemetry to Honeycomb over http/protobuf
 */
export function getHoneycombMetricReader(
  options?: HoneycombOptions,
): PeriodicExportingMetricReader | undefined {
  if (!options?.metricsDataset) {
    // only enable metrics if a metrics dataset has been set
    return undefined;
  }

  const exporter =
    options?.protocol === OtlpProtocolKind.Grpc ?
      configureHoneycombGrpcMetricExporter(options) :
      configureHoneycombHttpProtoMetricExporter(options);

  return new PeriodicExportingMetricReader({
    exporter: exporter,
    exportIntervalMillis: getMetricsInterval(),
    exportTimeoutMillis: getMetricsTimeout(),
  });
}
