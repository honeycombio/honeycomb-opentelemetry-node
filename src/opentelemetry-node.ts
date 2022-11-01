import { NodeSDK } from '@opentelemetry/sdk-node';
import { DeterministicSampler } from './deterministic-sampler';
import {
  HoneycombOptions,
  computeOptions,
  DEFAULT_SAMPLE_RATE,
} from './honeycomb-options';
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
    sampler: new DeterministicSampler(opts.sampleRate || DEFAULT_SAMPLE_RATE),
  });
}
