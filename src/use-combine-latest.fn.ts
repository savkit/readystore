import {computed, Signal} from '@angular/core';
import {SignalValue} from './models/signal-value.type';

export function useCombineLatest<Sources extends readonly Signal<any>[]>(
    sources: Sources
): Signal<Sources | undefined> {
    return computed(() => {
        const values = sources.map((source) => source()) as {
            [K in keyof Sources]: SignalValue<Sources[K]>;
        };

        return values.every((value) => value !== undefined) ? values : undefined;
    });
}
