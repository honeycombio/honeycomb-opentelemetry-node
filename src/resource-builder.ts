import { Resource } from '@opentelemetry/resources';
import { HoneycombOptions } from './honeycomb-options';
import { VERSION } from './version';

/**
 * Builds and returns an Opentelemetry Resource with
 * added resource attributes specific to the Honeycomb Distro
 * @returns a Resource instance
 */
export function configureHoneycombResource(opts?: HoneycombOptions): Resource {
  return new Resource({
    'honeycomb.distro.version': VERSION,
    'honeycomb.distro.runtime_version': process.versions.node,
  }).merge(opts?.resource ? opts.resource : null);
}
