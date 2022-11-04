import { configureHoneycombSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = configureHoneycombSDK();
  expect(honeycomb instanceof NodeSDK);
});
