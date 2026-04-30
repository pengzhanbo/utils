import { isInteger } from '../predicate'

/**
 * A counting semaphore for async functions that manages available permits.
 * Semaphores are mainly used to limit the number of concurrent async tasks.
 *
 * Each `acquire` operation takes a permit or waits until one is available.
 * Each `release` operation adds a permit, potentially allowing a waiting task to proceed.
 *
 * The semaphore ensures fairness by maintaining a FIFO (First In, First Out) order for acquirers.
 *
 * 异步函数使用的计数信号量，管理可用许可。
 * 信号量主要用于限制并发异步任务的数量。
 *
 * 每次 `acquire` 操作都会获取一个许可，或者等待直到有一个许可可用。
 * 每次 `release` 操作都会增加一个许可，可能允许等待的任务继续执行。
 *
 * 信号量通过维护获取者的 FIFO（先进先出）顺序来确保公平性。
 *
 * @category Promise
 *
 * @example
 * ```ts
 * const sema = new Semaphore(2);
 *
 * async function task() {
 *   await sema.acquire();
 *   try {
 *     // This code can only be executed by two tasks at the same time
 *   } finally {
 *     sema.release();
 *   }
 * }
 *
 * task();
 * task();
 * task(); // This task will wait until one of the previous tasks releases the semaphore.
 * ```
 */
export class Semaphore {
  /**
   * The maximum number of concurrent operations allowed.
   *
   * 允许的最大并发操作数。
   */
  public readonly capacity: number

  /**
   * The number of available permits.
   *
   * 可用许可的数量。
   */
  private _available: number

  private _acquired: number = 0

  get available(): number {
    return this._available
  }

  private _head: _Node | null = null
  private _tail: _Node | null = null

  /**
   * Creates an instance of Semaphore.
   * @example
   * ```ts
   * const sema = new Semaphore(3); // Allows up to 3 concurrent operations.
   * ```
   */
  constructor(capacity: number) {
    if (!isInteger(capacity) || capacity < 1) {
      throw new RangeError('Semaphore capacity must be a positive integer')
    }
    this.capacity = capacity
    this._available = capacity
  }

  /**
   * Acquires a semaphore, blocking if necessary until one is available.
   *
   * 获取一个信号量，必要时阻塞直到有一个可用。
   *
   * @example
   * ```ts
   * const sema = new Semaphore(1);
   *
   * async function criticalSection() {
   *   await sema.acquire();
   *   try {
   *     // This code section cannot be executed simultaneously
   *   } finally {
   *     sema.release();
   *   }
   * }
   * ```
   */
  async acquire(): Promise<void> {
    if (this._available > 0) {
      this._available--
      this._acquired++
      return
    }

    return new Promise<void>((resolve) => {
      const node: _Node = { value: resolve, next: null }
      if (this._tail) {
        this._tail.next = node
        this._tail = node
      } else {
        this._head = node
        this._tail = node
      }
    })
  }

  /**
   * Releases a semaphore, allowing one more operation to proceed.
   *
   * 释放一个信号量，允许另一个操作继续进行。
   *
   * @example
   * ```ts
   * const sema = new Semaphore(1);
   *
   * async function task() {
   *   await sema.acquire();
   *   try {
   *     // This code can only be executed by two tasks at the same time
   *   } finally {
   *     sema.release(); // Allows another waiting task to proceed.
   *   }
   * }
   * ```
   */
  release(): void {
    if (this._acquired > 0) {
      this._acquired--
    } else {
      return
    }

    if (this._head) {
      const node = this._head
      this._head = node.next
      if (!this._head) {
        this._tail = null
      }
      this._acquired++
      node.value()
      return
    }

    this._available++
  }
}

interface _Node {
  value: () => void
  next: _Node | null
}
