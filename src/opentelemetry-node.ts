import { NodeSDK } from '@opentelemetry/sdk-node';
import { HoneycombOptions, computeOptions } from './honeycomb-options';
import { configureHoneycombHttpProtoTraceExporter } from './http-proto-trace-exporter';
import { configureHoneycombResource } from './resource-builder';

/**
 * Builds and returns an instance of OpenTelemetry Node SDK.
 * @param options The HoneycombOptions used to configure the exporter
 * @returns the configured NodeSDK instance
 */
export function configureHoneycombSDK(options?: HoneycombOptions): NodeSDK {
  const opts = computeOptions(options);
  return new NodeSDK({
    serviceName: opts.serviceName,
    resource: configureHoneycombResource(),
    traceExporter: configureHoneycombHttpProtoTraceExporter(opts),
    // metricReader: honeycombMetricsReader(options),
    // spanProcessor: baggageSpanProcess(options),
    // sampler: honeycombSampler(),
  });
}
