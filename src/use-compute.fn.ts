import { computed, Signal } from '@angular/core';
import { SignalValue } from './models/signal-value.type';

/**
 * Execute combinedFn when source is not undefined. Avoid calculation when source is empty.
 *
 * @param source {Signal<any>} - signal property.
 * @param computeFn - resolve function.
 */
export function useCompute<R, Source extends Signal<unknown>>(
  source: Source,
  computeFn: (value: SignalValue<Source>) => R,
): Signal<R | undefined> {
  return computed(() => {
    const value = source() as SignalValue<Source>;
    return value === undefined ? undefined : computeFn(value);
  });
}
