import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HoneycombOptions } from './honeycomb-options';
/**
 * Builds and returns an OTLP Traces exporter that sends telemetry over gRPC
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb over gRPC
 */
export declare function configureHoneycombGrpcTraceExporter(options?: HoneycombOptions): OTLPTraceExporter;
