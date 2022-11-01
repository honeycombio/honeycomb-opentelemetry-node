import { Context, SpanKind, Attributes, Link } from '@opentelemetry/api';
import {
  Sampler,
  SamplingResult,
  AlwaysOnSampler,
  AlwaysOffSampler,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';
import { DEFAULT_SAMPLE_RATE } from './honeycomb-options';

export function configureDeterministicSampler(sampleRate?: number) {
  return new DeterministicSampler(sampleRate || DEFAULT_SAMPLE_RATE);
}

export class DeterministicSampler implements Sampler {
  private _sampleRate: number;
  private _sampler: Sampler;

  constructor(sampleRate: number) {
    this._sampleRate = sampleRate;
    switch (sampleRate) {
      case 0:
        this._sampler = new AlwaysOffSampler();
        break;
      case 1:
        this._sampler = new AlwaysOnSampler();
        break;
      default: {
        const ratio = 1.0 / sampleRate;
        this._sampler = new TraceIdRatioBasedSampler(ratio);
        break;
      }
    }
  }

  shouldSample(
    context: Context,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: Link[],
  ): SamplingResult {
    const result = this._sampler.shouldSample(
      context,
      traceId,
      spanName,
      spanKind,
      attributes,
      links,
    );
    return {
      decision: result.decision,
      attributes: {
        SampleRate: this._sampleRate,
      },
    };
  }

  toString(): string {
    return `DeterministicSampler(${this._sampler.toString()})`;
  }
}
