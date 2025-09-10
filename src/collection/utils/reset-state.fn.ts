import { CollectionStoreItem } from '../models/collection-item.model';
import { AsyncState } from '../../models/load-state.type';

export function resetState<R, Key = string>(
  collection: Map<Key, CollectionStoreItem<R>>,
  id: Key,
): void {
  const store = collection.get(id);
  if (store) {
    store.$state.set(new AsyncState());
  }
}
