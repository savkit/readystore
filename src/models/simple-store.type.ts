import { WritableSignal } from '@angular/core';
import { LoadState } from './load-state.type';

export type SimpleStore<R> = WritableSignal<LoadState<R>>;
