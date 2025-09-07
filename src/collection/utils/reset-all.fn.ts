import {CollectionStoreItem} from '../models/collection-item.model';
import {AsyncState} from '../../models/load-state.type';

export function resetAll<R>(collection: Map<string, CollectionStoreItem<R>>): void {
  for (const storeItem of collection.values()) {
    if (storeItem.states !== 'NOT_LOADED') {
      storeItem.states = 'NOT_LOADED';
      storeItem.versionCounters++;
      storeItem.$state.set(new AsyncState());
    }
  }
}
