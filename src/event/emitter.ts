/* eslint-disable ts/method-signature-style */

import { remove } from '../array/remove'
import { invoke } from '../function/invoke'

export type EventType = string | symbol

export type EventListener<T> = (event: T) => void

export type EventWildcardListener<T = Record<string, unknown>> = (
  type: keyof T,
  event: T[keyof T],
) => void

export type EventListenerList<T> = EventListener<T>[]

export type EventWildcardListenerList<T> = EventWildcardListener<T>[]

export type EventListenerMap<T extends Record<EventType, unknown>> = Map<
  keyof T | '*',
  EventListenerList<T[keyof T]> | EventWildcardListenerList<T>
>

export interface EventEmitter<Events extends Record<EventType, unknown>> {
  listeners: EventListenerMap<Events>

  /**
   * Adds a listener to the specified event.
   *
   * @param type - the event to listen for
   *               - '*' to listen for wildcard event
   * @param listener - the listener function to be called when the event is triggered
   * @return
   */
  on<Key extends keyof Events>(type: Key, listener: EventListener<Events[Key]>): void
  on(type: '*', listener: EventWildcardListener<Events>): void

  /**
   * Turn off the specified event listener.
   * @param type - the name of the event to turn off
   *               - '*' to turn off wildcard event
   * @param listener - (optional) the listener function to turn off
   */
  off<Key extends keyof Events>(type: Key, listener?: EventListener<Events[Key]>): void
  off(type: '*', listener: EventWildcardListener<Events>): void

  /**
   * Adds a listener to the specified event, the listener will be called only once.
   * @param type - the event to listen for
   *               - '*' to listen for wildcard event
   * @param listener - the listener function to be called when the event is triggered
   */
  once<Key extends keyof Events>(type: Key, listener: EventListener<Events[Key]>): void
  once(type: '*', listener: EventWildcardListener<Events>): void

  /**
   * Emits the specified event with the given arguments to all registered listeners.
   * @param type - the name of the event to emit, wildcard event will be after emitted
   * @param event - the arguments to pass to the event listeners
   */
  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void
}

/**
 * Create an event emitter
 *
 * 创建一个事件发射器
 *
 * @category Event
 *
 * @example
 * ```ts
 * const emitter = createEmitter()
 *
 * // listen for an event
 * emitter.on('event-name', (data) => console.log(data))
 *
 * // emit an event
 * emitter.emit('event-name', data)
 * ```
 */
export function createEmitter<Events extends Record<EventType, unknown>>(
  listeners?: EventListenerMap<Events>,
): EventEmitter<Events> {
  type Listener = EventListener<Events[keyof Events]> | EventWildcardListener<Events>

  listeners ??= new Map()

  const on = <Key extends keyof Events>(type: Key, listener: Listener) => {
    const list: Listener[] | undefined = listeners.get(type)
    if (list)
      list.push(listener)
    else
      listeners.set(type, [listener as EventListener<Events[keyof Events]>])
  }

  const off = <Key extends keyof Events>(type: Key, listener?: Listener) => {
    const list = listeners.get(type)
    if (list?.length) {
      if (listener)
        remove(list, listener)
      else
        listeners.delete(type)
    }
  }

  const emit = <Key extends keyof Events>(type: Key, event?: Events[Key]) => {
    const list = listeners.get(type)
    if (list?.length)
      invoke(list, event)

    const wildcardList = listeners.get('*')
    if (wildcardList?.length)
      invoke(wildcardList, type, event)
  }

  const once = <Key extends keyof Events>(type: Key, listener: Listener) => {
    const wrapped: Listener = (...args: Parameters<Listener>) => {
      invoke(listener, ...args)
      off(type, wrapped)
    }
    on(type, wrapped)
  }

  return { listeners, on, off, once, emit }
}
