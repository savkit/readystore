import {StoreAsync} from '../../models/async-store.model';

export type AsyncCollectionStore<R> = {
  getState: (id: string) => StoreAsync<R>;
  resetAll: () => void;
  resetState: (id: string) => void;
}
