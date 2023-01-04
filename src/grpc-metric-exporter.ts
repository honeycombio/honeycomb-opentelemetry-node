import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from './exporter-utils';
import {
  computeOptions,
  HoneycombOptions,
  isClassic }
from './honeycomb-options';
import { Metadata } from '@grpc/grpc-js';

/**
 * Builds and returns an OTLP Metric exporter that sends data over grpc
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns an {@link OTLPMetricExporter} configured to send telemetry to Honeycomb over grpc
 */
export function configureHoneycombGrpcMetricExporter(
  options?: HoneycombOptions,
): OTLPMetricExporter {
  const opts = computeOptions(options);
  const metadata = new Metadata();

  metadata.set(OTLP_HEADER_KEY, OTLP_PROTO_VERSION);
  metadata.set(TEAM_HEADER_KEY, opts.metricsApiKey || '');
  metadata.set(DATASET_HEADER_KEY, opts.metricsDataset || '');

  return new OTLPMetricExporter({
    url: opts?.metricsEndpoint,
    metadata: metadata,
  });
}
