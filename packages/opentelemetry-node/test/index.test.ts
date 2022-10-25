import { Honeycomb } from '../src/index';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = Honeycomb('testkey', 'testservice');
  expect(honeycomb instanceof NodeSDK);
});
