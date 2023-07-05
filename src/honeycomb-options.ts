import { NodeSDKConfiguration } from '@opentelemetry/sdk-node';

export const OtlpProtocols = ['grpc', 'http/protobuf', 'http/json'] as const;
export enum OtlpProtocolKind {
  Grpc = 'grpc',
  HttpProtobuf = 'http/protobuf',
  HttpJson = 'http/json',
}
export type OtlpProtocol = OtlpProtocolKind | (typeof OtlpProtocols)[number];

export const DEFAULT_API_ENDPOINT = 'https://api.honeycomb.io';
export const DEFAULT_SAMPLE_RATE = 1;
export const DEFAULT_OTLP_EXPORTER_PROTOCOL = OtlpProtocolKind.HttpProtobuf;

export const IGNORED_DATASET_ERROR =
  'WARN: Dataset is ignored in favor of service name.';
export const MISSING_API_KEY_ERROR =
  'WARN: Missing api key. Specify either HONEYCOMB_API_KEY environment variable or apiKey in the options parameter.';
export const MISSING_DATASET_ERROR =
  'WARN: Missing dataset. Specify either HONEYCOMB_DATASET environment variable or dataset in the options parameter.';
export const MISSING_SERVICE_NAME_ERROR =
  'WARN: Missing service name. Specify either OTEL_SERVICE_NAME environment variable or serviceName in the options parameter.  If left unset, this will show up in Honeycomb as unknown_service:node';

/**
 * The options used to configure the Honeycomb Node SDK.
 */
export interface HoneycombOptions extends Partial<NodeSDKConfiguration> {
  /** The API key used to send telemetry to Honeycomb. */
  apiKey?: string;

  /** The API key used to send traces telemetry to Honeycomb. Defaults to apikey if not set. */
  tracesApiKey?: string;

  /** The API key used to send metrics telemetry to Honeycomb. Defaults to apikey if not set. */
  metricsApiKey?: string;

  /** The API endpoint where telemetry is sent. Defaults to 'https://api.honeycomb.io' */
  endpoint?: string;

  /** The API endpoint where traces telemetry is sent. Defaults to endpoint if not set. */
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

  /** The local visualizations flag enables logging Honeycomb URLs for completed traces. Do not use in production. */
  localVisualizations?: boolean;

  /** Skip options validation warnings (eg no API key configured). This is useful when the SDK is being
   * used in conjuction with an OpenTelemetry Collector (which will handle the API key and dataset configuration).
   * Defaults to 'false'.
   */
  skipOptionsValidation?: boolean;
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
  const protocol =
    env.OTEL_EXPORTER_OTLP_PROTOCOL ||
    options?.protocol ||
    DEFAULT_OTLP_EXPORTER_PROTOCOL;

  const opts = {
    ...options,
    serviceName: env.OTEL_SERVICE_NAME || options?.serviceName,
    protocol: protocol,
    apiKey: env.HONEYCOMB_API_KEY || options?.apiKey,
    tracesApiKey: getTracesApiKey(env, options),
    metricsApiKey: getMetricsApiKey(env, options),
    endpoint: getEndpoint(env, options),
    tracesEndpoint: getTracesEndpoint(env, options, protocol),
    metricsEndpoint: getMetricsEndpoint(env, options, protocol),
    dataset: env.HONEYCOMB_DATASET || options?.dataset,
    metricsDataset: env.HONEYCOMB_METRICS_DATASET || options?.metricsDataset,
    sampleRate: getSampleRate(env, options),
    debug: env.DEBUG || options?.debug || false,
    localVisualizations:
      env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS ||
      options?.localVisualizations ||
      false,
    skipOptionsValidation:
      env.HONEYCOMB_SKIP_OPTIONS_VALIDATION ||
      options?.skipOptionsValidation ||
      false,
  };

  // skip options validation if requested
  if (opts.skipOptionsValidation) {
    return opts;
  }

  // warn if api key is missing
  if (!opts.apiKey) {
    console.warn(MISSING_API_KEY_ERROR);
  }

