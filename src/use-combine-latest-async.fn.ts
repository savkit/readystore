import {effect, signal, Signal} from '@angular/core';
import {SignalValue} from './models/signal-value.type';

export function useCombineLatestAsync<R, Sources extends readonly Signal<any>[]>(
  sources: Sources,
  asyncFn: (values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Promise<R>
): Signal<R | undefined> {
  const $asyncResult = signal<R | undefined>(undefined);
  let versionCounter = 0;

  effect(() => {
    const values = sources.map((source) => source()) as {
      [K in keyof Sources]: SignalValue<Sources[K]>;
    };
    if (values.every((value) => value !== undefined)) {
      const currentVersion = ++versionCounter;
      asyncFn(values)
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
