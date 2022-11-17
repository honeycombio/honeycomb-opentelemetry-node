"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureHoneycombGrpcTraceExporter = void 0;
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const exporter_utils_1 = require("./exporter-utils");
const honeycomb_options_1 = require("./honeycomb-options");
const grpc_js_1 = require("@grpc/grpc-js");
/**
 * Builds and returns an OTLP Traces exporter that sends telemetry over gRPC
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb over gRPC
 */
function configureHoneycombGrpcTraceExporter(options) {
    const opts = (0, honeycomb_options_1.computeOptions)(options);
    const metadata = new grpc_js_1.Metadata();
    metadata.set(exporter_utils_1.OTLP_HEADER_KEY, exporter_utils_1.OTLP_PROTO_VERSION);
    metadata.set(exporter_utils_1.TEAM_HEADER_KEY, opts.tracesApiKey || '');
    if ((0, honeycomb_options_1.isClassic)(opts === null || opts === void 0 ? void 0 : opts.tracesApiKey)) {
        metadata.set(exporter_utils_1.DATASET_HEADER_KEY, opts.dataset || '');
    }
    return new exporter_trace_otlp_grpc_1.OTLPTraceExporter({
        url: opts.tracesEndpoint,
        metadata,
    });
}
exports.configureHoneycombGrpcTraceExporter = configureHoneycombGrpcTraceExporter;
