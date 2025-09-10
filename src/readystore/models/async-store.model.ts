import { computed, Signal } from '@angular/core';
import { AsyncState } from './load-state.type';

export class StoreAsync<R> {
  readonly $data: Signal<R | undefined>;
  readonly $loading: Signal<boolean>;
  readonly $ready: Signal<boolean>;
  readonly $error: Signal<unknown>;

  constructor(
    public readonly $state: Signal<AsyncState<R>>,
    public readonly reset: () => void,
  ) {
    this.$data = computed(() => $state().data);
    this.$loading = computed(() => $state().status === 'LOADING');
    this.$ready = computed(() => $state().status === 'LOADED');
    this.$error = computed(() => $state().error);
  }
}
