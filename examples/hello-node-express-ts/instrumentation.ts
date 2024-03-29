import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  HoneycombOptions,
  HoneycombSDK,
} from '@honeycombio/opentelemetry-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';

const config: HoneycombOptions = {
  apiKey: process.env.HONEYCOMB_API_KEY || '',
  serviceName: process.env.OTEL_SERVICE_NAME || 'hello-node-express-ts',
  debug: true,
  instrumentations: [
    getNodeAutoInstrumentations({
      // disabling fs autoinstrumentation since it can be noisy
      // and expensive during startup
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
  metricsDataset:
    process.env.HONEYCOMB_METRICS_DATASET || 'hello-node-express-ts-metrics',
  // add app level attributes to appear on every span
  resource: new Resource({
    'global.build_id': process.env.APP_BUILD_ID,
  }),
};

const sdk: NodeSDK = new HoneycombSDK(config);

sdk.start();
