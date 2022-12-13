import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from './exporter-utils';
import { computeOptions, HoneycombOptions } from './honeycomb-options';

export function configureHoneycombHttpProtoMetricExporter(
  options?: HoneycombOptions,
): OTLPMetricExporter {
  const opts = computeOptions(options);
  return new OTLPMetricExporter({
    url: opts?.metricsEndpoint,
    headers: {
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: opts?.metricsApiKey,
      [DATASET_HEADER_KEY]: opts?.metricsDataset,
    },
  });
}

/**
 * Builds and returns an OTLP Metric reader that configures a metric exporter to send data over http/protobuf periodically
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link PeriodicExportingMetricReader} configured to send telemetry to Honeycomb over http/protobuf
 */
export function configureHoneycombHttpProtoMetricReader(
  options?: HoneycombOptions,
): PeriodicExportingMetricReader {
  return new PeriodicExportingMetricReader({
    exporter: configureHoneycombHttpProtoMetricExporter(options),
  });
}
