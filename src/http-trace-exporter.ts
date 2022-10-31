import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import {
  HoneycombOptions,
  isClassic,
  computeOptions,
} from './honeycomb-options';

const TEAM_HEADER_KEY = 'x-honeycomb-team';
const DATASET_HEADER_KEY = 'x-honeycomb-team';
const OTLP_HEADER_KEY = 'x-otlp-version';
const OTLP_PROTO_VERSION = '0.16.0';

export function honeycombTraceExporter(
  options?: HoneycombOptions,
): OTLPTraceExporter {
  const opts = computeOptions(options);
  const exporter = {
    url: opts.tracesEndpoint,
    headers: {
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: opts.tracesApiKey,
    },
  };

  if (isClassic(opts.tracesApiKey)) {
    exporter.headers[DATASET_HEADER_KEY] = opts.dataset;
  }

  return new OTLPTraceExporter(exporter);
}
