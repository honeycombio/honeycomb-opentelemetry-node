import { NodeSDK } from '@opentelemetry/sdk-node';
import { honeycombGrpcTraceExporter } from './grpc-trace-exporter';

export function HoneycombGrpc(): NodeSDK {
  return new NodeSDK({
    traceExporter: honeycombGrpcTraceExporter({
      apiKey: 'test-key',
    }),
  });
}
