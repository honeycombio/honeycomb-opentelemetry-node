import { Attributes, Context, Link, SpanKind } from '@opentelemetry/api';
import { Sampler, SamplingResult } from '@opentelemetry/sdk-trace-base';
export declare function configureDeterministicSampler(sampleRate?: number): DeterministicSampler;
export declare class DeterministicSampler implements Sampler {
    private _sampleRate;
    private _sampler;
    constructor(sampleRate: number);
    shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: Attributes, links: Link[]): SamplingResult;
    toString(): string;
}