  // warn if service name is missing
  if (!opts.serviceName) {
    console.warn(MISSING_SERVICE_NAME_ERROR);
  }

  // warn if dataset is set while using an environment-aware key
  if (opts.apiKey && !isClassic(opts.apiKey) && opts.dataset) {
    console.warn(IGNORED_DATASET_ERROR);
  }

  // warn if dataset is missing if using classic key
  if (opts.apiKey && isClassic(opts.apiKey) && !opts.dataset) {
    console.warn(MISSING_DATASET_ERROR);
  }

  return opts;
}

/**
 * Determines whether the passed in apikey is classic (32 chars) or not.
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
  HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS?: boolean;
  HONEYCOMB_SKIP_OPTIONS_VALIDATION?: boolean;

  OTEL_SERVICE_NAME?: string;
  OTEL_EXPORTER_OTLP_PROTOCOL?: OtlpProtocol;

  OTEL_METRIC_EXPORT_INTERVAL?: number;
  OTEL_METRIC_EXPORT_TIMEOUT?: number;
};

/**
 * Gets an instance of the HoneycombEnvironmentOptions, reading environment variables.
 *
 * @returns an instance of HoneycombEnvironmentOptions
 */
export const getHoneycombEnv = (): HoneycombEnvironmentOptions => {
  return {
    HONEYCOMB_API_ENDPOINT: process.env.HONEYCOMB_API_ENDPOINT,
    HONEYCOMB_TRACES_ENDPOINT: process.env.HONEYCOMB_TRACES_ENDPOINT,
    HONEYCOMB_METRICS_ENDPOINT: process.env.HONEYCOMB_METRICS_ENDPOINT,
    HONEYCOMB_API_KEY: process.env.HONEYCOMB_API_KEY,
    HONEYCOMB_TRACES_APIKEY:
      process.env.HONEYCOMB_TRACES_APIKEY || process.env.HONEYCOMB_API_KEY,
    HONEYCOMB_METRICS_APIKEY:
      process.env.HONEYCOMB_METRICS_APIKEY || process.env.HONEYCOMB_API_KEY,
    HONEYCOMB_DATASET: process.env.HONEYCOMB_DATASET,
    HONEYCOMB_METRICS_DATASET: process.env.HONEYCOMB_METRICS_DATASET,
    SAMPLE_RATE: parseStringToPositiveNumber(process.env.SAMPLE_RATE, 1),
    DEBUG: parseBoolean(process.env.DEBUG),
    HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS: parseBoolean(
      process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS,
    ),
    HONEYCOMB_SKIP_OPTIONS_VALIDATION: parseBoolean(
      process.env.HONEYCOMB_SKIP_OPTIONS_VALIDATION,
    ),

    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
    OTEL_EXPORTER_OTLP_PROTOCOL: parseOtlpProtocol(
      process.env.OTEL_EXPORTER_OTLP_PROTOCOL,
    ),

    OTEL_METRIC_EXPORT_INTERVAL: parseStringToPositiveNumber(
      process.env.OTEL_METRIC_EXPORT_INTERVAL,
      0,
    ),
    OTEL_METRIC_EXPORT_TIMEOUT: parseStringToPositiveNumber(
      process.env.OTEL_METRIC_EXPORT_TIMEOUT,
      0,
    ),
  };
};

/**
 *
 * @param envStr environment variable value to parse as number
 * @param minVal minimum valid number e.g. 0 for positive numbers
 * This only parses positive numbers, with a default minimum of 0
 * @returns a positive number or undefined
 */
function parseStringToPositiveNumber(
  envStr?: string,
  minVal = 0,
): number | undefined {
  if (envStr) {
    const parsedValue = parseInt(envStr);
    if (!isNaN(parsedValue) && parsedValue > minVal) {
      return parsedValue;
    }
  }
}

