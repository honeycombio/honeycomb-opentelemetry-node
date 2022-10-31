import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { computeOptions, HoneycombOptions } from './honeycomb-options';

// TODO: generate as part of the build process from package.json
export const version = '0.1.0';

export function honeycombResource(options?: HoneycombOptions): Resource {
  const opts = computeOptions(options);
  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': version,
    'honeycomb.distro.runtime_version': process.versions.node,
  };

  if (opts.serviceName) {
    resourceAttrs[SemanticResourceAttributes.SERVICE_NAME] = opts.serviceName;
  }

  return new Resource(resourceAttrs);
}
