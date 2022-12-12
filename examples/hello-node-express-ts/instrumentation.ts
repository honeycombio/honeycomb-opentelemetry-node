import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  HoneycombOptions,
  HoneycombSDK,
} from '@honeycombio/opentelemetry-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: 'https://api.honeycomb.io/v1/metrics',
    headers: {
      'x-honeycomb-team': process.env.HONEYCOMB_API_KEY,
      'x-honeycomb-dataset': process.env.HONEYCOMB_METRICS_DATASET
    }
  }),

  // Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
  exportIntervalMillis: 3000,
});

const config: HoneycombOptions = {
  apiKey: process.env.HONEYCOMB_API_KEY || '',
  serviceName: process.env.OTEL_SERVICE_NAME || 'hello-node-express-ts',
  debug: true,
  instrumentations: [getNodeAutoInstrumentations()],
  metricReader
};

const sdk: NodeSDK = new HoneycombSDK(config);

sdk
  .start()
  .then(() => {
    console.log('Tracing initialized');
  })
  .catch((error) => console.log('Error initializing tracing', error));
