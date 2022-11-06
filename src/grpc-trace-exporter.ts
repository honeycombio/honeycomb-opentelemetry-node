import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from './exporter-utils';
import {
  computeOptions,
  HoneycombOptions,
  isClassic,
} from './honeycomb-options';
import { Metadata } from '@grpc/grpc-js';

/**
 * Builds and returns an OTLP Traces exporter that sends telemetry over gRPC
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb over gRPC
 */
export function configureHoneycombGrpcTraceExporter(
  options?: HoneycombOptions,
): OTLPTraceExporter {
  const opts = computeOptions(options);
  const metadata = new Metadata();
  metadata.set(OTLP_HEADER_KEY, OTLP_PROTO_VERSION);
  metadata.set(TEAM_HEADER_KEY, opts.tracesApiKey || '');
  if (isClassic(opts?.tracesApiKey)) {
    metadata.set(DATASET_HEADER_KEY, opts.dataset || '');
  }
  return new OTLPTraceExporter({
    url: opts.tracesEndpoint,
    metadata,
  });
}
