import { NodeSDK } from '@opentelemetry/sdk-node';
import { honeycombHttpTraceExporter } from './http-trace-exporter';

export function HoneycombHttp(): NodeSDK {
  return new NodeSDK({
    traceExporter: honeycombHttpTraceExporter({
      apiKey: 'test-key',
    }),
  });
}
