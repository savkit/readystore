import { CollectionStoreItem } from '../models/collection-item.model';
import { AsyncState } from '../../models/load-state.type';
import { SignalValue } from '../../models/signal-value.type';
import { Signal } from '@angular/core';

export function load<R, Sources extends readonly Signal<unknown>[]>(
  id: string,
  storeItem: CollectionStoreItem<R>,
  values: { [K in keyof Sources]: SignalValue<Sources[K]> },
  resolveFn: (id: string, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => R,
): void {
  const currentVersion = ++storeItem.versionCounters;
  storeItem.states = 'LOADING';

  setTimeout(() => {
    storeItem.$state.set(new AsyncState<R>(undefined, 'LOADING'));
    try {
      const result = resolveFn(id, values);
      if (currentVersion === storeItem.versionCounters) {
        storeItem.states = 'LOADED';
        storeItem.$state.set(new AsyncState(result, 'LOADED'));
      }
    } catch (error: unknown) {
      if (currentVersion === storeItem.versionCounters) {
        storeItem.states = 'ERROR';
        storeItem.$state.set(new AsyncState<R>(undefined, 'ERROR', error));
      }
    }
  });
}
