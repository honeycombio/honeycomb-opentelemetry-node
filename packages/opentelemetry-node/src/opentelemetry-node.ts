import { NodeSDK } from '@opentelemetry/sdk-node';
import { honeycombTraceExporter } from './grpc-trace-exporter';

export function Honeycomb(): NodeSDK {
  return new NodeSDK({
    traceExporter: honeycombTraceExporter({ apiKey: 'testkey' }),
  });
}
