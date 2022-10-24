import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HoneycombOptions } from './honeycomb-options';

const grpc = require('@grpc/grpc-js');
const creds = grpc.credentials.createSsl();

const HONEYCOMB_API_ENDPOINT = 'grpc://api.honeycomb.io:443';
const TEAM_HEADER_KEY = 'x-honeycomb-team';
const OTLP_HEADER_KEY = 'x-otlp-version';
const OTLP_PROTO_VERSION = '0.16.0';

const metadata = new grpc.Metadata();
// For instance, an API key or access token might go here.

metadata.set('k', 'v');

export function honeycombGrpcTraceExporter({
  apiKey,
  headers,
}: HoneycombOptions): OTLPTraceExporter {
  const HoneycombTraceExporterObject = {
    url: HONEYCOMB_API_ENDPOINT,
    credentials: creds,
    headers: {
      ...headers,
      [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
      [TEAM_HEADER_KEY]: apiKey,
    },
  };
  console.log(HoneycombTraceExporterObject);

  return new OTLPTraceExporter(HoneycombTraceExporterObject);
}
