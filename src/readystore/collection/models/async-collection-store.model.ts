import { StoreAsync } from '../../models/async-store.model';
import { Signal } from '@angular/core';

export type AsyncCollectionStore<R, Key = string> = {
  getState: (id: Key) => StoreAsync<R>;
  getData: (id: Key) => Signal<R | undefined>;
  resetAll: () => void;
  resetState: (id: Key) => void;
};
