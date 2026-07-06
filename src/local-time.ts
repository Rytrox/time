import { isValidDate } from './local-date';

const timeRegex = /^\d{2}:\d{2}(?<sms>(?<ms>:\d{2}\.\d{3})|(?<s>:\d{2}))?$/u;

const isHours = (val: unknown): val is number => typeof val === 'number' && val >= 0 && val <= 23;
const isMinutes = (val: unknown): val is number => typeof val === 'number' && val >= 0 && val <= 59;
const isSeconds = (val: unknown): val is number => typeof val === 'number' && val >= 0 && val <= 59;
const isMilliseconds = (val: unknown): val is number => typeof val === 'number' && val >= 0 && val <= 999;

/**
 * ISO-8601 string type representing a local time without a date component.
 * Supports the following formats:
 * - `hh:mm`
 * - `hh:mm:ss`
 * - `hh:mm:ss.SSS`
 */
export type LocalTimeString = `${number}${number}:${number}${number}` |
    `${number}${number}:${number}${number}:${number}${number}` |
    `${number}${number}:${number}${number}:${number}${number}.${number}${number}${number}`;

/**
 * Checks whether the given value is a valid time string according to ISO-8601 without a date component.
 *
 * @param val the value to check
 * @returns true if the value is a valid {@link LocalTimeString}, otherwise false
 */
export const isLocalTimeString = (val: unknown): val is LocalTimeString => {
    if (typeof val === 'string' && timeRegex.test(val)) {
        const datetime = new Date(`1970-01-01T${val}Z`);
        if (!isValidDate(datetime)) {
            return false;
        }

        const iso = datetime.toISOString();
        return iso.slice(11, iso.length - 1).startsWith(val);
    }

    return false;
};

interface TimeFormatOptions {
    localeMatcher?: 'best fit' | 'lookup';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    formatMatcher?: 'best fit' | 'basic';
    hour12?: boolean;
}

/**
 * Represents a time component without a date. This class provides methods
 * to manipulate and inspect time values, similar to the `java.time.LocalTime` class.
 * This class is immutable. Every method call returns a new instance.
 *
 * This class can be instantiated with various input types, including ISO strings,
 * specific hour, minute, second and millisecond values, existing `Date` objects,
 * or another `LocalTime` instance.
 *
 * Note: The timezone is always ignored. The time is interpreted in the browser's local timezone.
 *
 * @author Timo Taubmann
 */
export class LocalTime {
    private readonly hours: number;
    private readonly minutes: number;
    private readonly seconds: number;
    private readonly milliseconds: number;

