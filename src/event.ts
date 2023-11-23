export class BaseEvent {
  private _listeners: Map<string, Function[]>

  constructor() {
    this._listeners = new Map()
  }

  on(event: string, listener: Function) {
    if (!this._listeners.has(event))
      this._listeners.set(event, [])

    this._listeners.get(event)!.push(listener)
  }

  emit(event: string, ...args: any[]) {
    if (this._listeners.has(event))
      this._listeners.get(event)!.forEach(listener => listener(...args))
  }

  off(event: string, listener?: Function) {
    if (this._listeners.has(event)) {
      listener
        ? this._listeners
          .get(event)!
          .splice(this._listeners.get(event)!.indexOf(listener), 1)
        : this._listeners.delete(event)
    }
  }

  once(event: string, listener: Function) {
    this.on(event, (...args: any[]) => {
      this.off(event, listener)
      listener(...args)
    })
  }
}
