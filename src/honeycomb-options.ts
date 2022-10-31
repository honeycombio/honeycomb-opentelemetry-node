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
    protocol: env.OTEL_EXPORTER_OTLP_PROTOCOL || options?.protocol,
    apiKey: env.HONEYCOMB_APIKEY || options?.apiKey,
    tracesApiKey:
      env.HONEYCOMB_TRACES_APIKEY || options?.tracesApiKey || options?.apiKey,
    metricsApiKey:
      env.HONEYCOMB_METRICS_APIKEY || options?.metricsApiKey || options?.apiKey,
    endpoint:
      env.HONEYCOMB_API_ENDPOINT || options?.endpoint || DEFAULT_API_ENDPOINT,
    tracesEndpoint:
      env.HONEYCOMB_TRACES_ENDPOINT ||
      options?.tracesEndpoint ||
      DEFAULT_API_ENDPOINT,
    metricsEndpoint:
      env.HONEYCOMB_METRICS_ENDPOINT ||
      options?.metricsEndpoint ||
      DEFAULT_API_ENDPOINT,
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
  HONEYCOMB_APIKEY?: string;
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
    HONEYCOMB_APIKEY: process.env.HONEYCOMB_API_KEY,
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
