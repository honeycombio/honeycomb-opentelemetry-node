import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const traceExporter = new OTLPTraceExporter();

export function addHoneycomb(): NodeSDK {
  return new NodeSDK({
    traceExporter,
  });
}
