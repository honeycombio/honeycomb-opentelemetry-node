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
  let headers: Partial<Record<string, unknown>> = {
    [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
    [TEAM_HEADER_KEY]: opts.tracesApiKey || '',
  };
  if (isClassic(opts?.tracesApiKey)) {
    headers[DATASET_HEADER_KEY] = opts.dataset || '';
  }
  return new OTLPTraceExporter({
    url: opts.tracesEndpoint,
    headers: headers,
  });
}
