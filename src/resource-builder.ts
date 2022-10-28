import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { HoneycombOptions } from './honeycomb-options';

// TODO: generate as part of the build process from package.json
export const version = '0.1.0';

export function addResource(options: HoneycombOptions): Resource {
  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': version,
    'honeycomb.distro.runtime_version': process.versions.node,
  };

  if (options.serviceName) {
    resourceAttrs[SemanticResourceAttributes.SERVICE_NAME] =
      options.serviceName;
  }

  // combine default resource with honeycomb resource
  return new Resource(resourceAttrs);
}
