import { NodeSDK } from '@opentelemetry/sdk-node';
import { configureDeterministicSampler } from './deterministic-sampler';
import { configureBatchWithBaggageSpanProcessor } from './baggage-span-processor';
import { HoneycombOptions, computeOptions } from './honeycomb-options';
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
    // metricReader: honeycombMetricsReader(options),
    spanProcessor: configureBatchWithBaggageSpanProcessor(opts),
    sampler: configureDeterministicSampler(opts.sampleRate),
  });
}
