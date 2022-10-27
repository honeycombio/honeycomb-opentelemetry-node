import { Resource, ResourceAttributes } from '@opentelemetry/resources';

// TODO: detect env vars for resources
// maybe use getEnv() from @opentelemetry/core
// https://github.com/open-telemetry/opentelemetry-js/blob/a7d053ae5a9fb073ccc3b639c3359fba19594e3d/packages/opentelemetry-core/src/platform/node/environment.ts

// TODO: add honeycomb attributes for distro version and runtime_version
// https://github.com/open-telemetry/opentelemetry-js/blob/a7d053ae5a9fb073ccc3b639c3359fba19594e3d/packages/opentelemetry-core/src/platform/node/sdk-info.ts

export function addResource(): Resource {
  const resourceAttrs: ResourceAttributes = {};
  return new Resource(resourceAttrs);
}
