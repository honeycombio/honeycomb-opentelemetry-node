import { SpanExporter } from '@opentelemetry/sdk-trace-base';
/**
 * Builds and returns a new {@link SpanExporter} that wraps the provided array
 * of {@link SpanExporter}s
 *
 * @remark This is not for production use.
 * @param exporters the exporters to wrap with the composite exporter
 * @returns the configured {@link SpanExporter} instance
 */
export declare function configureCompositeExporter(exporters: SpanExporter[]): SpanExporter;
