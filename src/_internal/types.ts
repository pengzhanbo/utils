/**
 * @internal
 */
export interface CancelOptions {
  upcomingOnly?: boolean
}

/**
 * @internal
 */
export interface Cancel {
  cancel: (options?: CancelOptions) => void
}

/**
 * @internal
 */
export interface FnNoReturn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
}
