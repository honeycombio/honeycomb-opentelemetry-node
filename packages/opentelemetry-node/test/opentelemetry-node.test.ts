import { addHoneycomb } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = addHoneycomb();
  expect(honeycomb instanceof NodeSDK);
});
