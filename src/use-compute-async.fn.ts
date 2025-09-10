import {effect, signal, Signal} from '@angular/core';
import {SignalValue} from './models/signal-value.type';


/**
 *
 *
 * @param source {Signal<any>} - signal property.
 * @param computeFn - resolve function.
 */
export function useComputeAsync<R, Source extends Signal<any>>(
  source: Source,
  computeFn: (value: SignalValue<Source>) => Promise<R>
): Signal<R | undefined> {
  const $asyncResult = signal<R | undefined>(undefined);
  let versionCounter = 0;

  effect(() => {
    const value = source() as SignalValue<Source>;
    if (value !== undefined) {
      const currentVersion = ++versionCounter;
      computeFn(value)
        .then((data) => {
          if (data !== undefined) {
            if (currentVersion === versionCounter) {
              $asyncResult.set(data);
            }
          }
        })
        .catch(() => {
          if (currentVersion === versionCounter) {
            $asyncResult.set(undefined);
          }
        });
    } else {
      versionCounter++;
      $asyncResult.set(undefined);
    }
  });

  return $asyncResult;
}
