// TODO: detect env vars
// maybe use getEnv() from @opentelemetry/core
// https://github.com/open-telemetry/opentelemetry-js/blob/a7d053ae5a9fb073ccc3b639c3359fba19594e3d/packages/opentelemetry-core/src/platform/node/environment.ts

// use interface for typechecking

export interface HoneycombOptions {
  apiKey: string;
  endpoint?: string;
  serviceName?: string;
  // for honeycomb classic, or metrics/logs
  dataset?: string;
  // x-otlp-version, api key, others?
  headers?: object;
  // grpc, http, http/json
  protocol?: string;
}

