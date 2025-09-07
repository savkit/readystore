import { Signal } from '@angular/core';

export type SignalValue<S> = S extends Signal<infer V> ? NonNullable<V> : never;
