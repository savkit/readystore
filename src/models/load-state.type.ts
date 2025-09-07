export class LoadState<T> {
  constructor(
    public readonly loading: boolean,
    public readonly error: any,
    public readonly data: T | undefined,
    public readonly ready: boolean
  ) {}
}

export type StateStatus = 'NOT_LOADED' | 'LOADING' | 'LOADED' | 'ERROR';

export class AsyncState<T> {
  constructor(
    public readonly data: T | undefined = undefined,
    public readonly status: StateStatus = 'NOT_LOADED',
    public readonly error: any = undefined
  ) {}
}
