import { HoneycombGrpc } from '../src/index';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = HoneycombGrpc();
  expect(honeycomb instanceof NodeSDK);
});
