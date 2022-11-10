import { computeOptions, HoneycombOptions } from './honeycomb-options';
import { InstrumentationOption } from '@opentelemetry/instrumentation';

/**
 * Builds and returns an Opentelemetry Instrumentation Option
 * @param options The {@link HoneycombOptions} used to configure the instrumentations
 * @returns an InstrumentationOption, with default of no instrumentations included
 */
export function configureInstrumentations(
  options: HoneycombOptions,
): InstrumentationOption[] {
  let instr: InstrumentationOption[] = [];
  const opts = computeOptions(options);
  if (opts?.instrumentations) {
    instr = opts?.instrumentations;
  }
  return instr;
}
