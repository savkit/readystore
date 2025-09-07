import {computed, effect, signal, Signal} from '@angular/core';
import {SignalValue} from '../models/signal-value.type';
import {AsyncState} from '../models/load-state.type';
import {StoreAsync} from '../models/async-store.model';
import {AsyncCollectionStore} from './models/async-collection-store.model';
import {CollectionStoreItem} from './models/collection-item.model';
import {resetAll} from './utils/reset-all.fn';
import {resetState} from './utils/reset-state.fn';
import {Observable} from 'rxjs';
import {load$} from './utils/load-observable.fn';

/**
 *
 *
 */
export function useCollectionStore$<R, Sources extends readonly Signal<any>[]>(
  asyncFn: (values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Observable<R>,
  sources?: Sources
): AsyncCollectionStore<R> {
  const collections = new Map<string, CollectionStoreItem<R>>();

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
    $allAvailable.set(allAvailable)

    // Коли відбувається зміна, тоді чистимо всі дані.
    resetAll(collections);
  })

  return {
    getState: (id: string): StoreAsync<R> => {
      const storeItem = collections.get(id) ?? new CollectionStoreItem<R>(signal(new AsyncState<R>()));
      if (!collections.has(id)) {
        collections.set(id, storeItem);
      }

      return new StoreAsync(computed(() => {
        const state = storeItem.$state();
        // Якщо всі залежності присутні, перевіряємо чи дані підгружені, якщо ні то підгружаємо.
        // Також таким чином ми забороняємо завантаження асинхронних даних коли нема всіх залежностей.

        if ($allAvailable()) {
          if (state.status === 'NOT_LOADED') {
            load$(storeItem, asyncFn, lastValues);
          }
        }
        return state;
      }), () => resetState(collections, id));
    },
    resetAll: (): void => resetAll(collections),
    resetState: (id: string): void => resetState(collections, id),
  }
}

