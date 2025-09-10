import {computed, Signal, signal} from '@angular/core';
import {StoreAsync} from '../../models/async-store.model';
import {AsyncState} from '../../models/load-state.type';
import {SignalValue} from '../../models/signal-value.type';
import {CollectionStoreItem} from "../models/collection-item.model";
import {loadAsync} from "./load-async.fn";
import {resetState} from "./reset-state.fn";

export function getStateAsync<R, Sources extends readonly Signal<any>[]>(
  collection: Map<string, CollectionStoreItem<R>>,
  id: string,
  $allAvailable: Signal<boolean>,
  lastValues: { [K in keyof Sources]: SignalValue<Sources[K]> },
  asyncFn: (id: string, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Promise<R>
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
          loadAsync(id, storeItem, asyncFn, lastValues);
        }
      }
      return state;
    }),
    () => resetState(collection, id)
  );
}
