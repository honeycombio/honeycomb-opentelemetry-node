"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoneycombSpanExporter = exports.OTLP_PROTO_VERSION = exports.OTLP_HEADER_KEY = exports.DATASET_HEADER_KEY = exports.TEAM_HEADER_KEY = void 0;
const grpc_trace_exporter_1 = require("./grpc-trace-exporter");
const http_proto_trace_exporter_1 = require("./http-proto-trace-exporter");
exports.TEAM_HEADER_KEY = 'x-honeycomb-team';
exports.DATASET_HEADER_KEY = 'x-honeycomb-dataset';
exports.OTLP_HEADER_KEY = 'x-otlp-version';
exports.OTLP_PROTO_VERSION = '0.16.0';
/**
 * Configures and returns a {@link SpanExporter} based on the OTLP protocol
 * provided via options.
 *
 * Defaults to a http/protobuf exporter if not configured.
 *
 * @param options the {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb
 */
function getHoneycombSpanExporter(options) {
    if ((options === null || options === void 0 ? void 0 : options.protocol) == 'grpc') {
        return (0, grpc_trace_exporter_1.configureHoneycombGrpcTraceExporter)(options);
    }
    return (0, http_proto_trace_exporter_1.configureHoneycombHttpProtoTraceExporter)(options);
}
exports.getHoneycombSpanExporter = getHoneycombSpanExporter;
