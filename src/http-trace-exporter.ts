import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { HoneycombOptions } from './honeycomb-options';
import { isLegacy } from './honeycomb-options';

const HONEYCOMB_API_ENDPOINT = 'https://api.honeycomb.io/v1/traces';
const TEAM_HEADER_KEY = 'x-honeycomb-team';
const DATASET_HEADER_KEY = 'x-honeycomb-team';
const OTLP_HEADER_KEY = 'x-otlp-version';
const OTLP_PROTO_VERSION = '0.16.0';

export function honeycombTraceExporter({
  apiKey,
  dataset
}: HoneycombOptions): OTLPTraceExporter {
  const HoneycombTraceExporterObject = {
    url: HONEYCOMB_API_ENDPOINT,
    headers: {
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: apiKey,
    },
  };
  if (isLegacy({ apiKey }) && dataset) {
    HoneycombTraceExporterObject.headers[DATASET_HEADER_KEY] = dataset;
  }

  return new OTLPTraceExporter(HoneycombTraceExporterObject);
}
