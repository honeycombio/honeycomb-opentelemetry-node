"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoneycombSDK = void 0;
const sdk_node_1 = require("@opentelemetry/sdk-node");
const deterministic_sampler_1 = require("./deterministic-sampler");
const baggage_span_processor_1 = require("./baggage-span-processor");
const honeycomb_options_1 = require("./honeycomb-options");
const resource_builder_1 = require("./resource-builder");
const api_1 = require("@opentelemetry/api");
/**
 * @class
 * @classdesc Extends the OpenTelemetry NodeSDK class with Honeycomb specific configuration.
 * @param options The HoneycombOptions used to configure the exporter.
 * HoneycombOptions extends OpenTelemetry NodeSDKConfiguration.
 */
class HoneycombSDK extends sdk_node_1.NodeSDK {
    constructor(options) {
        const opts = (0, honeycomb_options_1.computeOptions)(options);
        super(Object.assign(Object.assign({}, opts), { serviceName: opts === null || opts === void 0 ? void 0 : opts.serviceName, resource: (0, resource_builder_1.configureHoneycombResource)(), 
            // metricReader: honeycombMetricsReader(opts),
            spanProcessor: (0, baggage_span_processor_1.configureBatchWithBaggageSpanProcessor)(opts), sampler: (0, deterministic_sampler_1.configureDeterministicSampler)(opts === null || opts === void 0 ? void 0 : opts.sampleRate) }));
        if (opts.debug) {
            api_1.diag.setLogger(new api_1.DiagConsoleLogger(), api_1.DiagLogLevel.DEBUG);
            api_1.diag.debug(JSON.stringify(opts, null, 2));
        }
    }
}
exports.HoneycombSDK = HoneycombSDK;
