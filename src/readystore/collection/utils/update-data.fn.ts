import { CollectionStoreItem } from '../models/collection-item.model';
import { AsyncState } from '../../models/load-state.type';

export function updateData<R, Key = string>(
  collection: Map<Key, CollectionStoreItem<R>>,
  id: Key,
  data: R,
): void {
  const store = collection.get(id);
  if (store) {
    store.$state.update((prevState) => new AsyncState(data, prevState.status, prevState.error));
  }
}
