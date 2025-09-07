import {CollectionStoreItem} from '../models/collection-item.model';
import {AsyncState} from '../../models/load-state.type';

export function resetState<R>(collection: Map<string, CollectionStoreItem<R>>, id: string): void {
  const store = collection.get(id);
  if (store) {
    store.$state.set(new AsyncState());
  }
}
