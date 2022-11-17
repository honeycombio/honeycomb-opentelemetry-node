import { Resource } from '@opentelemetry/resources';
/**
 * Builds and returns an Opentelemetry Resource with
 * added resource attributes specific to the Honeycomb Distro
 * @returns a Resource instance
 */
export declare function configureHoneycombResource(): Resource;
