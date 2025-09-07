import { SimpleStore } from './simple-store.type';

export type CollectionStore<R> = Map<string, SimpleStore<R>>;
