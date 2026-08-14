import { remove } from '../array/remove.js'

/**
 * A tracker for promise tasks.
 *
 * A task tracker records in-flight promise tasks and can wait for them to settle.
 * It is NOT a mutual-exclusion lock: tasks submitted via `run` always execute
 * concurrently, and `run` never queues or serializes them.
 *
 * 一个 promise 任务追踪器。
 *
 * 追踪器登记在途的 promise 任务，并可等待它们全部落定。
 * 它**不是互斥锁**：通过 `run` 提交的任务始终并发执行，`run` 不会排队或串行化任务。
 *
 * @category Promise
 */
export interface TaskTracker {
  /**
   * Run a task and record it as in-flight. The task starts immediately and runs
   * concurrently with any other in-flight tasks.
   *
   * 启动并登记一个任务。任务立即开始执行，与其他在途任务并发运行。
   *
   * @typeParam T - The type of the resolved value / 解析值的类型
   * @param fn - The task to run. 要运行的任务
   * @returns A promise resolving with the task result. / 解析为任务结果的 promise
   */
  run: <T = void>(fn: () => Promise<T>) => Promise<T>
  /**
   * Wait for all tasks that are in-flight when this method is called to settle.
   * Tasks started afterwards are not included (snapshot semantics). Resolves even
   * if some of the tracked tasks reject.
   *
   * 等待调用本方法时所有在途的任务落定。
   * 之后新启动的任务不会被包含（快照语义）。即使部分任务拒绝也会正常 resolve。
   */
  wait: () => Promise<void>
  /**
   * Whether there are any in-flight tasks.
   *
   * 是否存在在途任务。
   */
  isRunning: () => boolean
  /**
   * Forget all tracked tasks without cancelling or awaiting them. In-flight tasks
   * keep running; a subsequent `wait` will not include them.
   *
   * 清除所有已登记的任务，不会取消或等待它们。在途任务会继续运行；之后调用 `wait` 不会包含它们。
   */
  clear: () => void
}

/**
 * Create a task tracker for promise tasks.
 *
 * 创建一个 promise 任务追踪器。
 *
 * @category Promise
 *
 * @returns The task tracker. / 任务追踪器
 *
 * @remarks
 * `run` executes tasks immediately and concurrently — this is not a lock.
 * Use {@link Semaphore} or {@link limitAsync} when you need to limit concurrency
 * or serialize executions.
 *
 * `run` 会立即并发执行任务——这不是锁。
 * 需要限制并发或串行执行时，请使用 {@link Semaphore} 或 {@link limitAsync}。
 *
 * @example
 * ```
 * const tracker = createTaskTracker()
 *
 * tracker.run(async () => {
 *   await doSomething()
 * })
 *
 * // in another context:
 * await tracker.wait() // waits for all in-flight tasks to settle
 * ```
 *
 * @see {@link Semaphore} — for limiting concurrency / 限制并发
 * @see {@link limitAsync} — for serializing executions / 串行执行
 */
export function createTaskTracker(): TaskTracker {
  const tasks: Promise<any>[] = []

  return {
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn()
      tasks.push(p)
      try {
        return await p
      } finally {
        remove(tasks, p)
      }
    },
    async wait(): Promise<void> {
      await Promise.allSettled(tasks)
    },
    isRunning() {
      return Boolean(tasks.length)
    },
    clear() {
      tasks.length = 0
    },
  }
}
