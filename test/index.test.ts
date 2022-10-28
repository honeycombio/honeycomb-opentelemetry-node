import { HoneycombNodeSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = HoneycombNodeSDK();
  expect(honeycomb instanceof NodeSDK);
});
