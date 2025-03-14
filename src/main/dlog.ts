// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

function normalizeParams(sourceLine: string | null, message?: any): [string, any] {
  if (message === undefined) {
    message = sourceLine
    sourceLine = null
  }
  if (sourceLine === null) {
    sourceLine = "[unknown]"
  }
  return [sourceLine, message]
}

function _log(sourceLine: string, message: any) {
  console.log(`${sourceLine} ${message}`)
}

function _error(sourceLine: string, message: any) {
  console.error(`${sourceLine} ${message}`)
}

interface DevLog {
  /**
   * `console.log` with source line information prepended to the message.
   *
   * @param message Message to print.
   */
  log(message: any): void
  log(sourceLine: string | null, message: any): void

  /**
   * `console.error` with source line information prepended to the message.
   *
   * @param message Message to print.
   */
  error(message: any): void
  error(sourceLine: string | null, message: any): void
}

/**
 * `console` logger replacement.
 */
export const dlog: DevLog = {
  log(sourceLine: string | null, message?: any): void {
    const [s, m] = normalizeParams(sourceLine, message)
    _log(s, m)
  },
  error(sourceLine: string | null, message?: any): void {
    const [s, m] = normalizeParams(sourceLine, message)
    _error(s, m)
  }
}
