// TODO: detect env vars
// maybe use getEnv() from @opentelemetry/core
// https://github.com/open-telemetry/opentelemetry-js/blob/a7d053ae5a9fb073ccc3b639c3359fba19594e3d/packages/opentelemetry-core/src/platform/node/environment.ts

// use interface for typechecking

const HONEYCOMB_DEFAULT_ENDPOINT = 'https://api.honeycomb.io';

export interface HoneycombOptions {
  apiKey?: string;
  endpoint?: string;
  serviceName?: string;
  // for honeycomb classic, or metrics/logs
  dataset?: string;
  // x-otlp-version, api key, others?
  headers?: string;
  // grpc, http, http/json
  protocol?: string;
}

export function setDefaultOptions(
  options: Partial<HoneycombOptions> = {},
): HoneycombOptions {
  options.endpoint = HONEYCOMB_DEFAULT_ENDPOINT;
  return options;
}
