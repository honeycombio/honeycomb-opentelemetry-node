import {
  computeOptions,
  HoneycombOptions,
  IGNORED_DATASET_ERROR,
  isClassic,
  maybeAppendMetricsPath,
  maybeAppendTracesPath,
  MISSING_API_KEY_ERROR,
  MISSING_DATASET_ERROR,
  MISSING_SERVICE_NAME_ERROR,
} from '../src/honeycomb-options';

const classicApiKey = 'this is a string that is 32 char';
const apiKey = 'testkey';

test('it should have an apiKey property on the HoneycombOptions object', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function hasApiKey(object: any): object is HoneycombOptions {
    return 'apiKey' in object;
  }
  const testApiKey = hasApiKey({ apiKey: 'testkey' });
  expect(testApiKey).toEqual(true);
});

describe('missing option warnings', () => {
  const consoleSpy = jest
    .spyOn(console, 'warn')
    .mockImplementation(() => undefined);

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('API Key', () => {
    beforeEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
    });
    afterEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
    });
    it('warns on missing API Key', () => {
      computeOptions({});
      expect(consoleSpy).toHaveBeenCalledWith(MISSING_API_KEY_ERROR);
    });
    it('does not warn if api key is present', () => {
      computeOptions({ apiKey: 'test-key' });
      expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_API_KEY_ERROR);
    });
  });
  describe('service name', () => {
    beforeEach(() => {
      delete process.env.OTEL_SERVICE_NAME;
    });
    afterEach(() => {
      delete process.env.OTEL_SERVICE_NAME;
    });
    it('warns on missing service name', () => {
      computeOptions({});
      expect(consoleSpy).toHaveBeenCalledWith(MISSING_SERVICE_NAME_ERROR);
    });
    it('does not warn if service name is present', () => {
      computeOptions({ serviceName: 'heeeeey' });
      expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_SERVICE_NAME_ERROR);
    });
    it.todo('warns if service name is present but empty string');
  });

  describe('dataset name', () => {
    beforeEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
    });
    afterEach(() => {
      delete process.env.HONEYCOMB_API_KEY;
    });
    describe('classic key', () => {
      it('warns on missing dataset', () => {
        computeOptions({
          apiKey: classicApiKey,
        });
        expect(consoleSpy).toHaveBeenCalledWith(MISSING_DATASET_ERROR);
      });

      it('does not warn if dataset is present', () => {
        computeOptions({
          apiKey: classicApiKey,
          dataset: 'totally-present',
        });
        expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_DATASET_ERROR);
      });
      it('warns if dataset is an empty string', () => {
        computeOptions({
          apiKey: classicApiKey,
          dataset: '',
        });
        expect(consoleSpy).toHaveBeenCalledWith(MISSING_DATASET_ERROR);
      });
    });
    describe('environment key', () => {
      it('does not warn on missing dataset', () => {
        computeOptions({
          apiKey: apiKey,
        });
        expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_DATASET_ERROR);
      });
      it('warns if dataset is present', () => {
        computeOptions({
          apiKey: apiKey,
          dataset: 'unnecessary dataset',
        });
        expect(consoleSpy).toHaveBeenCalledWith(IGNORED_DATASET_ERROR);
      });
    });
  });
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
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
  });
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
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
    delete process.env.HONEYCOMB_TRACES_APIKEY;
  });
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
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_KEY;
    delete process.env.HONEYCOMB_METRICS_APIKEY;
  });
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
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
  });
  afterEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
  });

  it('defaults to https://api.honeycomb.io', () => {
    const options = computeOptions();
    expect(options.endpoint).toBe('https://api.honeycomb.io');
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
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
    delete process.env.HONEYCOMB_TRACES_ENDPOINT;
  });
  afterEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
    delete process.env.HONEYCOMB_TRACES_ENDPOINT;
  });

  it('defaults to endpoint with v1/traces path', () => {
    const options = computeOptions({
      endpoint: 'my-custom-endpoint',
    });
    expect(options.tracesEndpoint).toBe('my-custom-endpoint/v1/traces');
  });

  it('defaults to endpoint set via env var', () => {
    process.env.HONEYCOMB_API_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions();
    expect(options.tracesEndpoint).toBe('my-custom-endpoint/v1/traces');
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

  it('does not append path for grpc exporter protocol', () => {
    const options = computeOptions({
      tracesEndpoint: 'my-custom-endpoint',
      protocol: 'grpc',
    });
    expect(options.tracesEndpoint).toBe('my-custom-endpoint');
  });
});

