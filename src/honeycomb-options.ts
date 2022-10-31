export const DEFAULT_API_ENDPOINT = 'https://api.honeycomb.io/v1/traces';

export const OtlpProtocols = ['grpc', 'http/protobuf', 'http/json'] as const;
type OtlpProtocol = typeof OtlpProtocols[number];

export interface HoneycombOptions {
  apiKey?: string;
  tracesApiKey?: string;
  metricsApiKey?: string;

  endpoint?: string;
  tracesEndpoint?: string;
  metricsEndpoint?: string;

  dataset?: string;
  metricsDataset?: string;

  serviceName?: string;
  sampleRate?: number;
  debug?: boolean;
  protocol?: OtlpProtocol;
}

export function computeOptions(options?: HoneycombOptions): HoneycombOptions {
  if (!options) {
    options = {};
  }

  const env = getHoneycombEnv();
  return {
    serviceName: env.OTEL_SERVICE_NAME || options?.serviceName,
    protocol: env.OTEL_EXPORTER_OTLP_PROTOCOL || options?.protocol || 'grpc',
    apiKey: env.HONEYCOMB_API_KEY || options?.apiKey,
    tracesApiKey: getTracesApiKey(env, options),
    metricsApiKey: getMetricsApiKey(env, options),
    endpoint: getEndpoint(env, options),
    tracesEndpoint: getTracesEndpoint(env, options),
    metricsEndpoint: getMetricsEndpoint(env, options),
    dataset: env.HONEYCOMB_DATASET || options?.dataset,
    metricsDataset: env.HONEYCOMB_METRICS_DATASET || options?.metricsDataset,
    sampleRate: env.SAMPLE_RATE || options?.sampleRate,
    debug: env.DEBUG || options?.debug,
  };
}

export function isClassic(apikey?: string): boolean {
  return apikey?.length === 32;
}

export type HoneycombEnvironmentOptions = {
  HONEYCOMB_API_KEY?: string;
  HONEYCOMB_TRACES_APIKEY?: string;
  HONEYCOMB_METRICS_APIKEY?: string;
  HONEYCOMB_API_ENDPOINT?: string;
  HONEYCOMB_TRACES_ENDPOINT?: string;
  HONEYCOMB_METRICS_ENDPOINT?: string;
  HONEYCOMB_DATASET?: string;
  HONEYCOMB_METRICS_DATASET?: string;
  SAMPLE_RATE?: number;
  DEBUG?: boolean;

  OTEL_SERVICE_NAME?: string;
  OTEL_EXPORTER_OTLP_PROTOCOL?: OtlpProtocol;
};

export const getHoneycombEnv = (): HoneycombEnvironmentOptions => {
  return {
    HONEYCOMB_API_ENDPOINT: process.env.HONEYCOMB_API_ENDPOINT,
    HONEYCOMB_TRACES_ENDPOINT:
      process.env.HONEYCOMB_TRACES_ENDPOINT ||
      process.env.HONEYCOMB_API_ENDPOINT,
    HONEYCOMB_METRICS_ENDPOINT:
      process.env.HONEYCOMB_METRICS_ENDPOINT ||
      process.env.HONEYCOMB_API_ENDPOINT,
    HONEYCOMB_API_KEY: process.env.HONEYCOMB_API_KEY,
    HONEYCOMB_TRACES_APIKEY:
      process.env.HONEYCOMB_TRACES_APIKEY || process.env.HONEYCOMB_API_KEY,
    HONEYCOMB_METRICS_APIKEY:
      process.env.HONEYCOMB_METRICS_APIKEY || process.env.HONEYCOMB_API_KEY,
    HONEYCOMB_DATASET: process.env.HONEYCOMB_DATASET,
    HONEYCOMB_METRICS_DATASET: process.env.HOENYCOMB_METRICS_DATASET,
    SAMPLE_RATE: parseSampleRate(process.env.SAMPLE_RATE),
    DEBUG: parseDebug(process.env.DEBUG),

    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
    OTEL_EXPORTER_OTLP_PROTOCOL: parseOtlpProtocol(
      process.env.OTEL_EXPORTER_OTLP_PROTOCOL,
    ),
  };
};

function parseSampleRate(sampleRateStr?: string): number | undefined {
  if (sampleRateStr) {
    const sampleRate = parseInt(sampleRateStr);
    if (!isNaN(sampleRate) && sampleRate > 1) {
      return sampleRate;
    }
  }
}

function parseDebug(debug?: string): boolean | undefined {
  if (debug) {
    if (debug === 'true') {
      return true;
    }
    if (debug === 'false') {
      return false;
    }
  }
}

function parseOtlpProtocol(protocol?: string): OtlpProtocol | undefined {
  if (OtlpProtocols.includes(protocol as OtlpProtocol)) {
    return protocol as OtlpProtocol;
  }
}

function getTracesApiKey(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
): string | undefined {
  return (
    env.HONEYCOMB_TRACES_APIKEY ||
    env.HONEYCOMB_API_KEY ||
    options.tracesApiKey ||
    options.apiKey
  );
}

function getMetricsApiKey(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
): string | undefined {
  return (
    env.HONEYCOMB_METRICS_APIKEY ||
    env.HONEYCOMB_API_KEY ||
    options.metricsApiKey ||
    options.apiKey
  );
}

function getEndpoint(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
): string {
  return (
    env.HONEYCOMB_API_ENDPOINT || options?.endpoint || DEFAULT_API_ENDPOINT
  );
}

function getTracesEndpoint(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
): string {
  return (
    env.HONEYCOMB_TRACES_ENDPOINT ||
    env.HONEYCOMB_API_ENDPOINT ||
    options.tracesEndpoint ||
    options.endpoint ||
    DEFAULT_API_ENDPOINT
  );
}

function getMetricsEndpoint(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
): string {
  return (
    env.HONEYCOMB_METRICS_ENDPOINT ||
    env.HONEYCOMB_API_ENDPOINT ||
    options.metricsEndpoint ||
    options.endpoint ||
    DEFAULT_API_ENDPOINT
  );
}
