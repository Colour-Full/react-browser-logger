import assert from 'assert'
import { createLogger } from 'browser-bunyan'
import { ConsoleRawStream } from '@browser-bunyan/console-raw-stream'
import isObject from 'lodash/fp/isObject'
import isString from 'lodash/fp/isString'
import { detect as detectBrowser } from 'detect-browser'

export const browserSerializer = (browser) => {
  const info = {
    browserName: browser.name,
    browserVersion: browser.version,
    OS: browser.os
  }
  return info
}

export const logstashClientTransport = (logstashHost) => {
  try {
    const writeStream = {
      write (rec) {
        const formattedStream = {
          name: rec.name,
          '@timestamp': rec.time,
          level: rec.levelName,
          message: rec.msg
        }
        fetch(logstashHost, {
          method: 'PUT',
          body: JSON.stringify({ ...rec, ...formattedStream }),
          headers: new Headers({
            'content-type': 'application/json'
          })
        }).then(res => {
          if (!res.ok) {
            console.log('Error:', `${this.level} message was not delivered to Kibana at ${this.timestamp}`)
          }
        })
      }
    }
    return writeStream
  } catch (error) {
    console.log('Error in Logger Logstash Stream ' + error)
  }
}

export const Modes = {
  console: 'console',
  logstash: 'logstash'
}

export const Levels = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error'
}

const isValidMode = (mode) => (Modes[mode])
const isValidLevel = (level) => (Levels[level])

const Logger = (name, mode = Modes.console, level = Levels.warn, options = {}) => {
  assert(isValidMode(mode), 'Invalid logger mode')
  assert(isValidLevel(level), 'Invalid logger level')
  assert(isString(name), 'Invalid logger name')
  if (options.logstashHost) {
    assert(isString(options.logstashHost), 'Invalid logstashHost property in Logger options')
  }
  if (options.serializers) {
    assert(isObject(options.serializers), 'Invalid serializers property in Logger options')
  }
  const setStream = (mode) => {
    if (mode !== 'console') {
      const stream = logstashClientTransport(options.logstashHost)
      return stream
    }
    const stream = new ConsoleRawStream()
    return stream
  }
  return createLogger({
    name,
    level,
    streams: [
      {
        level: level,
        stream: setStream(mode)
      }
    ],
    serializers: {
      browser: browserSerializer,
      ...options.serializers
    },
    browser: detectBrowser()
  })
}

export default Logger
