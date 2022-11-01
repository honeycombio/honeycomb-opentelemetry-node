import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import {
  HoneycombOptions,
  isClassic,
  computeOptions,
} from './honeycomb-options';

export const TEAM_HEADER_KEY = 'x-honeycomb-team';
export const DATASET_HEADER_KEY = 'x-honeycomb-dataset';
export const OTLP_HEADER_KEY = 'x-otlp-version';
export const OTLP_PROTO_VERSION = '0.16.0';

export function honeycombTraceExporter(
  options?: HoneycombOptions,
): OTLPTraceExporter {
  const opts = computeOptions(options);
  const exporter = {
    url: opts.tracesEndpoint,
    headers: {
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: opts.tracesApiKey,
      [DATASET_HEADER_KEY]: isClassic(opts.apiKey) ? opts.dataset : undefined,
    },
  };

  return new OTLPTraceExporter(exporter);
}
