import { effect, signal, Signal } from '@angular/core';
import { SignalValue } from '../models/signal-value.type';
import { StoreAsync } from '../models/async-store.model';
import { AsyncCollectionStore } from './models/async-collection-store.model';
import { CollectionStoreItem } from './models/collection-item.model';
import { resetAll } from './utils/reset-all.fn';
import { resetState } from './utils/reset-state.fn';
import { getStateAsync } from './utils/get-state-async.fn';
import { updateData } from './utils/update-data.fn';
import { deleteCollectionItem } from './utils/delete.fn';

/**
 *
 */
export function useCollectionStoreAsync<
  R,
  Key = number,
  Sources extends readonly Signal<unknown>[] = readonly Signal<unknown>[],
>(
  sources: Sources,
  asyncFn: (id: Key, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Promise<R>,
): AsyncCollectionStore<R, Key> {
  const collection = new Map<Key, CollectionStoreItem<R>>();

  const $allAvailable = signal(false);
  let lastValues: {
    [K in keyof Sources]: SignalValue<Sources[K]>;
  };

  // Якщо виникає зміна залежностей, потрібно перевірити чи всі вони присутні, і очистити попередні дані.
  // Також ми нотифікуємо інформацію про те чи доступні всі залежності чи ні, щою всі підписки які існужть змогли
  // асинхронно підгрузити дані, якщо їх нема.
  effect(() => {
    lastValues = (sources ?? []).map((source) => source()) as {
      [K in keyof Sources]: SignalValue<Sources[K]>;
    };
    const allAvailable = lastValues.every((value) => value !== undefined);
    $allAvailable.set(allAvailable);

    // Коли відбувається зміна, тоді чистимо всі дані.
    resetAll(collection);
  });

  const getState = (id: Key): StoreAsync<R> => {
    return getStateAsync(collection, id, $allAvailable, lastValues, asyncFn);
  };

  return {
    getState: (id: Key): StoreAsync<R> => getState(id),
    resetAll: (): void => resetAll(collection),
    resetState: (id: Key): void => resetState(collection, id),
    getData: (id: Key) => getState(id).$data,
    updateData: (id: Key, data: R) => updateData(collection, id, data),
    delete: (id: Key): void => deleteCollectionItem(collection, id),
  };
}
