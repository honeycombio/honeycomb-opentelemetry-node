export const DEFAULT_API_ENDPOINT = 'https://api.honeycomb.io/v1/traces';
export const DEFAULT_SAMPLE_RATE = 1;

export const OtlpProtocols = ['grpc', 'http/protobuf', 'http/json'] as const;
type OtlpProtocol = typeof OtlpProtocols[number];

/**
 * The options used to configure the Honeycomb Node SDK.
 */
export interface HoneycombOptions {
  /** The API key used to send telemetry to Honeycomb. */
  apiKey?: string;

  /** The API key used to send traces telemetry to Honeycomb. Defaults to apikey if not set. */
  tracesApiKey?: string;

  /** The API key used to send merics telemetry to Honeycomb. Defaults to apikey if not set. */
  metricsApiKey?: string;

  /** The API endpoint where telemetry is sent. Defaults to 'https://api.honeycomb.io' */
  endpoint?: string;

  /** The API endpint where traces telemetry is sent. Defaults to endpoint if not set. */
  tracesEndpoint?: string;

  /** The API endpoint where metrics telemetry is sent. Defaults to endpoint if not set. */
  metricsEndpoint?: string;

  /** The dataset where traces telemetry is stored in Honeycomb. Only used when using a classic API key. */
  dataset?: string;

  /** The dataset where metrics telemetry is stored in Honeycomb. */
  metricsDataset?: string;

  /** The service name of the application and where traces telemetry is stored in Honeycomb. */
  serviceName?: string;

  /** The sample rate used to determine whether a trace is exported. Defaults to 1 (send everything). */
  sampleRate?: number;

  /** The debug flag enables additional logging that us useful when debugging your application. Do not use in production. */
  debug?: boolean;

  /** The OTLP protocol used to send telemetry to Honeycomb. The default is 'http/protobuf'. */
  protocol?: OtlpProtocol;
}

/**
 * Computes a consolidated HoneycombOptions using the passed in options and environment variables.
 *
 * @remarks
 * The computed options prefer environment variables over the passed in options.
 *
 * @param options the base HoneycombOptions used to combine with environment variables
 * @returns the computed HoneycombOptions
 */
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
    sampleRate: getSampleRate(env, options),
    debug: env.DEBUG || options?.debug || false,
  };
}

/**
 * Determins whether the passed in apikey is clasic (32 chars) or not.
 *
 * @param apikey the apikey
 * @returns a boolean to indicate if the apikey was a classic key
 */
export function isClassic(apikey?: string): boolean {
  return apikey?.length === 32;
}

/**
 * HoneycombEnvironmentOptions is a type used to get honeycomb options from environment variables.
 */
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

/**
 * Gets an instance of the HoneycombEnvironmentOptions, reading environment variables.
 *
 * @returns an instance of HoneycombEnvironmentOptions
 */
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

function getSampleRate(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
): number {
  if (env.SAMPLE_RATE && env.SAMPLE_RATE > 0) {
    return env.SAMPLE_RATE;
  } else if (options.sampleRate && options.sampleRate > 0) {
    return options.sampleRate;
  }
  return DEFAULT_SAMPLE_RATE;
}
