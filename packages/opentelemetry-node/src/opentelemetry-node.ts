import { NodeSDK } from '@opentelemetry/sdk-node';

// TODO: add OTLPTraceExporter
// @opentelemetry/exporter-trace-otlp-proto

export function addHoneycomb(): NodeSDK {
  return new NodeSDK();
}
