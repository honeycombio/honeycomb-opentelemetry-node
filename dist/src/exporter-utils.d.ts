import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { HoneycombOptions } from './honeycomb-options';
export declare const TEAM_HEADER_KEY = "x-honeycomb-team";
export declare const DATASET_HEADER_KEY = "x-honeycomb-dataset";
export declare const OTLP_HEADER_KEY = "x-otlp-version";
export declare const OTLP_PROTO_VERSION = "0.16.0";
/**
 * Configures and returns a {@link SpanExporter} based on the OTLP protocol
 * provided via options.
 *
 * Defaults to a http/protobuf exporter if not configured.
 *
 * @param options the {@link HoneycombOptions} used to configure the exporter
 * @returns a {@link SpanExporter} configured to send telemetry to Honeycomb
 */
export declare function getHoneycombSpanExporter(options?: HoneycombOptions): SpanExporter;
