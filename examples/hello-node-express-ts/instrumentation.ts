import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  HoneycombOptions,
  HoneycombSDK,
} from '@honeycombio/opentelemetry-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const config: HoneycombOptions = {
  apiKey: process.env.HONEYCOMB_API_KEY || '',
  serviceName: process.env.OTEL_SERVICE_NAME || 'hello-node-express-ts',
  debug: true,
  instrumentations: [getNodeAutoInstrumentations()],
  metricsDataset: process.env.METRICS_DATASET || 'hello-node-express-ts-metrics'
};

const sdk: NodeSDK = new HoneycombSDK(config);

sdk
  .start()
  .then(() => {
    console.log('Tracing initialized');
  })
  .catch((error) => console.log('Error initializing tracing', error));
