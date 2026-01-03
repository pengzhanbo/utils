export interface CancelOptions {
  upcomingOnly?: boolean
}

export interface Cancel {
  cancel: (options?: CancelOptions) => void
}

export interface FnNoReturn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
}
