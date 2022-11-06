import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
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

/**
 * Builds and returns an OTLP Traces exporter that sends data over http/protobuf
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb over http/protobuf
 */
export function configureHoneycombHttpProtoTraceExporter(
  options?: HoneycombOptions,
): OTLPTraceExporter {
  const opts = computeOptions(options);
  return new OTLPTraceExporter({
    url: opts.tracesEndpoint,
    headers: {
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: opts.tracesApiKey,
      [DATASET_HEADER_KEY]: isClassic(opts.apiKey) ? opts.dataset : undefined,
    },
  });
}
