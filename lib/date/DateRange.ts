import { Dayjs } from "dayjs"
import { addSecondsToDate, diffDates } from "./Date"
import { dayjs, now } from "./dayjs"

/**
 * A data type to deal with a date range that has a known start and end date.
 *
 * When either the start date is set after the end date or vice versa, the other date
 * is fixed to the correct position using the previous interval between the 2 dates:
 *
 * ```ts
 * // Makes endDate "new Date(3)" because the previous interval was 1 second
 * const range = new FixedDateRange(new Date(0), new Date(1)).moveStartDate(new Date(2))
 * ```
 *
 * If the intial start date and end date are incompatible with each other, the initial
 * end date is fixed around the start date with the same means as before:
 *
 * ```ts
 * // Makes endDate "new Date(2)" because the interval was 1 second
 * const range = new FixedDateRange(new Date(1), new Date(0))
 * ```
 */
export class FixedDateRange {
  readonly startDate: Date
  readonly endDate: Date

  constructor (startDate: Date, endDate: Date) {
    this.startDate = startDate
    this.endDate = endDate

    if (startDate > endDate) {
      this.endDate = this.moveStartDate(startDate).endDate
    }
  }

  /**
   * Sets the start date of this range adjusting the end date accordingly.
   */
  moveStartDate (date: Date) {
    const { seconds } = diffDates(date, this.endDate)
    if (date > this.endDate) {
      return new FixedDateRange(date, addSecondsToDate(date, seconds))
    }
    return new FixedDateRange(date, this.endDate)
  }

  /**
   * Sets the start date of this range adjusting the start date accordingly.
   */
  moveEndDate (date: Date) {
    const { seconds } = diffDates(date, this.startDate)
    if (date < this.startDate) {
      return new FixedDateRange(addSecondsToDate(date, seconds), date)
    }
    return new FixedDateRange(this.startDate, date)
  }

  /**
   * Formats this date range in a UI friendly way.
   */
  formatted () {
    // TODO: - Should this support multiple locales?
    const start = dayjs(this.startDate)
    const end = dayjs(this.endDate)

    const startDateFormat = formatFromBasis(now(), start)
    if (start.isSame(end, "minute")) return startDateFormat

    const endDateFormat = start.isSame(end, "day")
      ? formatTime(end)
      : formatFromBasis(start, end)
    return `${startDateFormat} - ${endDateFormat}`
  }

  formattedDate () {
    const start = dayjs(this.startDate)
    const end = dayjs(this.endDate)
    const startDateFormat = formatDate(now(), start)
    const endDateFormat = start.isSame(end, "day") ? "" : formatDate(start, end)

    return `${startDateFormat} - ${endDateFormat}`
  }

  formattedTime () {
    const end = dayjs(this.endDate)
    const startDateFormat = this.formattedStartDate()
    const endDateFormat = formatTime(end)

    return `${startDateFormat} - ${endDateFormat}`
  }

  formattedStartTime () {
    const start = dayjs(this.startDate)
    return formatTime(start)
  }

  formattedStartDate () {
    const start = dayjs(this.startDate)
    return formatDate(now(), start)
  }
}

const formatDate = (basis: Dayjs, date: Dayjs) => {
  const current = now()
  if (date.isToday()) return "Today"
  if (date.isYesterday()) return "Yesterday"
  if (date.isTomorrow()) return "Tomorrow"
  if (date.isBetween(current, current.add(7, "days"), "days")) {
    return date.format("ddd")
  }
  const yearFormat = !date.isSame(basis, "year") ? " YYYY" : ""
  return date.format(`ddd, MMM D${yearFormat}`)
}

const formatFromBasis = (basis: Dayjs, date: Dayjs) => {
  const formattedTime = formatTime(date)

  if (!date.isSame(basis, "year")) {
    return `${formatDate(basis, date)}, ` + formattedTime
  }
  return `${formatDate(basis, date)} ` + formattedTime
}

const formatTime = (date: Dayjs) => {
  return date.format("h:mm A")
}
/**
 * Creates a date range object where the start date is always before
 * the end date.
 */
export const dateRange = (start: Date, end: Date) => {
  return new FixedDateRange(start, end)
}
