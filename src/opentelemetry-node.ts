import { NodeSDK, NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { configureDeterministicSampler } from './deterministic-sampler';
import { configureBatchWithBaggageSpanProcessor } from './baggage-span-processor';
import { computeOptions, HoneycombOptions } from './honeycomb-options';
import { configureHoneycombResource } from './resource-builder';
import { ContextManager, diag, DiagConsoleLogger, DiagLogLevel, TextMapPropagator } from '@opentelemetry/api';
import { TracerConfig, SpanProcessor } from '@opentelemetry/sdk-trace-base';
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
  });
}


export class HoneycombSDK extends NodeSDK {
  constructor(options?: HoneycombOptions) {
    const opts = computeOptions(options);
    super({
      ...opts,
      serviceName: opts?.serviceName,
      resource: configureHoneycombResource(),
      // metricReader: honeycombMetricsReader(options),
      spanProcessor: configureBatchWithBaggageSpanProcessor(opts),
      sampler: configureDeterministicSampler(opts?.sampleRate),
    })

    if (opts.debug) {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
      diag.debug(JSON.stringify(opts, null, 2));
    }
  }
}
