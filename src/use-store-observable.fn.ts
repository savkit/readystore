import {computed, DestroyRef, effect, inject, signal, Signal} from '@angular/core';
import {SignalValue} from './models/signal-value.type';
import {AsyncState, StateStatus} from './models/load-state.type';
import {StoreAsync} from './models/async-store.model';
import {Observable, Subscription} from 'rxjs';

/**
 *
 *
 */
export function useStore$<R, Sources extends readonly Signal<any>[]>(
  asyncFn: (values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Observable<R>,
  sources?: Sources
): StoreAsync<R> {
  const destroyRef = inject(DestroyRef);
  const $state = signal<AsyncState<R>>(new AsyncState<R>());
  let state: StateStatus = 'NOT_LOADED';
  let versionCounter = 0;
  let activated = false;

  const $triggerAsync = signal(0);
  let currentSubscription: Subscription | null = null;

  effect(() => {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
    }
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
      currentSubscription = asyncFn(values).subscribe({
        next: (data) => {
          if (currentVersion === versionCounter) {
            state = "LOADED"
            $state.set(new AsyncState(data, 'LOADED'));
          }
        },
        error: (error) => {
          if (currentVersion === versionCounter) {
            state = "ERROR"
            $state.set(new AsyncState<R>(undefined, 'ERROR', error?.message));
          }
        }
      });
    } else {
      versionCounter++;
      if (state !== 'NOT_LOADED') {
        state = "NOT_LOADED"
        $state.set(new AsyncState());
      }
    }
  })

  const reset = (): void => {
    $state.set(new AsyncState());
  }

  destroyRef.onDestroy(() => {
    currentSubscription?.unsubscribe();
  });

  return new StoreAsync(computed(() => {
    activated = true;
    const state = $state();
    if (state.status === 'NOT_LOADED') {
      // One way to update and trigger effect when there are available subscribers and avoid Angular console error.
      setTimeout(() => {
        $triggerAsync.update(prev => ++prev);
      });
    }
    return state;
  }), reset);
}

