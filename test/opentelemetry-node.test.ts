import { HoneycombSDK } from '../src/opentelemetry-node';
import { NodeSDK, NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { diag } from '@opentelemetry/api';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';

jest.mock('@opentelemetry/sdk-node', () => {
  return {
    NodeSDK: jest.fn().mockImplementation(),
  };
});

const mockedNodeSDK = <jest.Mock<NodeSDK>>NodeSDK;

beforeEach(() => {
  // enable fake timers so timeouts work more relieably. This is required
  // to stop import errors from otlp-grpc-trace-base originating from onInit
  // https://jestjs.io/docs/timer-mocks#enable-fake-timers
  jest.useFakeTimers();
  mockedNodeSDK.mockClear();
});

afterAll(() => {
  mockedNodeSDK.mockRestore();
});

test('it should return a NodeSDK', () => {
  const honeycomb = new HoneycombSDK();

  expect(honeycomb).toBeInstanceOf(NodeSDK);
});

describe('NodeSDK options', () => {
  test('it should setup the default sampler', () => {
    new HoneycombSDK();
    expect(mockedNodeSDK).toHaveBeenCalledTimes(1);
    const options = mockedNodeSDK.mock.calls[0][0] as NodeSDKConfiguration;
    expect(options.sampler.toString()).toBe(
      'DeterministicSampler(AlwaysOnSampler)',
    );
  });

  test('it should allow overriding the default sampler', () => {
    new HoneycombSDK({
      sampler: new AlwaysOnSampler(),
    });
    expect(mockedNodeSDK).toHaveBeenCalledTimes(1);
    const options = mockedNodeSDK.mock.calls[0][0] as NodeSDKConfiguration;
    expect(options.sampler.toString()).toBe('AlwaysOnSampler');
  });

  test('serviceName is set', () => {
    new HoneycombSDK({
      serviceName: 'some-name',
    });
    expect(mockedNodeSDK).toHaveBeenCalledTimes(1);
    const options = mockedNodeSDK.mock.calls[0][0] as NodeSDKConfiguration;
    expect(options.serviceName).toBe('some-name');
  });
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
    expect(diag.debug).toHaveBeenCalledTimes(2); // diag.setLogger also tells you about itself
    expect(diagSpy.mock.calls[1][0]).toContain('FINDME');
  });
});
