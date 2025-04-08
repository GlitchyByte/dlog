// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

function normalizeParams(sourceLine: string | null, ...data: any[]): [string, any[]] {
  if (data.length === 0) {
    data = [sourceLine]
    sourceLine = null
  }
  if (sourceLine === null) {
    sourceLine = "[unknown]"
  }
  return [sourceLine, data]
}

interface DevLog {
  /**
   * `console.log` with source line information prepended to the message.
   *
   * @param data Data to print.
   */
  log(...data: any[]): void
  log(sourceLine: string | null, ...data: any[]): void

  /**
   * `console.error` with source line information prepended to the message.
   *
   * @param data Data to print.
   */
  error(...data: any[]): void
  error(sourceLine: string | null, ...data: any[]): void
}

/**
 * `console` logger replacement.
 */
export const dlog: DevLog = {
  log(sourceLine: string | null, ...data: any[]): void {
    const [sl, d] = normalizeParams(sourceLine, ...data)
    console.log(sl, ...d)
  },
  error(sourceLine: string | null, ...data: any[]): void {
    const [sl, d] = normalizeParams(sourceLine, ...data)
    console.error(sl, ...d)
  }
}
