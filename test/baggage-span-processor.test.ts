import { BaggageSpanProcessor } from '../src/baggage-span-processor';
import {
  propagation,
  baggageEntryMetadataFromString,
} from '@opentelemetry/api';

test('transforms entries from Baggage into Attributes', () => {
  const baggageProcessor = new BaggageSpanProcessor();

  const luggage = propagation.createBaggage({
    key1: { value: 'd4cda95b652f4a1592b449d5929fda1b' },
    'with/slash': { value: 'with spaces' },
    key3: { value: 'c88815a7-0fa9-4d95-a1f1-cdccce3c5c2a' },
    key4: {
      value: 'foo',
      metadata: baggageEntryMetadataFromString(
        'key4prop1=value1;key4prop2=value2;key4prop3WithNoValue',
      ),
    },
  });

  const attrs = baggageProcessor.transformBaggageEntries(
    luggage.getAllEntries(),
  );

  expect(attrs).toEqual({
    key1: 'd4cda95b652f4a1592b449d5929fda1b',
    key3: 'c88815a7-0fa9-4d95-a1f1-cdccce3c5c2a',
    key4: 'foo',
    'with/slash': 'with spaces',
  });
});
