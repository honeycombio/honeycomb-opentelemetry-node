import { HoneycombGrpc } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

test('it should return a NodeSDK', () => {
  const honeycomb = HoneycombGrpc();
  expect(honeycomb instanceof NodeSDK);
});
