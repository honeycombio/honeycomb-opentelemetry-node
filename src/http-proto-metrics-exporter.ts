import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from './exporter-utils';
import { computeOptions, HoneycombOptions } from './honeycomb-options';

/**
 * Builds and returns an OTLP Metric exporter that sends data over http/protobuf
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns an {@link OTLPMetricExporter} configured to send telemetry to Honeycomb over http/protobuf
 */
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
