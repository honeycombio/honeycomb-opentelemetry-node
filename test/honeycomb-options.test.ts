import {
  computeOptions,
  HoneycombOptions,
  isClassic,
} from '../src/honeycomb-options';

test('it should have an apiKey property on the HoneycombOptions object', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function hasApiKey(object: any): object is HoneycombOptions {
    return 'apiKey' in object;
  }
  const testApiKey = hasApiKey({ apiKey: 'testkey' });
  expect(testApiKey).toEqual(true);
});

describe('isClassic', () => {
  it('should return true for a clasic key', () => {
    // classic keys are 32 chars long
    const apikey = '00000000000000000000000000000000';
    expect(isClassic(apikey)).toBe(true);
  });

  it('should return false for a non-classic key', () => {
    // non-classic keys are 22 chars log
    const apikey = '0000000000000000000000';
    expect(isClassic(apikey)).toBe(false);
  });

  it('should return false for an undefined key', () => {
    expect(isClassic(undefined)).toBe(false);
  });
});

describe('apikey', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
  });

  it('has no default', () => {
    const options = computeOptions();
    expect(options.apiKey).toBeUndefined();
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      apiKey: 'my-apikey',
    });
    expect(options.apiKey).toBe('my-apikey');
  });

  it('uses endpoint from env var', () => {
    process.env.HONEYCOMB_API_KEY = 'my-apikey';
    const options = computeOptions();
    expect(options.apiKey).toBe('my-apikey');
  });

  it('prefers endpoint from env var over provided options', () => {
    process.env.HONEYCOMB_API_KEY = 'my-apikey';
    const options = computeOptions({
      endpoint: 'another-apikey',
    });
    expect(options.apiKey).toBe('my-apikey');
  });
});

describe('traces apikey', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
    delete process.env.HONEYCOMB_TRACES_APIKEY;
  });

  it('has no default', () => {
    const options = computeOptions();
    expect(options.tracesApiKey).toBeUndefined();
  });

  it('defaults to apikey set via options', () => {
    const options = computeOptions({
      apiKey: 'my-apikey',
    });
    expect(options.tracesApiKey).toBe('my-apikey');
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      tracesApiKey: 'my-apikey',
    });
    expect(options.tracesApiKey).toBe('my-apikey');
  });

  it('defaults to apikey set via env var', () => {
    process.env.HONEYCOMB_API_KEY = 'my-apikey';
    const options = computeOptions();
    expect(options.tracesApiKey).toBe('my-apikey');
  });

  it('uses apikey from env var', () => {
    process.env.HONEYCOMB_TRACES_APIKEY = 'my-apikey';
    const options = computeOptions();
    expect(options.tracesApiKey).toBe('my-apikey');
  });

  it('prefers apikey from env var over provided options', () => {
    process.env.HONEYCOMB_TRACES_APIKEY = 'my-apikey';
    const options = computeOptions({
      tracesApiKey: 'another-apikey',
    });
    expect(options.tracesApiKey).toBe('my-apikey');
  });
});

describe('metrics apikey', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
    delete process.env.HONEYCOMB_METRICS_APIKEY;
  });

  it('has no default', () => {
    const options = computeOptions();
    expect(options.metricsApiKey).toBeUndefined();
  });

  it('defaults to apikey set via options', () => {
    const options = computeOptions({
      apiKey: 'my-apikey',
    });
    expect(options.metricsApiKey).toBe('my-apikey');
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      metricsApiKey: 'my-apikey',
    });
    expect(options.metricsApiKey).toBe('my-apikey');
  });

  it('defaults to apikey set via env var', () => {
    process.env.HONEYCOMB_API_KEY = 'my-apikey';
    const options = computeOptions();
    expect(options.metricsApiKey).toBe('my-apikey');
  });

  it('uses apikey from env var', () => {
    process.env.HONEYCOMB_METRICS_APIKEY = 'my-apikey';
    const options = computeOptions();
    expect(options.metricsApiKey).toBe('my-apikey');
  });

  it('prefers apikey from env var over provided options', () => {
    process.env.HONEYCOMB_METRICS_APIKEY = 'my-apikey';
    const options = computeOptions({
      metricsApiKey: 'another-apikey',
    });
    expect(options.metricsApiKey).toBe('my-apikey');
  });
});

describe('endpoint', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
  });

  // TODO: default endpoint should be to http://api.honeycomb.io (without path)
  it('defaults to https://api.honeycomb.io', () => {
    const options = computeOptions();
    expect(options.endpoint).toBe('https://api.honeycomb.io/v1/traces');
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      endpoint: 'my-custom-endpoint',
    });
    expect(options.endpoint).toBe('my-custom-endpoint');
  });

  it('uses endpoint from env var', () => {
    process.env.HONEYCOMB_API_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions();
    expect(options.endpoint).toBe('my-custom-endpoint');
  });

  it('prefers endpoint from env var over provided options', () => {
    process.env.HONEYCOMB_API_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions({
      endpoint: 'another-endpoint',
    });
    expect(options.endpoint).toBe('my-custom-endpoint');
  });
});

