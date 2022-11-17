"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.honeycombTraceExporter = void 0;
const exporter_trace_otlp_proto_1 = require("@opentelemetry/exporter-trace-otlp-proto");
const HONEYCOMB_API_ENDPOINT = 'https://api.honeycomb.io/v1/traces';
const TEAM_HEADER_KEY = 'x-honeycomb-team';
const OTLP_HEADER_KEY = 'x-otlp-version';
const OTLP_PROTO_VERSION = '0.16.0';
function honeycombTraceExporter({ apiKey, headers, }) {
    const HoneycombTraceExporterObject = {
        url: HONEYCOMB_API_ENDPOINT,
        headers: Object.assign(Object.assign({}, headers), { [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION, [TEAM_HEADER_KEY]: apiKey }),
    };
    return new exporter_trace_otlp_proto_1.OTLPTraceExporter(HoneycombTraceExporterObject);
}
exports.honeycombTraceExporter = honeycombTraceExporter;
