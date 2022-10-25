import { NodeSDK } from '@opentelemetry/sdk-node';
import { honeycombTraceExporter } from './http-trace-exporter';

export function Honeycomb(apiKey: string, serviceName: string): NodeSDK {
  return new NodeSDK({
    traceExporter: honeycombTraceExporter({ apiKey }),
    serviceName,
  });
}
