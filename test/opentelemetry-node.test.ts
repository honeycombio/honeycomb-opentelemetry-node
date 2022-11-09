import { configureHoneycombSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { diag } from '@opentelemetry/api';

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

describe('debugging', () => {
  const diagSpy = jest.spyOn(diag, 'debug').mockImplementation(() => undefined);

  afterEach(() => {
    diagSpy.mockClear();
  });

  afterAll(() => {
    diagSpy.mockRestore();
  });

  test('debug set to true outputs options to the console', () => {
    configureHoneycombSDK({ apiKey: 'FINDME', debug: true });
    expect(diag.debug).toHaveBeenCalledTimes(2); // diag.setLogger also tells you about itself
    //[["@opentelemetry/api: Registered a global for diag v1.2.0."], ["{\"protocol\":\"grpc\".....]]
    expect(diagSpy.mock.calls[1][0]).toContain('FINDME');
  });
});
