import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getServiceName, HoneycombOptions } from './honeycomb-options';

// TODO: generate as part of the build process from package.json
export const version = '0.1.0';

export function honeycombResource(options?: HoneycombOptions): Resource {
  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': version,
    'honeycomb.distro.runtime_version': process.versions.node,
  };

  const serviceName = getServiceName(options);
  if (serviceName) {
    resourceAttrs[SemanticResourceAttributes.SERVICE_NAME] = serviceName;
  }

  // combine default resource with honeycomb resource
  return new Resource(resourceAttrs);
}
