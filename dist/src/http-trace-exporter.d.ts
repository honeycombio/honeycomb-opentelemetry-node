import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { HoneycombOptions } from './honeycomb-options';
export declare function honeycombTraceExporter({ apiKey, headers, }: HoneycombOptions): OTLPTraceExporter;