function parseBoolean(value?: string): boolean | undefined {
  if (value) {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
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

/**
 * Gets the traces endpoint to export telemetry using environment variables and options.
 *
 * When sending over HTTP protocols, the endpoint will include the path '/v1/traces' if
 * set via HONEYCOMB_API_ENDPOINT or the endpoint option. The path is not appended for
 * endpoints set via HONEYCOMB_TRACES_ENDPOINT or the tracesEndpoint option.
 */
function getTracesEndpoint(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
  protocol: OtlpProtocol,
): string {
  if (env.HONEYCOMB_TRACES_ENDPOINT) {
    return env.HONEYCOMB_TRACES_ENDPOINT;
  }
  if (env.HONEYCOMB_API_ENDPOINT) {
    return maybeAppendTracesPath(env.HONEYCOMB_API_ENDPOINT, protocol);
  }
  if (options.tracesEndpoint) {
    return options.tracesEndpoint;
  }
  if (options.endpoint) {
    return maybeAppendTracesPath(options.endpoint, protocol);
  }
  return maybeAppendTracesPath(DEFAULT_API_ENDPOINT, protocol);
}

/**
 * Gets the metrics endpoint to export telemetry using environment variables and options.
 *
 * When sending over HTTP protocols, the endpoint will include the path '/v1/metrics' if
 * set via HONEYCOMB_API_ENDPOINT or the endpoint option. The path is not appended for
 * endpoints set via HONEYCOMB_METRICS_ENDPOINT or the metricsEndpoint option.
 */
function getMetricsEndpoint(
  env: HoneycombEnvironmentOptions,
  options: HoneycombOptions,
  protocol: OtlpProtocol,
): string {
  if (env.HONEYCOMB_METRICS_ENDPOINT) {
    return env.HONEYCOMB_METRICS_ENDPOINT;
  }
  if (env.HONEYCOMB_API_ENDPOINT) {
    return maybeAppendMetricsPath(env.HONEYCOMB_API_ENDPOINT, protocol);
  }
  if (options.metricsEndpoint) {
    return options.metricsEndpoint;
  }
  if (options.endpoint) {
    return maybeAppendMetricsPath(options.endpoint, protocol);
  }
  return maybeAppendMetricsPath(DEFAULT_API_ENDPOINT, protocol);
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

function isHttpProtocol(protocol?: OtlpProtocol): boolean {
  switch (protocol) {
    case 'http/json':
    case 'http/protobuf':
      return true;
  }
  return false;
}

/**
 * Checks for and appends v1/traces to provided URL if missing when using an HTTP
 * based exporter protocol.
 *
 * @param url the base URL to append traces path to if missing
 * @param protocol the exporter protocol to send telemetry
 * @returns the endpoint with traces path appended if missing
 */
export function maybeAppendTracesPath(url: string, protocol: OtlpProtocol) {
  if (isHttpProtocol(protocol) && !url?.endsWith('v1/traces')) {
    return url.endsWith('/') ? url + 'v1/traces' : url + '/v1/traces';
  }
  return url;
}

/**
 * Checks for and appends v1/metrics to provided URL if missing when using an HTTP
 * based exporter protocol.
 *
 * @param url the base URL to append traces path to if missing
 * @param protocol the exporter protocol to send telemetry
 * @returns the endpoint with traces path appended if missing
 */
export function maybeAppendMetricsPath(url: string, protocol: OtlpProtocol) {
  if (isHttpProtocol(protocol) && !url?.endsWith('v1/metrics')) {
    return url.endsWith('/') ? url + 'v1/metrics' : url + '/v1/metrics';
  }
  return url;
}

/**
 * temporary functions while awaiting support from OpenTelemetry
 *
 * @returns the metric interval and metric timeout if provided
 */

export function getMetricsInterval(): number | undefined {
  const env = getHoneycombEnv();
  return env.OTEL_METRIC_EXPORT_INTERVAL;
}

export function getMetricsTimeout(): number | undefined {
  const env = getHoneycombEnv();
  return env.OTEL_METRIC_EXPORT_TIMEOUT;
}
