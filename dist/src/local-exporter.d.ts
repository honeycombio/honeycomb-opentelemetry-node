import { SpanExporter } from '@opentelemetry/sdk-trace-base';
import { HoneycombOptions } from './honeycomb-options';
/**
 * Builds and returns a {@link SpanExporter} that logs Honeycomb URLs for completed traces
 *
 * @remark This is not for production use.
 * @param options The {@link HoneycombOptions} used to configure the exporter
 * @returns the configured {@link ConsoleTraceLinkExporter} instance
 */
export declare function configureConsoleTraceLinkExporter(options: HoneycombOptions): SpanExporter;
/**
 * Builds and returns a URL that is used to log when a trace is completed in the {@link ConsoleTraceLinkExporter}.
 *
 * @param apikey the Honeycom API key used to retrieve the Honeycomb team and environment
 * @param serviceName the Honeycomb service name (or classic dataset) where data is stored
 * @param team the Honeycomb team
 * @param environment the Honeycomb environment
 * @returns
 */
export declare function buildTraceUrl(apikey: string, serviceName: string, team: string, environment?: string): string;
