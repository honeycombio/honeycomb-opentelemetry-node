import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import {
  DATASET_HEADER_KEY,
  OTLP_HEADER_KEY,
  OTLP_PROTO_VERSION,
  TEAM_HEADER_KEY,
} from './exporter-utils';
import {
  HoneycombOptions,
} from './honeycomb-options';

//TODOs:
// - add tests for http/proto
// - add grpc metric reader + tests
// - add test to check that metrics are not enabled unless a metrics dataset is provided
// - test otel env variables work for metrics timeout
// - smoke tests?

export function configureHoneycombHttpProtoMetricReader(options?: HoneycombOptions): PeriodicExportingMetricReader {
  return new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: options?.metricsEndpoint,
      headers: {
        [OTLP_HEADER_KEY]: OTLP_PROTO_VERSION,
        [TEAM_HEADER_KEY]: options?.metricsApiKey,
        [DATASET_HEADER_KEY]: options?.metricsDataset,
      }
    }),
  });
}
