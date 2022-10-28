import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { addDatasetHeader, getTracesEndpoint, HoneycombOptions } from './honeycomb-options';
import { getTracesApikey } from './honeycomb-options';

const TEAM_HEADER_KEY = 'x-honeycomb-team';
const DATASET_HEADER_KEY = 'x-honeycomb-team';
const OTLP_HEADER_KEY = 'x-otlp-version';
const OTLP_PROTO_VERSION = '0.16.0';

export function honeycombTraceExporter(options: HoneycombOptions): OTLPTraceExporter {
  const HoneycombTraceExporterObject = {
    url: getTracesEndpoint(options),
    headers: {
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: getTracesApikey(options),
    },
  };
  if (addDatasetHeader(options)) {
    HoneycombTraceExporterObject.headers[DATASET_HEADER_KEY] = options.dataset;
  }

  return new OTLPTraceExporter(HoneycombTraceExporterObject);
}
