"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeAppendMetricsPath = exports.maybeAppendTracesPath = exports.getHoneycombEnv = exports.isClassic = exports.computeOptions = exports.MISSING_SERVICE_NAME_ERROR = exports.MISSING_DATASET_ERROR = exports.MISSING_API_KEY_ERROR = exports.IGNORED_DATASET_ERROR = exports.OtlpProtocols = exports.DEFAULT_OTLP_EXPORTER_PROTOCOL = exports.DEFAULT_SAMPLE_RATE = exports.DEFAULT_API_ENDPOINT = void 0;
exports.DEFAULT_API_ENDPOINT = 'https://api.honeycomb.io';
exports.DEFAULT_SAMPLE_RATE = 1;
exports.DEFAULT_OTLP_EXPORTER_PROTOCOL = 'http/protobuf';
exports.OtlpProtocols = ['grpc', 'http/protobuf', 'http/json'];
exports.IGNORED_DATASET_ERROR = 'WARN: Dataset is ignored in favor of service name.';
exports.MISSING_API_KEY_ERROR = 'WARN: Missing api key. Specify either HONEYCOMB_API_KEY environment variable or apiKey in the options parameter.';
exports.MISSING_DATASET_ERROR = 'WARN: Missing dataset. Specify either HONEYCOMB_DATASET environment variable or dataset in the options parameter.';
exports.MISSING_SERVICE_NAME_ERROR = 'WARN: Missing service name. Specify either OTEL_SERVICE_NAME environment variable or serviceName in the options parameter.  If left unset, this will show up in Honeycomb as unknown_service:node';
/**
 * Computes a consolidated HoneycombOptions using the passed in options and environment variables.
 *
 * @remarks
 * The computed options prefer environment variables over the passed in options.
 *
 * @param options the base HoneycombOptions used to combine with environment variables
 * @returns the computed HoneycombOptions
 */
function computeOptions(options) {
    if (!options) {
        options = {};
    }
    const env = (0, exports.getHoneycombEnv)();
    const protocol = env.OTEL_EXPORTER_OTLP_PROTOCOL ||
        (options === null || options === void 0 ? void 0 : options.protocol) ||
        exports.DEFAULT_OTLP_EXPORTER_PROTOCOL;
    const opts = Object.assign(Object.assign({}, options), { serviceName: env.OTEL_SERVICE_NAME || (options === null || options === void 0 ? void 0 : options.serviceName), protocol: protocol, apiKey: env.HONEYCOMB_API_KEY || (options === null || options === void 0 ? void 0 : options.apiKey), tracesApiKey: getTracesApiKey(env, options), metricsApiKey: getMetricsApiKey(env, options), endpoint: getEndpoint(env, options), tracesEndpoint: getTracesEndpoint(env, options, protocol), metricsEndpoint: getMetricsEndpoint(env, options, protocol), dataset: env.HONEYCOMB_DATASET || (options === null || options === void 0 ? void 0 : options.dataset), metricsDataset: env.HONEYCOMB_METRICS_DATASET || (options === null || options === void 0 ? void 0 : options.metricsDataset), sampleRate: getSampleRate(env, options), debug: env.DEBUG || (options === null || options === void 0 ? void 0 : options.debug) || false, localVisualizations: env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS ||
            (options === null || options === void 0 ? void 0 : options.localVisualizations) ||
            false });
    // warn if api key is missing
    if (!opts.apiKey) {
        console.warn(exports.MISSING_API_KEY_ERROR);
    }
    // warn if service name is missing
    if (!opts.serviceName) {
        console.warn(exports.MISSING_SERVICE_NAME_ERROR);
    }
    // warn if dataset is set while using an environment-aware key
    if (opts.apiKey && !isClassic(opts.apiKey) && opts.dataset) {
        console.warn(exports.IGNORED_DATASET_ERROR);
    }
    // warn if dataset is missing if using classic key
    if (opts.apiKey && isClassic(opts.apiKey) && !opts.dataset) {
        console.warn(exports.MISSING_DATASET_ERROR);
    }
    return opts;
}
exports.computeOptions = computeOptions;
/**
 * Determins whether the passed in apikey is clasic (32 chars) or not.
 *
 * @param apikey the apikey
 * @returns a boolean to indicate if the apikey was a classic key
 */
function isClassic(apikey) {
    return (apikey === null || apikey === void 0 ? void 0 : apikey.length) === 32;
}
exports.isClassic = isClassic;
/**
 * Gets an instance of the HoneycombEnvironmentOptions, reading environment variables.
 *
 * @returns an instance of HoneycombEnvironmentOptions
 */
