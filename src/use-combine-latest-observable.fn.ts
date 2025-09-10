import { DestroyRef, effect, inject, signal, Signal } from '@angular/core';
import { SignalValue } from './models/signal-value.type';
import { Observable, Subscription } from 'rxjs';

export function useCombineLatest$<R, Sources extends readonly Signal<unknown>[]>(
  sources: Sources,
  asyncFn: (values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Observable<R>,
): Signal<R | undefined> {
  const destroyRef = inject(DestroyRef);
  const $asyncResult = signal<R | undefined>(undefined);
  let currentSubscription: Subscription | null = null;

  effect(() => {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
    }
    const values = sources.map((source) => source()) as {
      [K in keyof Sources]: SignalValue<Sources[K]>;
    };
    if (values.every((value) => value !== undefined)) {
      currentSubscription = asyncFn(values).subscribe({
        next: (data) => {
          $asyncResult.set(data);
        },
        error: () => {
          $asyncResult.set(undefined);
        },
      });
    } else {
      $asyncResult.set(undefined);
    }
  });

  destroyRef.onDestroy(() => {
    currentSubscription?.unsubscribe();
  });

  return $asyncResult;
}
