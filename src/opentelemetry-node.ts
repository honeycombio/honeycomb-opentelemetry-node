import { NodeSDK } from '@opentelemetry/sdk-node';
import { configureDeterministicSampler } from './deterministic-sampler';
import { HoneycombOptions, computeOptions } from './honeycomb-options';
import { honeycombHttpProtoTraceExporter } from './http-proto-trace-exporter';
import { honeycombResource } from './resource-builder';

export function Honeycomb(options?: HoneycombOptions): NodeSDK {
  const opts = computeOptions(options);
  return new NodeSDK({
    serviceName: opts.serviceName,
    resource: honeycombResource(),
    traceExporter: honeycombHttpProtoTraceExporter(opts),
    // metricReader: honeycombMetricsReader(options),
    // spanProcessor: baggageSpanProcess(options),
    sampler: configureDeterministicSampler(opts.sampleRate),
  });
}
