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
   * 为指定的事件添加监听器。
   *
   * @param type - The event to listen for, use '*' to listen for wildcard event. 要监听的事件，使用'*'监听通配符事件
   * @param listener - The listener function to be called when the event is triggered. 事件触发时要调用的监听器函数
   */
  on<Key extends keyof Events>(type: Key, listener: EventListener<Events[Key]>): void
  on(type: '*', listener: EventWildcardListener<Events>): void

  /**
   * Turn off the specified event listener.
   *
   * 移除指定的事件监听器。
   *
   * @param type - The name of the event to turn off, use '*' to turn off wildcard event. 要移除的事件名称，使用'*'移除通配符事件
   * @param listener - (optional) The listener function to turn off. 要移除的监听器函数（可选）
   */
  off<Key extends keyof Events>(type: Key, listener?: EventListener<Events[Key]>): void
  off(type: '*', listener: EventWildcardListener<Events>): void

  /**
   * Adds a listener to the specified event, the listener will be called only once.
   *
   * 为指定的事件添加一个监听器，该监听器只会被调用一次。
   *
   * @param type - The event to listen for, use '*' to listen for wildcard event. 要监听的事件，使用'*'监听通配符事件
   * @param listener - The listener function to be called when the event is triggered. 事件触发时要调用的监听器函数
   */
  once<Key extends keyof Events>(type: Key, listener: EventListener<Events[Key]>): void
  once(type: '*', listener: EventWildcardListener<Events>): void

  /**
   * Emits the specified event with the given arguments to all registered listeners.
   *
   * 向所有已注册的监听器触发指定事件并传递给定的参数。通配符事件会在普通事件之后触发。
   *
   * @param type - The name of the event to emit. 要触发的事件名称
   * @param event - The arguments to pass to the event listeners. 要传递给事件监听器的参数
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
 * @param listeners - Optional pre-existing listener map to initialize with. 可选的预设监听器映射
 * @returns A new event emitter instance. 新的事件发射器实例
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
    if (list) list.push(listener)
    else listeners.set(type, [listener as EventListener<Events[keyof Events]>])
  }

  const off = <Key extends keyof Events>(type: Key, listener?: Listener) => {
    const list = listeners.get(type)
    if (list?.length) {
      if (listener) remove(list, listener)
      else listeners.delete(type)
    }
  }

  const emit = <Key extends keyof Events>(type: Key, event?: Events[Key]) => {
    const list = listeners.get(type)
    if (list?.length) invoke(list, event)

    const wildcardList = listeners.get('*')
    if (wildcardList?.length) invoke(wildcardList, type, event)
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
