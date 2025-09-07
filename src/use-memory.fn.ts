import {computed, Signal} from '@angular/core';

/**
 * Do computation.
 * If computation is "undefined", return previous result.
 * If computation is not "undefined", return computation result.
 *
 * @param computationFn - Computation function.
 */
export function useMemory<R>(computationFn: () => R | undefined): Signal<R | undefined> {
  let lastValue: R | undefined;

  return computed(() => {
    const current = computationFn();
    if (current !== undefined) {
      lastValue = current;
    }

    return lastValue;
  });
}