describe('traces endpoint', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_TRACES_ENDPOINT;
  });

  it('defaults to endpoint', () => {
    const options = computeOptions({
      endpoint: 'my-custom-endpoint',
    });
    expect(options.tracesEndpoint).toBe('my-custom-endpoint');
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      tracesEndpoint: 'my-custom-endpoint',
    });
    expect(options.tracesEndpoint).toBe('my-custom-endpoint');
  });

  it('uses endpoint from env var', () => {
    process.env.HONEYCOMB_TRACES_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions();
    expect(options.tracesEndpoint).toBe('my-custom-endpoint');
  });

  it('prefers endpoint from env var over provided options', () => {
    process.env.HONEYCOMB_TRACES_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions({
      tracesEndpoint: 'another-endpoint',
    });
    expect(options.tracesEndpoint).toBe('my-custom-endpoint');
  });
});

describe('metrics endpoint', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_METRICS_ENDPOINT;
  });

  it('defaults to endpoint', () => {
    const options = computeOptions({
      endpoint: 'my-custom-endpoint',
    });
    expect(options.metricsEndpoint).toBe('my-custom-endpoint');
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      metricsEndpoint: 'my-custom-endpoint',
    });
    expect(options.metricsEndpoint).toBe('my-custom-endpoint');
  });

  it('uses endpoint from env var', () => {
    process.env.HONEYCOMB_METRICS_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions();
    expect(options.metricsEndpoint).toBe('my-custom-endpoint');
  });

  it('prefers endpoint from env var over provided options', () => {
    process.env.HONEYCOMB_METRICS_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions({
      metricsEndpoint: 'another-endpoint',
    });
    expect(options.metricsEndpoint).toBe('my-custom-endpoint');
  });
});

describe('debug option', () => {
  afterEach(() => {
    delete process.env.DEBUG;
  });

  it('defaults to false', () => {
    const options = computeOptions();
    expect(options.debug).toBe(false);
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      debug: true,
    });
    expect(options.debug).toBe(true);
  });

  it('returns true if env var is set', () => {
    process.env.DEBUG = 'true';
    const options = computeOptions();
    expect(options.debug).toBe(true);
  });

  it('returns false if env var is set', () => {
    process.env.DEBUG = 'false';
    const options = computeOptions();
    expect(options.debug).toBe(false);
  });

  it('prefers debug value from env var over provided options', () => {
    process.env.DEBUG = 'true';
    const options = computeOptions({
      debug: false,
    });
    expect(options.debug).toBe(true);
  });
});

describe('sample rate option', () => {
  afterEach(() => {
    delete process.env.SAMPLE_RATE;
  });

  it('uses default if not set', () => {
    const options = computeOptions();
    expect(options.sampleRate).toBe(1);
  });

  it('uses provided option value if set', () => {
    const options = computeOptions({
      sampleRate: 10,
    });
    expect(options.sampleRate).toBe(10);
  });

  it('uses sample rate from env var', () => {
    process.env.SAMPLE_RATE = '10';
    const options = computeOptions();
    expect(options.sampleRate).toBe(10);
  });

  it('prefers sampler rate from env var over provided options', () => {
    process.env.SAMPLE_RATE = '10';
    const options = computeOptions({
      sampleRate: 50,
    });
    expect(options.sampleRate).toBe(10);
  });

  it('ingnores negative numbers', () => {
    const options = computeOptions({
      sampleRate: -100,
    });
    expect(options.sampleRate).toBe(1);
  });

  it('ingnores zero', () => {
    const options = computeOptions({
      sampleRate: 0,
    });
    expect(options.sampleRate).toBe(1);
  });

  it('ingnores negative number set via env var', () => {
    process.env.SAMPLE_RATE = '-100';
    const options = computeOptions();
    expect(options.sampleRate).toBe(1);
  });

  it('ingnores zero ser via env var', () => {
    process.env.SAMPLE_RATE = '0';
    const options = computeOptions();
    expect(options.sampleRate).toBe(1);
  });

  it('ingnores invalid value set via env ar', () => {
    process.env.SAMPLE_RATE = 'invalid';
    const options = computeOptions();
    expect(options.sampleRate).toBe(1);
  });
});

describe('local visualizations option', () => {
  afterEach(() => {
    delete process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS;
  });

  it('defaults to false', () => {
    const options = computeOptions();
    expect(options.localVisualizations).toBe(false);
  });

  it('uses provided option if set', () => {
    const options = computeOptions({
      localVisualizations: true,
    });
    expect(options.localVisualizations).toBe(true);
  });

  it('returns true if env var is set', () => {
    process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS = 'true';
    const options = computeOptions();
    expect(options.localVisualizations).toBe(true);
  });

  it('returns false if env var is set', () => {
    process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS = 'false';
    const options = computeOptions();
    expect(options.localVisualizations).toBe(false);
  });

  it('prefers value from env var over provided options', () => {
    process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS = 'true';
    const options = computeOptions({
      localVisualizations: false,
    });
    expect(options.localVisualizations).toBe(true);
  });
});
