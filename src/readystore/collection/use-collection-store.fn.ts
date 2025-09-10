import { effect, signal, Signal } from '@angular/core';
import { SignalValue } from '../models/signal-value.type';
import { StoreAsync } from '../models/async-store.model';
import { AsyncCollectionStore } from './models/async-collection-store.model';
import { CollectionStoreItem } from './models/collection-item.model';
import { resetAll } from './utils/reset-all.fn';
import { resetState } from './utils/reset-state.fn';
import { updateData } from './utils/update-data.fn';
import { deleteCollectionItem } from './utils/delete.fn';
import { getStateNormal } from './utils/get-state-normal.fn';

/**
 *
 */
export function useCollectionStore<
  R,
  Sources extends readonly Signal<unknown>[] = readonly Signal<unknown>[],
>(
  sources?: Sources,
  resolveFn?: (id: string, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => R,
): AsyncCollectionStore<R> {
  const collection = new Map<string, CollectionStoreItem<R>>();

  // If there are no sources, then activate data chain by default.
  const $allAvailable = signal(!sources?.length);
  let lastValues: {
    [K in keyof Sources]: SignalValue<Sources[K]>;
  };

  // If not resources, then no need to track changes.
  if (!sources?.length) {
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
  }

  const getState = (id: string): StoreAsync<R> => {
    return getStateNormal(collection, id, $allAvailable, lastValues, resolveFn);
  };

  return {
    getState: (id: string): StoreAsync<R> => getState(id),
    resetAll: (): void => resetAll(collection),
    resetState: (id: string): void => resetState(collection, id),
    getData: (id: string) => getState(id).$data,
    updateData: (id: string, data: R) => updateData(collection, id, data),
    delete: (id: string): void => deleteCollectionItem(collection, id),
  };
}
