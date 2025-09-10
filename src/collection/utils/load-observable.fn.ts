import {CollectionStoreItem} from '../models/collection-item.model';
import {AsyncState} from '../../models/load-state.type';
import {SignalValue} from '../../models/signal-value.type';
import {Signal} from '@angular/core';
import {Observable} from 'rxjs';

export function load$<R, Key = string, Sources extends readonly Signal<any>[] = readonly Signal<any>[]>(
  id: Key,
  storeItem: CollectionStoreItem<R>,
  asyncFn: (id: Key, values: { [K in keyof Sources]: SignalValue<Sources[K]> }) => Observable<R>,
  values: { [K in keyof Sources]: SignalValue<Sources[K]> }
): void {
  const currentVersion = ++storeItem.versionCounters;
  storeItem.states = 'LOADING';

  setTimeout(() => {
    storeItem.$state.set(new AsyncState<R>(undefined, 'LOADING'));
    storeItem.lastSubscription = asyncFn(id, values).subscribe({
      next: (data: R) => {
        if (currentVersion === storeItem.versionCounters) {
          storeItem.states = 'LOADED';
          storeItem.$state.set(new AsyncState(data, 'LOADED'));
        }
      },
      error: (error: any) => {
        if (currentVersion === storeItem.versionCounters) {
          storeItem.states = 'ERROR';
          storeItem.$state.set(new AsyncState<R>(undefined, 'ERROR', error));
        }
      }
    });
  });
}
