import { CollectionStoreItem } from '../models/collection-item.model';

export function deleteCollectionItem<R, Key>(
  collection: Map<Key, CollectionStoreItem<R>>,
  id: Key,
): void {
  collection.delete(id);
}
