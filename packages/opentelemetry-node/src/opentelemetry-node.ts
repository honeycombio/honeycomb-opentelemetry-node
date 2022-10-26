import { NodeSDK } from '@opentelemetry/sdk-node';
import { honeycombTraceExporter } from './http-trace-exporter';

export function Honeycomb(): NodeSDK {
  return new NodeSDK({
    traceExporter: honeycombTraceExporter({ apiKey: 'testkey' }),
  });
}
