import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { computeOptions, HoneycombOptions } from './honeycomb-options';
import { VERSION } from './version';

export function honeycombResource(options?: HoneycombOptions): Resource {
  const opts = computeOptions(options);
  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': VERSION,
    'honeycomb.distro.runtime_version': process.versions.node,
  };

  if (opts.serviceName) {
    resourceAttrs[SemanticResourceAttributes.SERVICE_NAME] = opts.serviceName;
  }

  return new Resource(resourceAttrs);
}
