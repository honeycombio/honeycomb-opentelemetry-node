import { buildNodeSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = buildNodeSDK();
  expect(honeycomb instanceof NodeSDK);
});
