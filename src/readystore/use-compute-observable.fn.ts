import { DestroyRef, effect, inject, signal, Signal } from '@angular/core';
import { SignalValue } from './models/signal-value.type';
import { Observable, Subscription } from 'rxjs';

/**
 *
 * @param source {Signal<any>} - signal property.
 * @param computeFn - resolve function.
 */
export function useCompute$<R, Source extends Signal<unknown>>(
  source: Source,
  computeFn: (value: SignalValue<Source>) => Observable<R>,
): Signal<R | undefined> {
  const destroyRef = inject(DestroyRef);
  const asyncResult$ = signal<R | undefined>(undefined);
  let currentSubscription: Subscription | null = null;

  effect(() => {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
    }
    const value = source() as SignalValue<Source>;
    if (value !== undefined) {
      currentSubscription = computeFn(value).subscribe({
        next: (data) => {
          asyncResult$.set(data);
        },
        error: () => {
          asyncResult$.set(undefined);
        },
      });
    } else {
      asyncResult$.set(undefined);
    }
  });

  destroyRef.onDestroy(() => {
    currentSubscription?.unsubscribe();
  });

  return asyncResult$;
}
