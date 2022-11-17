"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeterministicSampler = exports.configureDeterministicSampler = void 0;
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const honeycomb_options_1 = require("./honeycomb-options");
function configureDeterministicSampler(sampleRate) {
    return new DeterministicSampler(sampleRate === undefined ? honeycomb_options_1.DEFAULT_SAMPLE_RATE : sampleRate);
}
exports.configureDeterministicSampler = configureDeterministicSampler;
class DeterministicSampler {
    constructor(sampleRate) {
        this._sampleRate = sampleRate;
        switch (sampleRate) {
            case 0:
                this._sampler = new sdk_trace_base_1.AlwaysOffSampler();
                break;
            case 1:
                this._sampler = new sdk_trace_base_1.AlwaysOnSampler();
                break;
            default: {
                const ratio = 1.0 / sampleRate;
                this._sampler = new sdk_trace_base_1.TraceIdRatioBasedSampler(ratio);
                break;
            }
        }
    }
    shouldSample(context, traceId, spanName, spanKind, attributes, links) {
        const result = this._sampler.shouldSample(context, traceId, spanName, spanKind, attributes, links);
        return Object.assign(Object.assign({}, result), { attributes: Object.assign(Object.assign({}, result.attributes), { SampleRate: this._sampleRate }) });
    }
    toString() {
        return `DeterministicSampler(${this._sampler.toString()})`;
    }
}
exports.DeterministicSampler = DeterministicSampler;
