import { Resource, ResourceAttributes } from '@opentelemetry/resources';
import { VERSION } from './version';

/**
 * Builds and returns a Honeycomb Resource
 * @returns a Resource instance
 */
export function honeycombResource(): Resource {
  return new Resource({
    'honeycomb.distro.version': VERSION,
    'honeycomb.distro.runtime_version': process.versions.node,
  });
}
