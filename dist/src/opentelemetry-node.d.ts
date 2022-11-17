import { NodeSDK } from '@opentelemetry/sdk-node';
import { HoneycombOptions } from './honeycomb-options';
/**
 * @class
 * @classdesc Extends the OpenTelemetry NodeSDK class with Honeycomb specific configuration.
 * @param options The HoneycombOptions used to configure the exporter.
 * HoneycombOptions extends OpenTelemetry NodeSDKConfiguration.
 */
export declare class HoneycombSDK extends NodeSDK {
    constructor(options?: HoneycombOptions);
}
