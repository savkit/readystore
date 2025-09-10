import { CollectionStoreItem } from '../models/collection-item.model';

export function deleteCollectionItem<R, Key = string>(
  collection: Map<Key, CollectionStoreItem<R>>,
  id: Key,
): void {
  collection.delete(id);
}
