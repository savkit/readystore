import {AsyncState, StateStatus} from '../../models/load-state.type';
import {WritableSignal} from '@angular/core';
import {Subscription} from 'rxjs';

export class CollectionStoreItem<R> {
  states: StateStatus = 'NOT_LOADED';
  versionCounters: number = 0;
  lastSubscription: Subscription | null = null;

  constructor(public readonly $state: WritableSignal<AsyncState<R>>) {
  }
}