    /**
     * Creates a new time. The call goes through various constructor overloads.
     *
     * 1. Create a time based on an ISO string:
     *    Use the constructor with a string as the argument.
     *    Supported formats are `hh:mm`, `hh:mm:ss`, and `hh:mm:ss.SSS`.
     *    ```ts
     *    // Creates a time for 12:20 with 34 seconds and 345 milliseconds
     *    const time = new LocalTime('12:20:34.345');
     *    ```
     *
     * 2. Create a time based on individual parameters:
     *    Use the constructor with up to four numbers (hour, minute, second, millisecond).
     *    ```ts
     *    // Creates a time for 12:20 with 34 seconds and 345 milliseconds
     *    const time = new LocalTime(12, 20, 34, 345);
     *    ```
     *
     * 3. Create a time based on a JS {@link Date}:
     *    Use the constructor with a JS {@link Date}.
     *    The timezone is ignored — the time is read using the browser's local timezone.
     *    ```ts
     *    // Creates a time from an existing Date object
     *    const date = new Date(...);
     *    const time = new LocalTime(date);
     *    ```
     *
     * 4. As a copy constructor:
     *    ```ts
     *    const time = new LocalTime(12, 0);
     *    const copy = new LocalTime(time);
     *    ```
     *
     * 5. The current time:
     *    The constructor can be called without parameters.
     *    The timezone is ignored — the browser's local timezone is used.
     *    ```ts
     *    const now = new LocalTime();
     *    ```
     *
     * @param arg Either:
     *              1. a time as a string in `hh:mm`, `hh:mm:ss`, or `hh:mm:ss.SSS` format
     *              2. an hour value between 0 and 23
     *              3. a {@link Date} object
     *              4. a time as a {@link LocalTime} object
     * @param minute If option 2 is selected, the minute as a number between 0 and 59
     * @param second If option 2 is selected, the second as a number between 0 and 59
     * @param millisecond If option 2 is selected, the millisecond as a number between 0 and 999
     */
    public constructor(
        arg?: LocalTimeString | Date | LocalTime | number,
        minute?: number,
        second?: number,
        millisecond?: number
    ) {
        let time: Date | LocalTime;

        if (isLocalTimeString(arg)) {
            const [hh, mm, ss, ms] = arg.split(/[:.]/u).map(Number);
            time = new Date();

            time.setHours(
                isHours(hh) ? hh : NaN,
                isMinutes(mm) ? mm : NaN,
                0,
                0
            );

            if (typeof ss === 'number') {
                time.setSeconds(isSeconds(ss) ? ss : NaN);
            }

            if (typeof ms === 'number') {
                time.setMilliseconds(isMilliseconds(ms) ? ms : NaN);
            }
        } else if (typeof arg === 'number') {
            time = new Date();
            time.setHours(arg, minute ?? 0, second ?? 0, millisecond ?? 0);
        } else {
            time = arg instanceof Date || arg instanceof LocalTime ? arg : new Date();
        }

        this.hours = time.getHours();
        this.minutes = time.getMinutes();
        this.seconds = time.getSeconds();
        this.milliseconds = time.getMilliseconds();
    }

    /**
     * Checks whether this time is valid.
     * A time is considered valid if all components (hours, minutes, seconds, milliseconds)
     * are within their respective valid ranges.
     *
     * @returns true if the time is valid, otherwise false
     */
    public get valid(): boolean {
        return isHours(this.hours) &&
            isMinutes(this.minutes) &&
            isSeconds(this.seconds) &&
            isMilliseconds(this.milliseconds);
    }

    /**
     * Returns the hour component of this time (0–23).
     *
     * @returns the hour of the time
     */
    public getHours(): number {
        return this.hours;
    }

    /**
     * Returns the minute component of this time (0–59).
     *
     * @returns the minutes of the time
     */
    public getMinutes(): number {
        return this.minutes;
    }

    /**
     * Returns the second component of this time (0–59).
     *
     * @returns the seconds of the time
     */
    public getSeconds(): number {
        return this.seconds;
    }

    /**
     * Returns the millisecond component of this time (0–999).
     *
     * @returns the milliseconds of the time
     */
    public getMilliseconds(): number {
        return this.milliseconds;
    }

    /**
     * Checks whether this time is before the other time.
     * Returns false if either this time or the other time is invalid.
     * Comparison is performed down to millisecond precision.
     *
     * @param other the other time to compare against
     * @returns true if this time is strictly before the other time, otherwise false
     */
    public isBefore(other: LocalTime | Date): boolean {
        const dateValid = other instanceof LocalTime ? other.valid : isValidDate(other);

        if (this.valid && dateValid) {
            if (this.hours < other.getHours()) {
                return true;
            }

            if (this.hours === other.getHours()) {
                if (this.minutes < other.getMinutes()) {
                    return true;
                }

                if (this.minutes === other.getMinutes()) {
                    if (this.seconds < other.getSeconds()) {
                        return true;
                    }

                    if (this.seconds === other.getSeconds()) {
                        return this.milliseconds < other.getMilliseconds();
                    }
                }
            }
        }

        return false;
    }

    /**
     * Checks whether this time is equal to the other time.
     * Returns false if either this time or the other time is invalid.
     * Comparison is performed down to millisecond precision.
     *
     * @param other the other time to compare against
     * @returns true if both times represent the same point in time, otherwise false
     */
    public isEqual(other: LocalTime | Date): boolean {
        const dateValid = other instanceof LocalTime ? other.valid : isValidDate(other);

        return dateValid &&
            this.hours === other.getHours() &&
            this.minutes === other.getMinutes() &&
            this.seconds === other.getSeconds() &&
            this.milliseconds === other.getMilliseconds();
    }

