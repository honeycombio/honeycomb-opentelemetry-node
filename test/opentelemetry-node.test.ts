import { configureHoneycombSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

beforeEach(() => {
  // enable fake timers so timeouts work more relieably. This is required
  // to stop import errors from otlp-grpc-trace-base originating from onInit
  // https://jestjs.io/docs/timer-mocks#enable-fake-timers
  jest.useFakeTimers();
});

test('it should return a NodeSDK', () => {
  const honeycomb = configureHoneycombSDK();
  expect(honeycomb instanceof NodeSDK);
});

test.todo('when debug is set to true, use diag log level of debug');
