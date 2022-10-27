// TODO: detect env vars
// maybe use getEnv() from @opentelemetry/core
// https://github.com/open-telemetry/opentelemetry-js/blob/a7d053ae5a9fb073ccc3b639c3359fba19594e3d/packages/opentelemetry-core/src/platform/node/environment.ts

// use interface for typechecking

export interface HoneycombOptions {
  apiKey?: string;
  traceApiKey?: string;
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

export function isLegacy({ apiKey }: HoneycombOptions): boolean {
  return apiKey?.length === 32;
}
