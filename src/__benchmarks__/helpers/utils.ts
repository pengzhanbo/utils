/**
 * Benchmark Utilities / 基准测试辅助工具
 *
 * 提供性能测试所需的辅助函数和类型定义
 */

// ==================== Type Definitions ====================

/** Performance metrics interface / 性能指标接口 */
export interface PerfMetrics {
  /** Function name / 函数名称 */
  name: string
  /** Scenario description / 场景描述 */
  scenario: string
  /** Data size description / 数据规模描述 */
  dataSize: string
  /** Mean time per operation (ms/op) / 平均耗时（毫秒/操作） */
  meanMs: number
  /** Throughput (ops/sec) / 吞吐量（操作数/秒） */
  throughput: number
  /** Number of samples / 样本数量 */
  samples: number
  /** Standard deviation (ms) / 标准差（毫秒） */
  stdDev?: number
  /** Minimum value (ms) / 最小值（毫秒） */
  min?: number
  /** Maximum value (ms) / 最大值（毫秒） */
  max?: number
}

// ==================== Formatting Functions ====================

/** Format duration to human-readable string / 格式化耗时为可读字符串 */
export function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/** Format throughput to human-readable string / 格式化吞吐量为可读字符串 */
export function formatThroughput(ops: number): string {
  if (ops >= 1_000_000) return `${(ops / 1_000_000).toFixed(2)}M ops/s`
  if (ops >= 1_000) return `${(ops / 1_000).toFixed(2)}K ops/s`
  return `${ops.toFixed(2)} ops/s`
}

// ==================== Logging Functions ====================

/** Log performance result to console / 将性能结果输出到控制台 */
export function logPerfResult(metrics: PerfMetrics): void {
  console.warn(`\n📊 ${metrics.name} | ${metrics.scenario}`)
  console.warn(`   Data Size: ${metrics.dataSize}`)
  console.warn(
    `   Mean: ${formatDuration(metrics.meanMs)} | Throughput: ${formatThroughput(metrics.throughput)}`,
  )
  if (metrics.stdDev !== undefined) {
    console.warn(
      `   StdDev: ±${formatDuration(metrics.stdDev)} | Range: [${formatDuration(metrics.min ?? 0)}, ${formatDuration(metrics.max ?? 0)}]`,
    )
  }
}

// ==================== Assertion Functions ====================

/** Assert that performance is within acceptable range / 断言性能在合理范围内 */
export function assertPerfWithin(actual: number, expectedMax: number, unit = 'ms'): boolean {
  const withinRange = actual <= expectedMax
  if (!withinRange) {
    console.warn(`⚠️ Performance regression detected: ${actual}${unit} > ${expectedMax}${unit}`)
  }
  return withinRange
}

// ==================== Report Generation ====================

/** Generate a summary report from multiple metrics / 从多个指标生成摘要报告 */
export function generateReportSummary(results: PerfMetrics[]): string {
  const lines = [`\n${'='.repeat(80)}`, 'BENCHMARK REPORT SUMMARY'.padStart(50), '='.repeat(80), '']

  for (const r of results) {
    lines.push(
      `${r.name.padEnd(30)} | ${r.scenario.padEnd(25)} | ${formatThroughput(r.throughput).padStart(12)}`,
    )
  }

  lines.push(''.repeat(80))
  lines.push(`Total: ${results.length} benchmarks executed`)
  lines.push('='.repeat(80))

  return lines.join('\n')
}

// ==================== Synchronous Sleep ====================

/** Synchronous sleep for benchmarking (busy wait) / 同步等待（用于基准测试） */
export function syncSleep(ms: number): void {
  const end = Date.now() + ms
  while (Date.now() < end) {
    // busy wait - intentionally blocking for precise timing in benchmarks
  }
}
