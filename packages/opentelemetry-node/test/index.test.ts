import { addHoneycomb } from '../src/index';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = addHoneycomb();
  expect(honeycomb instanceof NodeSDK);
});
