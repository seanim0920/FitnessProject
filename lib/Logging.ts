import { ArrayUtils } from "./Array"
import { Filesystem } from "./Filesystem"
import { diffDates } from "./date"
import { Native as SentryNative } from "sentry-expo"

/**
 * A level to be used when logging.
 *
 * `debug` = important stuff that doesn't matter in prod
 * `info` = general log message
 * `error` = for when an error occurs
 */
export type LogLevel = "debug" | "info" | "error"

/**
 * A type that handles log messages and sends them somewhere.
 */
export type LogHandler = (
  label: string,
  level: LogLevel,
  message: string,
  metadata?: object
) => void

const consoleLogHandler = (): LogHandler => {
  return async (label, level, message, metadata) => {
    console[level](formatLogMessage(label, level, message, metadata))
  }
}

let logHandlers = [consoleLogHandler()]

/**
 * Creates a function to log with a given label.
 *
 * Use this instead of `console.log` to log to many different sources at once.
 *
 * ```ts
 * const log = createLogFunction("example")
 * addLogHandler(rotatingLogFileHandler(...))
 *
 * // Logs to both the console and filesystem.
 * log("info", "Message", { key: "value" })
 * ```
 *
 * By default, calling `log` will output formatted logs to the console, use `addLogHandler` to log to more sources.
 *
 * @param label the label which identifies this logger, use this in different modules of the app to identify specific components.
 * @returns a function which handles logging.
 */
export const createLogFunction = (label: string) => {
  return (level: LogLevel, message: string, metadata?: object) => {
    for (const handler of logHandlers) {
      handler(label, level, message, metadata)
    }
  }
}

/**
 * Adds a log handler that can handle and receive log messages via calls from the function created by `createLogFunction`.
 */
export const addLogHandler = (handler: LogHandler) => {
  logHandlers.push(handler)
}

/**
 * Removes all active log handlers, preserving only the console logger.
 */
export const resetLogHandlers = () => {
  logHandlers = [consoleLogHandler()]
}

/**
 * A type for representing a valid name from a log file.
 */
class LogFilename {
  readonly date: Date

  private constructor (rawValue: Date) {
    this.date = rawValue
  }

  pathInDirectory (directoryPath: string): string {
    return `${directoryPath}/${this.date.toISOString()}.log`
  }

  static fromCurrentDate () {
    return new LogFilename(new Date())
  }

  static fromPathString (pathString: string) {
    const pathSplits = pathString.split("/")
    const filenameSplits = pathSplits[pathSplits.length - 1].split(".")
    const fileDateString = `${filenameSplits[0]}.${filenameSplits[1]}`
    const parsedDate = new Date(fileDateString)
    if (!Number.isNaN(parsedDate.valueOf())) {
      return new LogFilename(parsedDate)
    }
    return undefined
  }
}

/**
 * A class that writes log messages to a rotating log file system which it internally manages.
 *
 * The {@link LogHandler} on this class only queues log messages such that they can be written in
 * batch. To actually write them, call {@link flush}.
 */
export class RotatingFilesystemLogs {
  private readonly directoryPath: string
  private readonly fs: Filesystem
  private openLogFilename?: LogFilename
  private currentDateLogFilename = LogFilename.fromCurrentDate()
  private queuedLogs = [] as string[]

  constructor (directoryPath: string, fs: Filesystem) {
    this.directoryPath = directoryPath
    this.fs = fs
  }

  /**
   * A log handler which queues log messages but doesn't write them to disk.
   *
   * In order to write the logs to disk, call {@link flush}.
   */
  get logHandler (): LogHandler {
    // NB: We can't just return handleLog directly because then calling addLogHandler will
    // cause the "this" keyword to refer to the global "this", thus causing chaos...
    return async (label, level, message, metadata) => {
      await this.handleLog(label, level, message, metadata)
    }
  }

