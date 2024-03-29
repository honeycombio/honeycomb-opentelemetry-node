import {
  computeOptions,
  getMetricsInterval,
  getMetricsTimeout,
  HoneycombOptions,
  IGNORED_DATASET_ERROR,
  isClassic,
  maybeAppendMetricsPath,
  maybeAppendTracesPath,
  MISSING_API_KEY_ERROR,
  MISSING_DATASET_ERROR,
  MISSING_SERVICE_NAME_ERROR,
  OtlpProtocolKind,
  SAMPLER_OVERRIDE_WARNING,
} from '../src/honeycomb-options';
import { AlwaysOnSampler } from '@opentelemetry/sdk-trace-base';

// non-ingest classic keys are 32 chars long
const classicApiKey = '12345678901234567890123456789012';
// non-ingest non-classic keys are 22 chars log
const apiKey = 'kgvSpPwegJshQkuowXReLD';

test('it should have an apiKey property on the HoneycombOptions object', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function hasApiKey(object: any): object is HoneycombOptions {
    return 'apiKey' in object;
  }
  const testApiKey = hasApiKey({ apiKey: 'testkey' });
  expect(testApiKey).toEqual(true);
});

describe('options warnings', () => {
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
    it('warns on missing API Key', () => {
      computeOptions({});
      expect(consoleSpy).toHaveBeenCalledWith(MISSING_API_KEY_ERROR);
    });
    it('does not warn if api key is present', () => {
      computeOptions({ apiKey: 'test-key' });
      expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_API_KEY_ERROR);
    });
    it('does not warn if api key is missing wehen ignore warnings is true', () => {
      computeOptions({ skipOptionsValidation: true });
      expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_API_KEY_ERROR);
    });
  });
  describe('service name', () => {
    it('warns on missing service name', () => {
      computeOptions({});
      expect(consoleSpy).toHaveBeenCalledWith(MISSING_SERVICE_NAME_ERROR);
    });
    it('does not warn if service name is present', () => {
      computeOptions({ serviceName: 'heeeeey' });
      expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_SERVICE_NAME_ERROR);
    });
    it('does not warn on missing service name when ignore warnings is true', () => {
      computeOptions({ skipOptionsValidation: true });
      expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_SERVICE_NAME_ERROR);
    });
  });

  describe('dataset name', () => {
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
      it('does not warn if dataset is missing and skip validation is true', () => {
        computeOptions({
          apiKey: classicApiKey,
          skipOptionsValidation: true,
        });
        expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_DATASET_ERROR);
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
      it('does not warn if dataset is present and skip validation is tre', () => {
        computeOptions({
          apiKey: apiKey,
          dataset: 'unnecessary dataset',
          skipOptionsValidation: true,
        });
        expect(consoleSpy).not.toHaveBeenCalledWith(MISSING_DATASET_ERROR);
      });
    });
  });

  describe('custom sampler', () => {
    it('warns if a custom sampler is provided', () => {
      const customSampler = new AlwaysOnSampler();
      computeOptions({
        sampler: customSampler,
      });
      expect(consoleSpy).toHaveBeenCalledWith(SAMPLER_OVERRIDE_WARNING);
    });
    it('does not warn if the default sampler is being used', () => {
      computeOptions({});
      expect(consoleSpy).not.toHaveBeenCalledWith(SAMPLER_OVERRIDE_WARNING);
    });
  });
});

describe('isClassic', () => {
  it.each([
    {
      testString:
        'hcxik_01hqk4k20cjeh63wca8vva5stw70nft6m5n8wr8f5mjx3762s8269j50wc',
      name: 'full ingest key string, non classic',
      expected: false,
    },
    {
      testString: 'hcxik_01hqk4k20cjeh63wca8vva5stw',
      name: 'ingest key id, non classic',
      expected: false,
    },
    {
      testString:
        'hcaic_1234567890123456789012345678901234567890123456789012345678',
      name: 'full ingest key string, classic',
      expected: true,
    },
    {
      testString: 'hcaic_12345678901234567890123456',
      name: 'ingest key id, classic',
      expected: false,
    },
    {
      testString: 'kgvSpPwegJshQkuowXReLD',
      name: 'v2 configuration key',
      expected: false,
    },
    {
      testString: '12345678901234567890123456789012',
      name: 'classic key',
      expected: true,
    },
    {
      testString: undefined,
      name: 'undefined',
      expected: false,
    },
  ])(
    'test case $name',
    (testCase: { testString?: string; name: string; expected: boolean }) => {
      expect(isClassic(testCase.testString)).toEqual(testCase.expected);
    },
  );
});

describe('apikey', () => {
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
      protocol: OtlpProtocolKind.Grpc,
    });
    expect(options.metricsEndpoint).toBe('my-custom-endpoint');
    expect(options.protocol).toBe('grpc');
  });
});

describe('debug option', () => {
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

describe('metrics interval and timeout options', () => {
  it('is undefined if not set', () => {
    const metricInterval = getMetricsInterval();
    const metricTimeout = getMetricsTimeout();
    expect(metricInterval).toBeUndefined();
    expect(metricTimeout).toBeUndefined();
  });

  it('uses metrics interval and timeout from env vars', () => {
    process.env.OTEL_METRIC_EXPORT_INTERVAL = '2000';
    process.env.OTEL_METRIC_EXPORT_TIMEOUT = '1000';
    const metricInterval = getMetricsInterval();
    const metricTimeout = getMetricsTimeout();
    expect(metricInterval).toBe(2000);
    expect(metricTimeout).toBe(1000);
  });

  it('is undefined if set to negative numbers', () => {
    process.env.OTEL_METRIC_EXPORT_INTERVAL = '-2000';
    process.env.OTEL_METRIC_EXPORT_TIMEOUT = '-1000';
    const metricInterval = getMetricsInterval();
    const metricTimeout = getMetricsTimeout();
    expect(metricInterval).toBeUndefined();
    expect(metricTimeout).toBeUndefined();
  });

  it('is undefined if set to zero', () => {
    process.env.OTEL_METRIC_EXPORT_INTERVAL = '0';
    process.env.OTEL_METRIC_EXPORT_TIMEOUT = '0';
    const metricInterval = getMetricsInterval();
    const metricTimeout = getMetricsTimeout();
    expect(metricInterval).toBeUndefined();
    expect(metricTimeout).toBeUndefined();
  });
});