    /**
     * Checks whether this time is after the other time.
     * Returns false if either this time or the other time is invalid.
     * Comparison is performed down to millisecond precision.
     *
     * @param other the other time to compare against
     * @returns true if this time is strictly after the other time, otherwise false
     */
    public isAfter(other: LocalTime | Date): boolean {
        const dateValid = other instanceof LocalTime ? other.valid : isValidDate(other);

        if (!dateValid) {
            return false;
        }

        if (dateValid && this.valid) {
            if (this.hours > other.getHours()) {
                return true;
            }

            if (this.hours === other.getHours()) {
                if (this.minutes > other.getMinutes()) {
                    return true;
                }

                if (this.minutes === other.getMinutes()) {
                    if (this.seconds > other.getSeconds()) {
                        return true;
                    }

                    if (this.seconds === other.getSeconds()) {
                        return this.milliseconds > other.getMilliseconds();
                    }
                }
            }
        }

        return false;
    }

    /**
     * Creates a copy of this instance with the hour set to the given value.
     * Throws an error if the provided hour is not within the valid range (0–23).
     *
     * @param hour the hour to set, must be between 0 and 23
     * @returns a new {@link LocalTime} instance with the updated hour
     */
    public withHour(hour: number): LocalTime {
        if (!isHours(hour)) {
            throw new Error('Invalid hour');
        }

        return new LocalTime(hour, this.minutes, this.seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance and adds the given number of hours.
     * Overflows are handled automatically — e.g., adding 20 hours to 12:00 results in 08:00 the next logical cycle.
     *
     * @param hour the number of hours to add
     * @returns a new {@link LocalTime} instance with the updated hour
     */
    public plusHours(hour: number): LocalTime {
        return new LocalTime(this.hours + hour, this.minutes, this.seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance and subtracts the given number of hours.
     * Note: The result is not clamped; values outside 0–23 may produce an invalid time.
     *
     * @param hour the number of hours to subtract
     * @returns a new {@link LocalTime} instance with the updated hour
     */
    public minusHours(hour: number): LocalTime {
        return new LocalTime(this.hours - hour, this.minutes, this.seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance with the minutes set to the given value.
     * Throws an error if the provided minute is not within the valid range (0–59).
     *
     * @param minute the minute to set, must be between 0 and 59
     * @returns a new {@link LocalTime} instance with the updated minutes
     */
    public withMinute(minute: number): LocalTime {
        if (!isMinutes(minute)) {
            throw new Error('Invalid minutes');
        }

        return new LocalTime(this.hours, minute, this.seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance and adds the given number of minutes.
     * Overflows are handled automatically — e.g., adding 50 minutes to 12:34 results in 13:24.
     *
     * @param minutes the number of minutes to add
     * @returns a new {@link LocalTime} instance with the updated minutes
     */
    public plusMinutes(minutes: number): LocalTime {
        return new LocalTime(this.hours, this.minutes + minutes, this.seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance and subtracts the given number of minutes.
     * Overflows are handled automatically — e.g., subtracting 50 minutes from 12:34 results in 11:44.
     *
     * @param minutes the number of minutes to subtract
     * @returns a new {@link LocalTime} instance with the updated minutes
     */
    public minusMinutes(minutes: number): LocalTime {
        return new LocalTime(this.hours, this.minutes - minutes, this.seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance with the seconds set to the given value.
     * Throws an error if the provided value is not within the valid range (0–59).
     *
     * @param seconds the second to set, must be between 0 and 59
     * @returns a new {@link LocalTime} instance with the updated seconds
     */
    public withSecond(seconds: number): LocalTime {
        if (seconds < 0 || seconds > 59) {
            throw new Error('Invalid seconds');
        }

        return new LocalTime(this.hours, this.minutes, seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance and adds the given number of seconds.
     * Overflows are handled automatically — e.g., adding 50 seconds to 12:34:56 results in 12:35:46.
     *
     * @param seconds the number of seconds to add
     * @returns a new {@link LocalTime} instance with the updated seconds
     */
    public plusSeconds(seconds: number): LocalTime {
        return new LocalTime(this.hours, this.minutes, this.seconds + seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance and subtracts the given number of seconds.
     * Overflows are handled automatically — e.g., subtracting 70 seconds from 12:34:56 results in 12:33:46.
     *
     * @param seconds the number of seconds to subtract
     * @returns a new {@link LocalTime} instance with the updated seconds
     */
    public minusSeconds(seconds: number): LocalTime {
        return new LocalTime(this.hours, this.minutes, this.seconds - seconds, this.milliseconds);
    }

    /**
     * Creates a copy of this instance with the milliseconds set to the given value.
     * Throws an error if the provided value is not within the valid range (0–999).
     *
     * @param milliseconds the millisecond to set, must be between 0 and 999
     * @returns a new {@link LocalTime} instance with the updated milliseconds
     */
    public withMilli(milliseconds: number): LocalTime {
        if (milliseconds < 0 || milliseconds > 999) {
            throw new Error('Invalid milliseconds');
        }

        return new LocalTime(this.hours, this.minutes, this.seconds, milliseconds);
    }

    /**
     * Creates a copy of this instance and adds the given number of milliseconds.
     * Overflows are handled automatically — e.g., adding 1320ms to 12:34:56.000 results in 12:34:57.320.
     *
     * @param ms the number of milliseconds to add
     * @returns a new {@link LocalTime} instance with the updated milliseconds
     */
    public plusMillis(ms: number): LocalTime {
        return new LocalTime(this.hours, this.minutes, this.seconds, this.milliseconds + ms);
    }

    /**
     * Creates a copy of this instance and subtracts the given number of milliseconds.
     * Overflows are handled automatically — e.g., subtracting 70ms from 12:34:56.000 results in 12:34:55.930.
     *
     * @param ms the number of milliseconds to subtract
     * @returns a new {@link LocalTime} instance with the updated milliseconds
     */
    public minusMillis(ms: number): LocalTime {
        return new LocalTime(this.hours, this.minutes, this.seconds, this.milliseconds - ms);
    }

    /**
     * Returns the time as an ISO-8601 formatted string.
     * The format is `hh:mm:ss.SSS` (e.g. `12:20:34.345`).
     * Throws an error if the time is invalid.
     *
     * @returns the time as an ISO-8601 string
     */
    public toISOString(): LocalTimeString {
        let isoTimeString: string | undefined;

        try {
            const date = new Date();
            date.setUTCHours(this.hours, this.minutes, this.seconds, this.milliseconds);

            const time = date.toISOString().split('T')[1];
            isoTimeString = time?.slice(0, -1);
        } catch (e) {
            throw new Error('Invalid Time', { cause: e });
        }

        if (!isLocalTimeString(isoTimeString)) {
            throw new Error('Invalid Time');
        }

        return isoTimeString;
    }

    /**
     * Returns the time as a locale-formatted string.
     * Falls back to the browser's default locale if none is specified.
     * Returns 'Invalid Date' if the time is invalid.
     *
     * @param format the locale to use for formatting (e.g. `'de-DE'`, `'en-US'`)
     * @param options formatting options such as hour format (12h/24h), display of seconds, etc.
     * @returns the locale-formatted time string
     */
    public toLocaleString(format?: Intl.LocalesArgument, options?: TimeFormatOptions): string {
        const date = new Date();
        date.setHours(this.hours, this.minutes, this.seconds, this.milliseconds);

        return date.toLocaleString(format, {
            formatMatcher: options?.formatMatcher,
            hour: options?.hour ?? '2-digit',
            hour12: options?.hour12,
            localeMatcher: options?.localeMatcher,
            minute: options?.minute ?? '2-digit',
            second: options?.second ?? '2-digit'
        });
    }

    /**
     * Returns the time as a string in the format `hh:mm:ss` (e.g. `12:20:34`).
     * Returns 'Invalid Date' if the time is invalid.
     *
     * @returns the time as a string
     */
    public toString(): string {
        const date = new Date();
        date.setHours(this.hours, this.minutes, this.seconds, this.milliseconds);

        return date.toString().slice(16, 24);
    }
}
