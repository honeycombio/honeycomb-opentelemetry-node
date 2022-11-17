import { NodeSDKConfiguration } from '@opentelemetry/sdk-node';
export declare const DEFAULT_API_ENDPOINT = "https://api.honeycomb.io";
export declare const DEFAULT_SAMPLE_RATE = 1;
export declare const DEFAULT_OTLP_EXPORTER_PROTOCOL = "http/protobuf";
export declare const OtlpProtocols: readonly ["grpc", "http/protobuf", "http/json"];
declare type OtlpProtocol = typeof OtlpProtocols[number];
export declare const IGNORED_DATASET_ERROR = "WARN: Dataset is ignored in favor of service name.";
export declare const MISSING_API_KEY_ERROR = "WARN: Missing api key. Specify either HONEYCOMB_API_KEY environment variable or apiKey in the options parameter.";
export declare const MISSING_DATASET_ERROR = "WARN: Missing dataset. Specify either HONEYCOMB_DATASET environment variable or dataset in the options parameter.";
export declare const MISSING_SERVICE_NAME_ERROR = "WARN: Missing service name. Specify either OTEL_SERVICE_NAME environment variable or serviceName in the options parameter.  If left unset, this will show up in Honeycomb as unknown_service:node";
/**
 * The options used to configure the Honeycomb Node SDK.
 */
export interface HoneycombOptions extends Partial<NodeSDKConfiguration> {
    /** The API key used to send telemetry to Honeycomb. */
    apiKey?: string;
    /** The API key used to send traces telemetry to Honeycomb. Defaults to apikey if not set. */
    tracesApiKey?: string;
    /** The API key used to send merics telemetry to Honeycomb. Defaults to apikey if not set. */
    metricsApiKey?: string;
    /** The API endpoint where telemetry is sent. Defaults to 'https://api.honeycomb.io' */
    endpoint?: string;
    /** The API endpint where traces telemetry is sent. Defaults to endpoint if not set. */
    tracesEndpoint?: string;
    /** The API endpoint where metrics telemetry is sent. Defaults to endpoint if not set. */
    metricsEndpoint?: string;
    /** The dataset where traces telemetry is stored in Honeycomb. Only used when using a classic API key. */
    dataset?: string;
    /** The dataset where metrics telemetry is stored in Honeycomb. */
    metricsDataset?: string;
    /** The service name of the application and where traces telemetry is stored in Honeycomb. */
    serviceName?: string;
    /** The sample rate used to determine whether a trace is exported. Defaults to 1 (send everything). */
    sampleRate?: number;
    /** The debug flag enables additional logging that us useful when debugging your application. Do not use in production. */
    debug?: boolean;
    /** The OTLP protocol used to send telemetry to Honeycomb. The default is 'http/protobuf'. */
    protocol?: OtlpProtocol;
    /** The local visualizations flag enables logging Honeycomb URLs for completed traces. Do not use in production. */
    localVisualizations?: boolean;
}
/**
 * Computes a consolidated HoneycombOptions using the passed in options and environment variables.
 *
 * @remarks
 * The computed options prefer environment variables over the passed in options.
 *
 * @param options the base HoneycombOptions used to combine with environment variables
 * @returns the computed HoneycombOptions
 */
export declare function computeOptions(options?: HoneycombOptions): HoneycombOptions;
/**
 * Determins whether the passed in apikey is clasic (32 chars) or not.
 *
 * @param apikey the apikey
 * @returns a boolean to indicate if the apikey was a classic key
 */
export declare function isClassic(apikey?: string): boolean;
/**
 * HoneycombEnvironmentOptions is a type used to get honeycomb options from environment variables.
 */
export declare type HoneycombEnvironmentOptions = {
    HONEYCOMB_API_KEY?: string;
    HONEYCOMB_TRACES_APIKEY?: string;
    HONEYCOMB_METRICS_APIKEY?: string;
    HONEYCOMB_API_ENDPOINT?: string;
    HONEYCOMB_TRACES_ENDPOINT?: string;
    HONEYCOMB_METRICS_ENDPOINT?: string;
    HONEYCOMB_DATASET?: string;
    HONEYCOMB_METRICS_DATASET?: string;
    SAMPLE_RATE?: number;
    DEBUG?: boolean;
    HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS?: boolean;
    OTEL_SERVICE_NAME?: string;
    OTEL_EXPORTER_OTLP_PROTOCOL?: OtlpProtocol;
};
/**
 * Gets an instance of the HoneycombEnvironmentOptions, reading environment variables.
 *
 * @returns an instance of HoneycombEnvironmentOptions
 */
export declare const getHoneycombEnv: () => HoneycombEnvironmentOptions;
/**
 * Checks for and appends v1/traces to provided URL if missing when using an HTTP
 * based exporter protocol.
 *
 * @param url the base URL to append traces path to if missing
 * @param protocol the exporter protocol to send telemetry
 * @returns the endpoint with traces path appended if missing
 */
export declare function maybeAppendTracesPath(url: string, protocol: OtlpProtocol): string;
/**
 * Checks for and appends v1/metrics to provided URL if missingwhen using an HTTP
 * based exporter protocol.
 *
 * @param url the base URL to append traces path to if missing
 * @param protocol the exporter protocol to send telemetry
 * @returns the endpoint with traces path appended if missing
 */
export declare function maybeAppendMetricsPath(url: string, protocol: OtlpProtocol): string;
export {};
