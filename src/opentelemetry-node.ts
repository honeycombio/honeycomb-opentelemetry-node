import { NodeSDK } from '@opentelemetry/sdk-node';
import { configureDeterministicSampler } from './deterministic-sampler';
import { configureBatchWithBaggageSpanProcessor } from './baggage-span-processor';
import { computeOptions, HoneycombOptions } from './honeycomb-options';
import { configureHoneycombResource } from './resource-builder';
import { getHoneycombMetricReader } from './exporter-utils';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

/**
 * @class
 * @classdesc Extends the OpenTelemetry NodeSDK class with Honeycomb specific configuration.
 * @param options The HoneycombOptions used to configure the exporter.
 * HoneycombOptions extends OpenTelemetry NodeSDKConfiguration.
 */
export class HoneycombSDK extends NodeSDK {
  constructor(options?: HoneycombOptions) {
    const opts = computeOptions(options);
    super({
      ...opts,
      serviceName: opts?.serviceName,
      resource: configureHoneycombResource(opts),
      metricReader: getHoneycombMetricReader(opts),
      spanProcessor: configureBatchWithBaggageSpanProcessor(opts),
      sampler: configureDeterministicSampler(opts?.sampleRate),
    });

    if (opts.debug) {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
      diag.debug(JSON.stringify(opts, null, 2));
    }
  }
}
