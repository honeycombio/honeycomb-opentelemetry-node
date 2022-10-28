const HONEYCOMB_API_ENDPOINT = 'https://api.honeycomb.io/v1/traces';

export interface HoneycombOptions {
  apiKey?: string;
  tracesApiKey?: string;
  metricsApiKey?: string;

  dataset?: string;
  metricsDataset?: string;

  endpoint?: string;
  tracesEndpoint?: string;
  metricsEndpoint?: string;

  serviceName?: string;
  sampleRate?: number;
  debug?: boolean;
  protocol?: string;
}

export function getTracesApikey(options: HoneycombOptions) {
  return options.tracesApiKey || options.apiKey;
}

export function getTracesEndpoint(options: HoneycombOptions) {
  return options.tracesEndpoint || options.endpoint || HONEYCOMB_API_ENDPOINT;
}

export function getMetricsApikey(options: HoneycombOptions) {
  return options.metricsApiKey || options.apiKey;
}

export function getMetricsEndpoint(options: HoneycombOptions) {
  return options.metricsEndpoint || options.endpoint || HONEYCOMB_API_ENDPOINT;
}

export function addDatasetHeader(options: HoneycombOptions): boolean {
  return isClassic(getTracesApikey(options)) && options.dataset != undefined;
}

function isClassic(apikey: string | undefined): boolean {
  return apikey?.length === 32;
}

export function applyEnvVars(options: HoneycombOptions) {
  if (process.env.HONEYCOMB_APIKEY) {
    options.apiKey = process.env.HONEYCOMB_APIKEY;
  }
  if (process.env.HONEYCOMB_TRACES_APIKEY) {
    options.tracesApiKey = process.env.HONEYCOMB_TRACES_APIKEY;
  }
  if (process.env.HONEYCOMB_METRICS_APIKEY) {
    options.metricsApiKey = process.env.HONEYCOMB_METRICS_APIKEY;
  }

  if (process.env.HONEYCOMB_DATASET) {
    options.dataset = process.env.HONEYCOMB_DATASET;
  }
  if (process.env.HONEYCOMB_METRICS_DATASET) {
    options.metricsDataset = process.env.HONEYCOMB_METRICS_DATASET;
  }

  if (process.env.HONEYCOMB_API_ENDPOINT) {
    options.endpoint = process.env.HONEYCOMB_API_ENDPOINT;
  }
  if (process.env.HONEYCOMB_TRACES_ENDPOINT) {
    options.tracesApiKey = process.env.HONEYCOMB_TRACES_ENDPOINT;
  }
  if (process.env.HONEYCOMB_METRICS_ENDPOINT) {
    options.metricsEndpoint = process.env.HONEYCOMB_METRICS_ENDPOINT;
  }

  if (process.env.OTEL_SERVICE_NAME) {
    options.serviceName = process.env.OTEL_SERVICE_NAME;
  }
  if (process.env.SAMPLE_RATE) {
    const sampleRate = parseInt(process.env.SAMPLE_RATE);
    if (!isNaN(sampleRate) && sampleRate > 1) {
      options.sampleRate = sampleRate;
    }
  }
  if (process.env.DEBUG && process.env.DEBUG === 'true') {
    options.debug = true;
  }
  if (process.env.OTEL_EXPORTER_OTLP_PROTOCOL) {
    options.serviceName = process.env.OTEL_SERVICE_NAME;
  }
}
