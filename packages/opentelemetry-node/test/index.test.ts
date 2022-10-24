import { HoneycombHttp } from '../src/index';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = HoneycombHttp();
  expect(honeycomb instanceof NodeSDK);
});
