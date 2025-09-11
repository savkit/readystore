import { computed, effect, signal, Signal } from '@angular/core';
import { SignalValue } from '../models/signal-value.type';
import { AsyncState, StateStatus } from '../models/load-state.type';
import { StoreAsync } from '../models/async-store.model';

/**
 *
 */
export function useStore<R, Sources extends readonly Signal<unknown>[]>(
  asyncFn: (values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => R,
  sources?: Sources,
): StoreAsync<R> {
  const $state = signal<AsyncState<R>>(new AsyncState<R>());
  let state: StateStatus = 'NOT_LOADED';
  let versionCounter = 0;
  let activated = false;

  const $triggerAsync = signal(0);

  effect(() => {
    $triggerAsync();
    if (!activated) {
      return;
    }
    const values = (sources ?? []).map((source) => source()) as {
      [K in keyof Sources]: SignalValue<Sources[K]>;
    };
    const allAvailable = values.every((value) => value !== undefined);
    if (allAvailable) {
      const currentVersion = ++versionCounter;
      state = 'LOADING';
      $state.set(new AsyncState<R>(undefined, 'LOADING'));
      try {
        const data = asyncFn(values);
        if (currentVersion === versionCounter) {
          state = 'LOADED';
          $state.set(new AsyncState(data, 'LOADED'));
        }
      } catch (error: unknown) {
        if (currentVersion === versionCounter) {
          state = 'ERROR';
          $state.set(new AsyncState<R>(undefined, 'ERROR', error));
        }
      }
    } else {
      versionCounter++;
      if (state !== 'NOT_LOADED') {
        state = 'NOT_LOADED';
        $state.set(new AsyncState());
      }
    }
  });

  const reset = (): void => {
    $state.set(new AsyncState());
  };

  return new StoreAsync(
    computed(() => {
      activated = true;
      const state = $state();
      if (state.status === 'NOT_LOADED') {
        // One way to update and trigger effect when there are available subscribers and avoid Angular console error.
        setTimeout(() => {
          $triggerAsync.update((prev) => ++prev);
        });
      }
      return state;
    }),
    reset,
  );
}
