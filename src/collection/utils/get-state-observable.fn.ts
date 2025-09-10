import { Observable } from 'rxjs';
import { computed, Signal, signal } from '@angular/core';
import { StoreAsync } from '../../models/async-store.model';
import { AsyncState } from '../../models/load-state.type';
import { SignalValue } from '../../models/signal-value.type';
import { CollectionStoreItem } from '../models/collection-item.model';
import { load$ } from './load-observable.fn';
import { resetState } from './reset-state.fn';

export function getStateObservable<
  R,
  Key = string,
  Sources extends readonly Signal<unknown>[] = readonly Signal<unknown>[],
>(
  collection: Map<Key, CollectionStoreItem<R>>,
  id: Key,
  $allAvailable: Signal<boolean>,
  lastValues: { [K in keyof Sources]: SignalValue<Sources[K]> },
  asyncFn: (id: Key, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Observable<R>,
): StoreAsync<R> {
  const storeItem = collection.get(id) ?? new CollectionStoreItem<R>(signal(new AsyncState<R>()));
  if (!collection.has(id)) {
    collection.set(id, storeItem);
  }

  return new StoreAsync(
    computed(() => {
      const state = storeItem.$state();
      // If all dependencies are present, check if data is loaded, if not then load it.
      // This way we also prevent loading async data when not all dependencies are available.

      if ($allAvailable()) {
        if (state.status === 'NOT_LOADED') {
          load$(id, storeItem, asyncFn, lastValues);
        }
      }
      return state;
    }),
    () => resetState(collection, id),
  );
}
