import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { HoneycombOptions } from './honeycomb-options';
/**
 * Builds and returns an OTLP Traces exporter that sends data over http/protobuf
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb over http/protobuf
 */
export declare function configureHoneycombHttpProtoTraceExporter(options?: HoneycombOptions): OTLPTraceExporter;
