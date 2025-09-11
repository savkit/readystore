import { CollectionStoreItem } from '../models/collection-item.model';
import { AsyncState } from '../../models/load-state.type';
import { SignalValue } from '../../models/signal-value.type';
import { Signal } from '@angular/core';

export function loadAsync<
  R,
  Key,
  Sources extends readonly Signal<unknown>[] = readonly Signal<unknown>[],
>(
  id: Key,
  storeItem: CollectionStoreItem<R>,
  asyncFn: (id: Key, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Promise<R>,
  values: { [K in keyof Sources]: SignalValue<Sources[K]> },
): void {
  const currentVersion = ++storeItem.versionCounters;
  storeItem.states = 'LOADING';

  setTimeout(() => {
    storeItem.$state.set(new AsyncState<R>(undefined, 'LOADING'));
    asyncFn(id, values)
      .then((data) => {
        if (currentVersion === storeItem.versionCounters) {
          storeItem.states = 'LOADED';
          storeItem.$state.set(new AsyncState(data, 'LOADED'));
        }
      })
      .catch((error) => {
        if (currentVersion === storeItem.versionCounters) {
          storeItem.states = 'ERROR';
          storeItem.$state.set(new AsyncState<R>(undefined, 'ERROR', error));
        }
      });
  });
}
