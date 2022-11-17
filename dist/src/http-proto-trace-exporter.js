"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureHoneycombHttpProtoTraceExporter = void 0;
const exporter_trace_otlp_proto_1 = require("@opentelemetry/exporter-trace-otlp-proto");
const exporter_utils_1 = require("./exporter-utils");
const honeycomb_options_1 = require("./honeycomb-options");
/**
 * Builds and returns an OTLP Traces exporter that sends data over http/protobuf
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb over http/protobuf
 */
function configureHoneycombHttpProtoTraceExporter(options) {
    const opts = (0, honeycomb_options_1.computeOptions)(options);
    return new exporter_trace_otlp_proto_1.OTLPTraceExporter({
        url: opts.tracesEndpoint,
        headers: {
            [exporter_utils_1.OTLP_HEADER_KEY]: exporter_utils_1.OTLP_PROTO_VERSION,
            [exporter_utils_1.TEAM_HEADER_KEY]: opts.tracesApiKey,
            [exporter_utils_1.DATASET_HEADER_KEY]: (0, honeycomb_options_1.isClassic)(opts.apiKey) ? opts.dataset : undefined,
        },
    });
}
exports.configureHoneycombHttpProtoTraceExporter = configureHoneycombHttpProtoTraceExporter;
