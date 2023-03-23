import { HoneycombSDK } from '../src/opentelemetry-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { diag } from '@opentelemetry/api';

beforeEach(() => {
  // enable fake timers so timeouts work more relieably. This is required
  // to stop import errors from otlp-grpc-trace-base originating from onInit
  // https://jestjs.io/docs/timer-mocks#enable-fake-timers
  jest.useFakeTimers();
});

test('it should return a NodeSDK', () => {
  const honeycomb = new HoneycombSDK();

  expect(honeycomb).toBeInstanceOf(NodeSDK);
});

describe('debugging', () => {
  const diagSpy = jest.spyOn(diag, 'debug').mockImplementation(() => undefined);

  beforeEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
    delete process.env.HONEYCOMB_DATASET;
  });

  afterEach(() => {
    diagSpy.mockClear();
  });

  afterAll(() => {
    diagSpy.mockRestore();
  });

  test('debug set to true outputs options to the console', () => {
    new HoneycombSDK({ apiKey: 'FINDME', debug: true });
    expect(diag.debug).toHaveBeenCalledTimes(4); // diag.setLogger also tells you about itself
    expect(diagSpy.mock.calls[3][0]).toContain('FINDME');
  });
});
