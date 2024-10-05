/**
 * @category Event
 */
export class BaseEvent {
  private _listeners: Map<string, ((...args: any[]) => void)[]>

  constructor() {
    this._listeners = new Map()
  }

  /**
   * Adds a listener to the specified event.
   *
   * @param event - the event to listen for
   * @param listener - the listener function to be called when the event is triggered
   * @return
   */
  on(event: string, listener: (...args: any[]) => void): void {
    if (!this._listeners.has(event))
      this._listeners.set(event, [])

    this._listeners.get(event)!.push(listener)
  }

  /**
   * Emits the specified event with the given arguments to all registered listeners.
   *
   * @param event - the name of the event to emit
   * @param args - the arguments to pass to the event listeners
   * @return
   */
  emit(event: string, ...args: any[]): void {
    if (this._listeners.has(event))
      this._listeners.get(event)!.forEach(listener => listener(...args))
  }

  /**
   * Turn off the specified event listener.
   *
   * @param event - the name of the event to turn off
   * @param listener - (optional) the listener function to turn off
   */
  off(event: string, listener?: (...args: any[]) => void): void {
    if (this._listeners.has(event)) {
      listener
        ? this._listeners
          .get(event)!
          .splice(this._listeners.get(event)!.indexOf(listener), 1)
        : this._listeners.delete(event)
    }
  }

  /**
   * Execute the listener at most once for a particular event.
   *
   * @param event - the event to listen for
   * @param listener - the function to be executed once for the event
   */
  once(event: string, listener: (...args: any[]) => void): void {
    this.on(event, (...args: any[]) => {
      this.off(event, listener)
      listener(...args)
    })
  }
}
