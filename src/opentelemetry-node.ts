import { NodeSDK } from '@opentelemetry/sdk-node';
import { applyEnvVars, HoneycombOptions } from './honeycomb-options';
import { honeycombTraceExporter } from './http-trace-exporter';
import { honeycombResource } from './resource-builder';

export function HoneycombNodeSDK(options?: HoneycombOptions): NodeSDK {
  if (!options) {
    options = {};
  }

  applyEnvVars(options);

  return new NodeSDK({
    serviceName: options.serviceName,
    resource: honeycombResource(options),
    traceExporter: honeycombTraceExporter(options),
    // metricReader: honeycombMetricsReader(options),
    // spanProcessor: baggageSpanProcess(options),
    // sampler: honeycombSampler(),
  });
}
