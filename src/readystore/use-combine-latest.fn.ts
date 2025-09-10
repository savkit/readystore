import { computed, Signal } from '@angular/core';
import { SignalValue } from './models/signal-value.type';

export type SourceValues<Sources extends readonly Signal<unknown>[]> = {
  [K in keyof Sources]: SignalValue<Sources[K]>;
};

export function useCombineLatest<Sources extends readonly Signal<unknown>[]>(
  sources: Sources,
): Signal<SourceValues<Sources> | undefined> {
  return computed(() => {
    const values = sources.map((source) => source()) as SourceValues<Sources>;
    return values.every((value) => value !== undefined) ? values : undefined;
  });
}
