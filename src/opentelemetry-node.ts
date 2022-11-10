import { NodeSDK } from '@opentelemetry/sdk-node';
import { configureDeterministicSampler } from './deterministic-sampler';
import { configureBatchWithBaggageSpanProcessor } from './baggage-span-processor';
import { computeOptions, HoneycombOptions } from './honeycomb-options';
import { configureHoneycombResource } from './resource-builder';
import { configureInstrumentations } from './instrumentations';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
/**
 * Builds and returns an instance of OpenTelemetry Node SDK.
 * @param options The HoneycombOptions used to configure the exporter
 * @returns the configured NodeSDK instance
 */
export function configureHoneycombSDK(options?: HoneycombOptions): NodeSDK {
  const opts = computeOptions(options);

  if (opts.debug) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
    diag.debug(JSON.stringify(opts, null, 2));
  }

  return new NodeSDK({
    serviceName: opts.serviceName,
    resource: configureHoneycombResource(),
    // metricReader: honeycombMetricsReader(options),
    spanProcessor: configureBatchWithBaggageSpanProcessor(opts),
    sampler: configureDeterministicSampler(opts.sampleRate),
    instrumentations: configureInstrumentations(opts),
  });
}