describe('metrics endpoint', () => {
  beforeEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
    delete process.env.HONEYCOMB_METRICS_ENDPOINT;
  });
  afterEach(() => {
    delete process.env.HONEYCOMB_API_ENDPOINT;
    delete process.env.HONEYCOMB_METRICS_ENDPOINT;
  });

  it('defaults to endpoint with v1/metrics path', () => {
    const options = computeOptions({
      endpoint: 'my-custom-endpoint',
    });
    expect(options.metricsEndpoint).toBe('my-custom-endpoint/v1/metrics');
  });

  it('defaults to endpoint set via env var', () => {
    process.env.HONEYCOMB_API_ENDPOINT = 'my-custom-endpoint';
    const options = computeOptions();
    expect(options.metricsEndpoint).toBe('my-custom-endpoint/v1/metrics');
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

  it('does not append path for grpc exporter protocol', () => {
    const options = computeOptions({
      metricsEndpoint: 'my-custom-endpoint',
      protocol: 'grpc',
    });
    expect(options.metricsEndpoint).toBe('my-custom-endpoint');
  });
});

describe('debug option', () => {
  beforeEach(() => {
    delete process.env.DEBUG;
  });
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
  beforeEach(() => {
    delete process.env.SAMPLE_RATE;
  });
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
  beforeEach(() => {
    delete process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS;
  });
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

describe('protocol', () => {
  beforeEach(() => {
    delete process.env.OTEL_EXPORTER_OTLP_PROTOCOL;
  });
  afterEach(() => {
    delete process.env.OTEL_EXPORTER_OTLP_PROTOCOL;
  });

  it('defaults to protocol of http/protobuf', () => {
    const options = computeOptions();
    expect(options.protocol).toBe('http/protobuf');
  });

  it('uses provided protocol option if set', () => {
    const options = computeOptions({
      protocol: 'grpc',
    });
    expect(options.protocol).toBe('grpc');
  });
});

describe('maybeAppendTracesPath', () => {
  it('does not append path for grpc protocol', () => {
    const endpoint = maybeAppendTracesPath('https://api.honeycomb.io', 'grpc');
    expect(endpoint).toBe('https://api.honeycomb.io');
  });

  it('appends path for http/json protocol', () => {
    const endpoint = maybeAppendTracesPath(
      'https://api.honeycomb.io',
      'http/json',
    );
    expect(endpoint).toBe('https://api.honeycomb.io/v1/traces');
  });

  it('appends path for http/protobuf protocol', () => {
    const endpoint = maybeAppendTracesPath(
      'https://api.honeycomb.io',
      'http/protobuf',
    );
    expect(endpoint).toBe('https://api.honeycomb.io/v1/traces');
  });

  it('does not double up forward slash if endpoint ends with one', () => {
    const endpoint = maybeAppendTracesPath(
      'https://api.honeycomb.io/',
      'http/json',
    );
    expect(endpoint).toBe('https://api.honeycomb.io/v1/traces');
  });
});

describe('maybeAppendMetricsPath', () => {
  it('does not append path for grpc protocol', () => {
    const endpoint = maybeAppendMetricsPath('https://api.honeycomb.io', 'grpc');
    expect(endpoint).toBe('https://api.honeycomb.io');
  });

  it('appends path for http/json protocol', () => {
    const endpoint = maybeAppendMetricsPath(
      'https://api.honeycomb.io',
      'http/json',
    );
    expect(endpoint).toBe('https://api.honeycomb.io/v1/metrics');
  });

  it('appends path for http/protobuf protocol', () => {
    const endpoint = maybeAppendMetricsPath(
      'https://api.honeycomb.io',
      'http/protobuf',
    );
    expect(endpoint).toBe('https://api.honeycomb.io/v1/metrics');
  });

  it('does not double up forward slash if endpoint ends with one', () => {
    const endpoint = maybeAppendMetricsPath(
      'https://api.honeycomb.io/',
      'http/json',
    );
    expect(endpoint).toBe('https://api.honeycomb.io/v1/metrics');
  });
});