  private async handleLog (
    label: string,
    level: LogLevel,
    message: string,
    metadata?: object
  ) {
    if (level === "debug") return
    this.queuedLogs.push(formatLogMessage(label, level, message, metadata))
  }

  /**
   * Flushes all queued log messages to disk by joining them together.
   *
   * Log messages are queued via interacting with {@link logHandler}.
   */
  async flush () {
    if (this.queuedLogs.length === 0) return
    await this.fs.appendString(
      (await this.loadOpenLogFilename()).pathInDirectory(this.directoryPath),
      this.queuedLogs.join("")
    )
    this.queuedLogs = []
  }

  private async loadOpenLogFilename () {
    if (this.openLogFilename) return this.openLogFilename

    const persistedNames = await this.loadPersistedLogFilenames()
    if (persistedNames.length === 0) {
      this.openLogFilename = this.currentDateLogFilename
      return this.currentDateLogFilename
    }

    const { weeks } = diffDates(
      this.currentDateLogFilename.date,
      persistedNames[0].date
    )

    if (weeks < 2) {
      this.openLogFilename = persistedNames[0]
      return persistedNames[0]
    }

    if (persistedNames.length >= 5) {
      const deletePath = persistedNames[
        persistedNames.length - 1
      ].pathInDirectory(this.directoryPath)
      await this.fs.deleteFile(deletePath)
    }

    this.openLogFilename = this.currentDateLogFilename
    return this.currentDateLogFilename
  }

  private async loadPersistedLogFilenames () {
    try {
      const paths = await this.fs.listDirectoryContents(this.directoryPath)
      return ArrayUtils.compactMap(paths, LogFilename.fromPathString).sort(
        (name1, name2) => name2.date.getTime() - name1.date.getTime()
      )
    } catch {
      return []
    }
  }
}

/**
 * A log handler which tracks info logs as sentry breadcrumbs.
 */
export const sentryBreadcrumbLogHandler = (
  handleBreadcrumb: (
    breadcrumb: SentryNative.Breadcrumb
  ) => void = SentryNative.addBreadcrumb
): LogHandler => {
  return async (label, level, message, metadata) => {
    if (level === "debug") return
    handleBreadcrumb({
      message,
      level,
      ...getSentryBreadcrumbMetadata(label, metadata)
    })
  }
}

const getSentryBreadcrumbMetadata = (label: string, metadata?: object) => {
  if (!metadata) return { category: undefined, data: { label } }
  const sentryData = { label, ...metadata }
  const category =
    "category" in sentryData && typeof sentryData.category === "string"
      ? sentryData.category
      : undefined

  if ("category" in sentryData && typeof sentryData.category === "string") {
    delete sentryData.category
  }
  return { category, data: sentryData }
}

/**
 * A `LogHandler` which captures errors to sentry.
 *
 * The error must be assigned to the `error` field and must be an instance of subclass of {@link Error}.
 */
export const sentryErrorCapturingLogHandler = (
  captureError: (error: Error) => void = SentryNative.captureException
): LogHandler => {
  // NB: We don't need to care about the label of message since those are handled by the breadcrumb handler
  return async (_, level, __, metadata) => {
    if (level !== "error" || !metadata) return
    if ("error" in metadata && metadata.error instanceof Error) {
      captureError(metadata.error)
    }
  }
}

const formatLogMessage = (
  label: string,
  level: LogLevel,
  message: string,
  metadata?: object
) => {
  const currentDate = new Date()
  const levelEmoji = emojiForLogLevel(level)
  const stringifiedMetadata = JSON.stringify(metadata)
  const metadataStr = stringifiedMetadata ? ` ${stringifiedMetadata}` : ""
  return `${currentDate.toISOString()} [${label}] (${level.toUpperCase()} ${levelEmoji}) ${message}${metadataStr}\n`
}

const emojiForLogLevel = (level: LogLevel) => {
  if (level === "debug") return "🟢"
  if (level === "info") return "🔵"
  return "🔴"
}
