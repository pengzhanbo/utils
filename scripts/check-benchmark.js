#!/usr/bin/env node

/**
 * Benchmark Regression Detection Script / 基准测试回归检测脚本
 *
 * Compares current benchmark results against a saved baseline and reports
 * any performance regressions exceeding configured thresholds.
 *
 * 将当前基准测试结果与已保存的基线进行对比，
 * 报告超过配置阈值的任何性能回归。
 *
 * Usage: node scripts/check-benchmark.js [options]
 *   --baseline <path>    Path to baseline JSON file (default: docs/benchmark-baseline.json)
 *   --current  <path>    Path to current results JSON file (default: benchmark-results.json)
 *   --threshold <num>    Regression threshold percentage (default: 20)
 *   --output <path>      Path to output report (default: stdout)
 */

const fs = require('node:fs')
const path = require('node:path')

// ==================== Configuration ====================

const DEFAULT_OPTIONS = {
  baselinePath: 'docs/benchmark-baseline.json',
  currentPath: 'benchmark-results.json',
  threshold: 20,
  outputPath: null,
}

// ==================== CLI Parsing ====================

function parseArgs(argv) {
  const args = { ...DEFAULT_OPTIONS }
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case '--baseline':
        args.baselinePath = argv[++i]
        break
      case '--current':
        args.currentPath = argv[++i]
        break
      case '--threshold':
        args.threshold = Number.parseFloat(argv[++i])
        break
      case '--output':
        args.outputPath = argv[++i]
        break
      case '--help':
        printHelp()
        process.exit(0)
    }
  }
  return args
}

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(`
Benchmark Regression Detector

Usage: node scripts/check-benchmark.js [options]

Options:
  --baseline <path>    Path to baseline JSON file (default: ${DEFAULT_OPTIONS.baselinePath})
  --current  <path>    Path to current results JSON file (default: ${DEFAULT_OPTIONS.currentPath})
  --threshold <num>    Regression threshold in % (default: ${DEFAULT_OPTIONS.threshold})
  --output <path>      Write report to file instead of stdout
  --help              Show this help message

Exit codes:
  0  No regressions detected (or no baseline to compare)
  1  Regressions detected beyond threshold
`)
}

// ==================== Core Logic ====================

function loadJson(filePath) {
  const resolved = path.resolve(filePath)
  if (!fs.existsSync(resolved)) {
    console.warn(`Warning: File not found: ${resolved}`)
    return null
  }
  try {
    return JSON.parse(fs.readFileSync(resolved, 'utf8'))
  } catch (e) {
    console.error(`Error parsing ${resolved}: ${e.message}`)
    return null
  }
}

function extractBenchmarks(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (data.results && Array.isArray(data.results)) return data.results
  if (data.suites) {
    const benchmarks = []
    for (const suite of data.suites) {
      if (suite.result && suite.result.benchmarks) {
        benchmarks.push(...suite.result.benchmarks)
      }
    }
    return benchmarks
  }
  return []
}

function buildLookup(benchmarks) {
  const map = new Map()
  for (const b of benchmarks) {
    const key = b.name || b.id || b.fullName || String(b)
    map.set(key, b)
  }
  return map
}

function compareBenchmarks(baselineMap, currentMap, threshold) {
  const regressions = []
  const improvements = []
  const unchanged = []

  for (const [key, current] of currentMap) {
    const baseline = baselineMap.get(key)
    if (!baseline) continue

    const baseMean = baseline.mean ?? baseline.average ?? 0
    const currMean = current.mean ?? current.average ?? 0

    if (baseMean <= 0) continue

    const changePercent = ((currMean - baseMean) / baseMean) * 100
    const entry = {
      name: key,
      baseline: baseMean,
      current: currMean,
      changePercent: Math.round(changePercent * 100) / 100,
      baselineHz: baseline.hz,
      currentHz: current.hz,
    }

    if (changePercent > threshold) {
      regressions.push(entry)
    } else if (changePercent < -10) {
      improvements.push(entry)
    } else {
      unchanged.push(entry)
    }
  }

  return { regressions, improvements, unchanged }
}

function generateReport(comparison, options) {
  const lines = []

  lines.push('='.repeat(70))
  lines.push(' BENCHMARK REGRESSION REPORT')
  lines.push(` Threshold: ±${options.threshold}% | Generated: ${new Date().toISOString()}`)
  lines.push('='.repeat(70))
  lines.push('')

  if (comparison.regressions.length === 0) {
    lines.push('✅ No performance regressions detected.')
  } else {
    lines.push(`🔴 REGRESSIONS DETECTED (${comparison.regressions.length}):`)
    lines.push('-'.repeat(70))
    lines.push(
      `  ${'Benchmark Name'.padEnd(45)} ${'Baseline'.padStart(12)} ${'Current'.padStart(12)} ${'Change'.padStart(10)}`,
    )
    lines.push('  '.repeat(45) + '(ms/op)'.padStart(12) + '(ms/op)'.padStart(10) + ''.padStart(10))

    for (const r of comparison.regressions) {
      const arrow = r.changePercent > 0 ? '▴' : ''
      lines.push(
        `  ${r.name.slice(0, 44).padEnd(45)} ${String(r.baseline.toFixed(3)).padStart(12)} ${String(r.current.toFixed(3)).padStart(12)} ${`${arrow}${Math.abs(r.changePercent).toFixed(1)}%`.padStart(10)}`,
      )
    }
  }

  lines.push('')
  if (comparison.improvements.length > 0) {
    lines.push(`🟢 IMPROVEMENTS (${comparison.improvements.length}):`)
    for (const r of comparison.improvements) {
      lines.push(`  ✓ ${r.name}: ${r.changePercent > 0 ? '+' : ''}${r.changePercent.toFixed(1)}%`)
    }
    lines.push('')
  }

  lines.push(
    `Total compared: ${comparison.regressions.length + comparison.improvements.length + comparison.unchanged.length} benchmarks`,
  )

  return lines.join('\n')
}

// ==================== Main ====================

function main() {
  const options = parseArgs(process.argv)

  const baselineData = loadJson(options.baselinePath)
  const currentData = loadJson(options.currentPath)

  if (!baselineData) {
    // eslint-disable-next-line no-console
    console.log(
      `ℹ️  No baseline found at "${options.baselinePath}". Run "pnpm test:bench:json" first to establish baseline.`,
    )
    process.exit(0)
  }

  if (!currentData) {
    // eslint-disable-next-line no-console
    console.log(
      `ℹ️  No current results found at "${options.currentPath}". Run "pnpm test:bench:json" first.`,
    )
    process.exit(0)
  }

  const baselineBenchmarks = extractBenchmarks(baselineData)
  const currentBenchmarks = extractBenchmarks(currentData)

  const baselineMap = buildLookup(baselineBenchmarks)
  const currentMap = buildLookup(currentBenchmarks)

  const comparison = compareBenchmarks(baselineMap, currentMap, options.threshold)
  const report = generateReport(comparison, options)

  if (options.outputPath) {
    fs.writeFileSync(path.resolve(options.outputPath), `${report}\n`, 'utf8')
    // eslint-disable-next-line no-console
    console.log(`Report written to ${String(options.outputPath)}`)
  } else {
    // eslint-disable-next-line no-console
    console.log(report)
  }

  if (comparison.regressions.length > 0) {
    process.exit(1)
  }
}

main()