const getHoneycombEnv = () => {
    return {
        HONEYCOMB_API_ENDPOINT: process.env.HONEYCOMB_API_ENDPOINT,
        HONEYCOMB_TRACES_ENDPOINT: process.env.HONEYCOMB_TRACES_ENDPOINT,
        HONEYCOMB_METRICS_ENDPOINT: process.env.HONEYCOMB_METRICS_ENDPOINT,
        HONEYCOMB_API_KEY: process.env.HONEYCOMB_API_KEY,
        HONEYCOMB_TRACES_APIKEY: process.env.HONEYCOMB_TRACES_APIKEY || process.env.HONEYCOMB_API_KEY,
        HONEYCOMB_METRICS_APIKEY: process.env.HONEYCOMB_METRICS_APIKEY || process.env.HONEYCOMB_API_KEY,
        HONEYCOMB_DATASET: process.env.HONEYCOMB_DATASET,
        HONEYCOMB_METRICS_DATASET: process.env.HOENYCOMB_METRICS_DATASET,
        SAMPLE_RATE: parseSampleRate(process.env.SAMPLE_RATE),
        DEBUG: parseBoolean(process.env.DEBUG),
        HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS: parseBoolean(process.env.HONEYCOMB_ENABLE_LOCAL_VISUALIZATIONS),
        OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
        OTEL_EXPORTER_OTLP_PROTOCOL: parseOtlpProtocol(process.env.OTEL_EXPORTER_OTLP_PROTOCOL),
    };
};
exports.getHoneycombEnv = getHoneycombEnv;
function parseSampleRate(sampleRateStr) {
    if (sampleRateStr) {
        const sampleRate = parseInt(sampleRateStr);
        if (!isNaN(sampleRate) && sampleRate > 1) {
            return sampleRate;
        }
    }
}
function parseBoolean(value) {
    if (value) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
    }
}
function parseOtlpProtocol(protocol) {
    if (exports.OtlpProtocols.includes(protocol)) {
        return protocol;
    }
}
function getTracesApiKey(env, options) {
    return (env.HONEYCOMB_TRACES_APIKEY ||
        env.HONEYCOMB_API_KEY ||
        options.tracesApiKey ||
        options.apiKey);
}
function getMetricsApiKey(env, options) {
    return (env.HONEYCOMB_METRICS_APIKEY ||
        env.HONEYCOMB_API_KEY ||
        options.metricsApiKey ||
        options.apiKey);
}
function getEndpoint(env, options) {
    return (env.HONEYCOMB_API_ENDPOINT || (options === null || options === void 0 ? void 0 : options.endpoint) || exports.DEFAULT_API_ENDPOINT);
}
/**
 * Gets the traces endpoint to export telemetry using environment variables and options.
 *
 * When sending over HTTP protocols, the endpoint will include the path '/v1/traces' if
 * set via HONEYCOMB_API_ENDPOINT or the endpoint option. The path is not appended for
 * endpoints set via HONEYCOMB_TRACES_ENDPOINT or the tracesEndpoint option.
 */
function getTracesEndpoint(env, options, protocol) {
    if (env.HONEYCOMB_TRACES_ENDPOINT) {
        return env.HONEYCOMB_TRACES_ENDPOINT;
    }
    if (env.HONEYCOMB_API_ENDPOINT) {
        return maybeAppendTracesPath(env.HONEYCOMB_API_ENDPOINT, protocol);
    }
    if (options.tracesEndpoint) {
        return options.tracesEndpoint;
    }
    if (options.endpoint) {
        return maybeAppendTracesPath(options.endpoint, protocol);
    }
    return maybeAppendTracesPath(exports.DEFAULT_API_ENDPOINT, protocol);
}
/**
 * Gets the metrics endpoint to export telemetry using environment variables and options.
 *
 * When sending over HTTP protocols, the endpoint will include the path '/v1/metrics' if
 * set via HONEYCOMB_API_ENDPOINT or the endpoint option. The path is not appended for
 * endpoints set via HONEYCOMB_METRICS_ENDPOINT or the metricsEndpoint option.
 */
function getMetricsEndpoint(env, options, protocol) {
    if (env.HONEYCOMB_METRICS_ENDPOINT) {
        return env.HONEYCOMB_METRICS_ENDPOINT;
    }
    if (env.HONEYCOMB_API_ENDPOINT) {
        return maybeAppendMetricsPath(env.HONEYCOMB_API_ENDPOINT, protocol);
    }
    if (options.metricsEndpoint) {
        return options.metricsEndpoint;
    }
    if (options.endpoint) {
        return maybeAppendMetricsPath(options.endpoint, protocol);
    }
    return maybeAppendMetricsPath(exports.DEFAULT_API_ENDPOINT, protocol);
}
function getSampleRate(env, options) {
    if (env.SAMPLE_RATE && env.SAMPLE_RATE > 0) {
        return env.SAMPLE_RATE;
    }
    else if (options.sampleRate && options.sampleRate > 0) {
        return options.sampleRate;
    }
    return exports.DEFAULT_SAMPLE_RATE;
}
function isHttpProtocol(protcol) {
    switch (protcol) {
        case 'http/json':
        case 'http/protobuf':
            return true;
    }
    return false;
}
/**
 * Checks for and appends v1/traces to provided URL if missing when using an HTTP
 * based exporter protocol.
 *
 * @param url the base URL to append traces path to if missing
 * @param protocol the exporter protocol to send telemetry
 * @returns the endpoint with traces path appended if missing
 */
function maybeAppendTracesPath(url, protocol) {
    if (isHttpProtocol(protocol) && !(url === null || url === void 0 ? void 0 : url.endsWith('v1/traces'))) {
        return url.endsWith('/') ? url + 'v1/traces' : url + '/v1/traces';
    }
    return url;
}
exports.maybeAppendTracesPath = maybeAppendTracesPath;
/**
 * Checks for and appends v1/metrics to provided URL if missingwhen using an HTTP
 * based exporter protocol.
 *
 * @param url the base URL to append traces path to if missing
 * @param protocol the exporter protocol to send telemetry
 * @returns the endpoint with traces path appended if missing
 */
function maybeAppendMetricsPath(url, protocol) {
    if (isHttpProtocol(protocol) && !(url === null || url === void 0 ? void 0 : url.endsWith('v1/metrics'))) {
        return url.endsWith('/') ? url + 'v1/metrics' : url + '/v1/metrics';
    }
    return url;
}
exports.maybeAppendMetricsPath = maybeAppendMetricsPath;
