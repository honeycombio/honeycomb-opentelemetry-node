import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { VERSION } from './version';

export function honeycombResource(): Resource {
  const resourceAttrs: ResourceAttributes = {
    'honeycomb.distro.version': VERSION,
    'honeycomb.distro.runtime_version': process.versions.node,
  };

  return new Resource(resourceAttrs);
}
