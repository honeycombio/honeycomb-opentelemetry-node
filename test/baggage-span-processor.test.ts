import { BaggageSpanProcessor } from '../src/baggage-span-processor';
import {
  propagation,
  ROOT_CONTEXT,
  SpanKind,
  TraceFlags,
} from '@opentelemetry/api';
import { BasicTracerProvider, Span } from '@opentelemetry/sdk-trace-base';

describe('BaggageSpanProcessor', () => {
  const baggageProcessor = new BaggageSpanProcessor();

  const bag = propagation.createBaggage({
    brand: { value: 'samsonite' },
  });

  const expectedAttrs = {
    brand: 'samsonite',
  };

  const span = new Span(
    new BasicTracerProvider().getTracer('baggage-testing'),
    ROOT_CONTEXT,
    'Edward W. Span',
    {
      traceId: 'e4cda95b652f4a1592b449d5929fda1b',
      spanId: '7e0c63257de34c92',
      traceFlags: TraceFlags.SAMPLED,
    },
    SpanKind.SERVER,
  );

  test('transforms entries from Baggage into Attributes', () => {
    const attrs = baggageProcessor.transformBaggageEntries(bag.getAllEntries());

    expect(attrs).toEqual(expectedAttrs);
  });

  test('with setAttributes and separate transform function', () => {
    expect(span.attributes).toEqual({});
    const ctx = propagation.setBaggage(ROOT_CONTEXT, bag);

    baggageProcessor.onStart(span, ctx);

    expect(span.attributes).toEqual(expectedAttrs);
  });

  test('with an onStart that uses forEach and setAttribute', () => {
    expect(span.attributes).toEqual({});
    const ctx = propagation.setBaggage(ROOT_CONTEXT, bag);

    baggageProcessor.forEachOnStart(span, ctx);

    expect(span.attributes).toEqual(expectedAttrs);
  });
});
