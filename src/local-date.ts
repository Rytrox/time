import { Month, isMonth } from './month';
import { DayOfWeek } from './day';
import { LocalTime } from './local-time';

/**
 * ISO-String type of local date without a time component.
 */
export type LocalDateString = `${number}-${0 | 1}${number}-${0 | 1 | 2 | 3}${number}`;

const dateRegex = /^\d{4}-\d{2}-\d{2}$/u;

const isPossibleYear = (val: unknown): val is number => typeof val === 'number' && Number.isInteger(val) && val >= 1;
const isPossibleMonth = (val: unknown): val is number => typeof val === 'number' && Number.isInteger(val) && val >= 0 && val <= 12;
const isPossibleDay = (val: unknown): val is number => typeof val === 'number' && Number.isInteger(val) && val >= 1 && val <= 31;

/**
 * Checks whether the given value is a valid date string according to ISO-8601 without a time component.
 *
 * ATTENTION: This function does not validate the date itself, only the format.
 *
 * @param val the value to check
 */
export const isLocalDateString = (val: unknown): val is LocalDateString => {
    if (typeof val === 'string' && dateRegex.test(val)) {
        const [year, month, day] = val.split('-').map(Number);

        if (isPossibleYear(year) && isPossibleMonth(month) && isPossibleDay(day)) {
            return new Date(Date.UTC(year, month - 1, day)).toISOString().split('T')[0] === val;
        }
    }

    return false;
};

const validateLocalDate = (date: LocalDate, year: number, month: Month, day: number) => {
    if (!date.valid) {
        throw new Error('Could not parse date, invalid date');
    }

    if (date.getFullYear() !== year) {
        throw new Error('Could not parse date, year mismatch');
    }

    if (date.getMonth() !== month) {
        throw new Error('Could not parse date, month mismatch');
    }

    if (date.getDate() !== day) {
        throw new Error('Could not parse date, day of month mismatch');
    }
};

interface DateFormatOptions {
    localeMatcher?: 'best fit' | 'lookup';
    weekday?: 'long' | 'short' | 'narrow';
    era?: 'long' | 'short' | 'narrow';
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    formatMatcher?: 'best fit' | 'basic';
}

export const isValidDate = (date: Date): boolean => !Number.isNaN(date.getTime());

/**
 * Represents a local date without a time component. This class provides methods
 * to manipulate and inspect date values, similar to the `java.time.LocalDate` class.
 * The internal representation uses the JavaScript `Date` object for calculations.
 * This class is immutable. Every method call returns a new instance.
 *
 * This class can be instantiated with various input types, including ISO strings,
 * specific year, month, and day values, existing `Date` objects, or another `LocalDate` instance.
 *
 * Note: Months follow the JavaScript standard and are zero-based (0 = January).
 *
 * @author Timo Taubmann
 */
export class LocalDate {
    private readonly year: number;
    private readonly month: Month | number;
    private readonly date: number;

    /**
     * Creates a new date. The call goes through various constructor overloads.
     *
     * If you are using parameters that are causing an overflow, this constructor will resolve the overflow.
     * If you don't want to resolve the overflow and want a validation of your input, consider using {@link LocalDate.of} instead.
     *
     * 1. Create a date based on an ISO string:
     *    Use the constructor with a string as the argument.
     *    ```ts
     *    // Creates a date for January 1st, 2023
     *    const date = new LocalDate('2023-01-01');
     *    ```
     *
     * 2. Create a date based on three numbers:
     *    Use the constructor with three numbers.
     *    Note that the month follows the JS standard starting at 0 (January).
     *    Alternatively, the {@link Month} enum can be used here.
     *    ```ts
     *    // Creates a date for January 1st, 2023
     *    const date = new LocalDate(2023, 0, 1);
     *    const alternative = new LocalDate(2023, Month.JANUARY, 1);
     *    ```
     *
     * 3. Create a date based on a JS {@link Date}:
     *    Use the constructor with a JS {@link Date}.
     *    ```ts
     *    // Creates a date
     *    const date = new Date(...);
     *    const localdate = new LocalDate(date);
     *    ```
     *
     * 4. Create a date based on a UNIX timestamp:
     *    Use the constructor with only one parameter.
     *    ```ts
     *    const date = new LocalDate(1672531200);
     *    ```
     *
     * 5. As a copy constructor:
     *    ```ts
     *    const date = new LocalDate(2023, Month.FEBURARY, 1);
     *    const copy = new LocalDate(date);
     *    ```
     *
     * 6. Today's date:
     *    The constructor can be called without parameters.
     *    ```ts
     *    const today = new LocalDate();
     *    ```
     *
     * @param arg Either:
     *              1. a date as a string in YYYY-MM-DD format
     *              2. a year number
     *              3. a {@link Date} object
     *              4. a UNIX timestamp as a number
     *              5. a date as a {@link LocalDate} object
     * @param month If option 2 is selected, the month as a {@link Month} enum
     * @param day If option 2 is selected, the day as a number
     */
    public constructor(arg?: string | Date | LocalDate | number, month?: Month, day?: number) {
        if (typeof arg === 'string') {
            const [date] = arg.split('T');
            if (date) {
                const [yyyy, mm, dd] = date.split('-').map(Number);

                this.year = isPossibleYear(yyyy) ? yyyy : Number.NaN;
                this.month = isPossibleMonth(mm) && isMonth(mm - 1) ? mm - 1 : Number.NaN;
                this.date = isPossibleDay(dd) ? dd : Number.NaN;
            } else {
                this.year = Number.NaN;
                this.month = Number.NaN;
                this.date = Number.NaN;
            }
        } else if (arg instanceof LocalDate) {
            this.year = arg.year;
            this.month = arg.month;
            this.date = arg.date;
        } else if (typeof arg === 'number') {
            if (typeof month === 'number' && typeof day === 'number') {
                const date = new Date(arg, month, day);

                this.year = date.getFullYear();
                this.month = date.getMonth();
                this.date = date.getDate();
            } else {
                const date = new Date(arg);

                this.year = date.getFullYear();
                this.month = date.getMonth();
                this.date = date.getDate();
            }
        } else {
            const date = arg instanceof Date ? arg : new Date();

            this.year = date.getFullYear();
            this.month = date.getMonth();
            this.date = date.getDate();
        }
    }

    /**
     * Creates a LocalDate instance of today based on your local time.
     * This function is an alternative to the constructor that allows for easier creation of LocalDate instances.
     *
     * @returns a LocalDate instance representing the current date and time
     */
    public static now(): LocalDate {
        return new LocalDate();
    }

    /**
     * Creates a LocalDate instance from an ISO-8061 string representation.
     * This function is an alternative to the constructor that allows for easier creation of LocalDate instances.
     *
     * @param val the string representation of a date
     *
     * @returns a LocalDate instance based on the provided ISO-8061 string
     */
    public static parse(val: LocalDateString): LocalDate {
        const [yyyy, mm, dd] = val.split('-').map(Number);
        if (!yyyy || !mm || !dd) {
            throw new Error('Could not parse date, invalid date-string');
        }

        const date = new LocalDate(val);
        validateLocalDate(date, yyyy, mm - 1, dd);

        return date;
    }

    /**
     * Creates a LocalDate instance from the specified year, month, and day of the month.
     * Throws an error if the provided year, month, or day of the month is invalid.
     *
     * @param year the year
     * @param month the month
     * @param date the day of month
     * @returns a LocalDate instance based on the provided year, month, and day of month
     */
    public static of(year: number, month: Month, date: number): LocalDate {
        const d = new LocalDate(year, month, date);
        validateLocalDate(d, year, month, date);

        return d;
    }

    /**
     * Checks whether this date is before the other date.
     * Returns false if either this date or the other date is invalid.
     *
     * @param other the other date
     * @returns true if this date is before the other date, false otherwise
     */
    public isBefore(other: LocalDate | Date): boolean {
        const dateValid = other instanceof LocalDate ? other.valid : isValidDate(other);

        if (this.valid && dateValid) {
            if (this.year < other.getFullYear()) {
                return true;
            }

            if (this.year === other.getFullYear()) {
                const otherMonth = other.getMonth();

                if (isMonth(otherMonth)) {
                    if (this.month < otherMonth) {
                        return true;
                    }

                    if (this.month === otherMonth) {
                        return this.date < other.getDate();
                    }
                }
            }
        }

        return false;
    }

    /**
     * Checks whether this date is on the same date as the other date.
     * Returns false if either this date or the other date is invalid.
     *
     * @param other the other date
     * @returns true if this date is on the same date as the other date, false otherwise
     */
    public isEqual(other: LocalDate | Date): boolean {
        const dateValid = other instanceof LocalDate ? other.valid : isValidDate(other);
        const otherMonth = other.getMonth();

        return this.valid && dateValid &&
            this.getFullYear() === other.getFullYear() &&
            isMonth(otherMonth) && this.month === otherMonth &&
            this.date === other.getDate();
    }

    /**
     * Checks whether this date is after the other date.
     * Returns false if either this date or the other date is invalid.
     *
     * @param other the other date
     * @returns true if this date is after the other date, false otherwise
     */
    public isAfter(other: LocalDate | Date): boolean {
        const dateValid = other instanceof LocalDate ? other.valid : isValidDate(other);

        if (dateValid && this.valid) {
            if (this.year > other.getFullYear()) {
                return true;
            }

            if (this.year === other.getFullYear()) {
                const otherMonth = other.getMonth();

                if (isMonth(otherMonth)) {
                    if (this.month > otherMonth) {
                        return true;
                    }

                    if (this.month === otherMonth) {
                        return this.date > other.getDate();
                    }
                }
            }
        }

        return false;
    }

    /**
     * Checks whether this date is valid.
     *
     * @returns true if the date is valid, otherwise false
     */
    public get valid(): boolean {
        return isValidDate(new Date(Date.UTC(this.year, this.month, this.date)));
    }

    /**
     * Returns the day of the month.
     * Returns Number.NaN if the date is invalid.
     *
     * @returns The day of the month
     */
    public getDate(): number {
        return this.date;
    }

    /**
     * Returns the day of the week.
     * Returns Number.NaN if the date is invalid.
     *
     * @returns The day of the week
     */
    public getDay(): DayOfWeek {
        return this.atStartOfDay().getDay();
    }

    /**
     * Returns the year.
     * Returns Number.NaN if the date is invalid.
     *
     * @returns The year
     */
    public getFullYear(): number {
        return this.year;
    }

    /**
     * Returns the month. January is encoded as 0 and December as 11.
     * Returns Number.NaN if the date is invalid.
     *
     * @returns The month
     */
    public getMonth(): Month {
        return this.month;
    }

    /**
     * Returns the ISO date string.
     * Throws an error if the date is invalid.
     *
     * @returns The ISO date string
     */
    public toISOString(): LocalDateString {
        let isoDatetimeString: string | undefined;

        try {
            [isoDatetimeString] = new Date(Date.UTC(this.year, this.month, this.date)).toISOString().split('T');
        } catch (e) {
            throw new Error('Invalid Date', { cause: e });
        }

        if (!isLocalDateString(isoDatetimeString)) {
            throw new Error('Invalid Date');
        }

        return isoDatetimeString;
    }

    /**
     * Returns the locale date string.
     * Returns 'Invalid Date' if the date is invalid.
     *
     * @param countryCode the locale/country code
     * @param options the formatting options
     * @returns The locale date string or 'Invalid Date'
     */
    public toLocaleString(countryCode?: Intl.LocalesArgument, options?: DateFormatOptions): string {
        return this.atStartOfDay().toLocaleDateString(countryCode, {
            day: options?.day,
            era: options?.era,
            formatMatcher: options?.formatMatcher,
            localeMatcher: options?.localeMatcher,
            month: options?.month,
            weekday: options?.weekday,
            year: options?.year
        });
    }

    /**
     * Converts the date to a date string.
     * Returns 'Invalid Date' if the date is invalid.
     *
     * @returns The date string or 'Invalid Date'
     */
    public toString(): string {
        if (!this.valid) {
            return 'Invalid Date';
        }

        const date = this.atStartOfDay();
        return date.toString().slice(0, 10);
    }

    /**
     * Converts the date to a JS Date at midnight.
     * Returns an invalid JS Date if the date is invalid.
     *
     * The Date uses the same timezone as set in the browser.
     * The timezone offset is taken into account here.
     *
     * @returns The date at midnight
     */
    public atStartOfDay(): Date {
        if (!this.valid) {
            return new Date(Number.NaN);
        }

        return new Date(this.year, this.month, this.date);
    }

    /**
     * Converts the date to a JS Date at the specified time.
     * Returns an invalid JS Date if the date is invalid.
     *
     * @param time the specified time
     * @returns The date at the specified time of your timezone
     */
    public atTime(time: LocalTime): Date;

    /**
     * Converts the date to a JS Date with the specified time.
     * Returns an invalid JS Date if the date is invalid.
     *
     * @param hour the hour in 24h format
     * @param minute the minute
     * @param second the second
     * @param ms the millisecond
     * @returns The date at the specified time of your timezone
     */
    public atTime(hour: number, minute: number, second?: number, ms?: number): Date;

    /**
     * Converts the date to a JS Date with the specified time.
     * Returns an invalid JS Date if the date is invalid.
     *
     * @param time the specified time
     * @returns The date at the specified time of your timezone
     */
    public atTime(time: LocalTime): Date;

    /**
     * Converts the date to a JS Date with the specified time.
     * Returns an invalid JS Date if the date is invalid.
     *
     * @param hour the hour in 24h format or time
     * @param minute the minute
     * @param second the second
     * @param ms the millisecond
     * @returns The date at the specified time of your timezone
     */
    public atTime(hour: number | LocalTime, minute = 0, second = 0, ms = 0): Date {
        if (!this.valid) {
            return new Date(Number.NaN);
        }

        if (hour instanceof LocalTime) {
            return new Date(this.year, this.month, this.date, hour.getHours(), hour.getMinutes(), hour.getSeconds(), hour.getMilliseconds());
        }

        return new Date(this.year, this.month, this.date, hour, minute, second, ms);
    }

    /**
     * Creates a copy of this instance and adds the given years.
     *
     * @param years the years to add
     * @returns an instance of the new date
     */
    public plusYears(years: number): LocalDate {
        return new LocalDate(this.year + years, this.month, this.date);
    }

    /**
     * Creates a copy of this instance and subtracts the given years.
     *
     * @param years the years to subtract
     * @returns an instance of the new date
     */
    public minusYears(years: number): LocalDate {
        return new LocalDate(this.year - years, this.month, this.date);
    }

    /**
     * Creates a copy of this instance and sets the year to the given year.
     *
     * @param year the year to set
     * @returns an instance of the new date
     */
    public withYear(year: number): LocalDate {
        return new LocalDate(year, this.month, this.date);
    }

    /**
     * Creates a copy of this instance and subtracts the given months.
     *
     * @param months the months to subtract
     * @returns an instance of the new date
     */
    public minusMonths(months: number): LocalDate {
        return new LocalDate(this.year, this.month - months, this.date);
    }

    /**
     * Creates a copy of this instance and adds the given months.
     *
     * @param months the months to add
     * @returns an instance of the new date
     */
    public plusMonths(months: number): LocalDate {
        return new LocalDate(this.year, this.month + months, this.date);
    }

    /**
     * Creates a copy of this instance and sets the month to the given month.
     * Throws an error if no valid month was provided.
     *
     * @param month the month to set the date to
     * @returns an instance of the new date
     */
    public withMonth(month: Month): LocalDate {
        if (!isMonth(month)) {
            throw new Error('Invalid month');
        }

        return new LocalDate(this.year, month, this.date);
    }

    /**
     * Creates a copy of this instance and adds the given days.
     *
     * @param days the days to add
     * @returns an instance of the new date
     */
    public plusDays(days: number): LocalDate {
        return new LocalDate(this.year, this.month, this.date + days);
    }

    /**
     * Creates a copy of this instance and subtracts the given days.
     *
     * @param days the days to subtract
     * @returns an instance of the new date
     */
    public minusDays(days: number): LocalDate {
        return new LocalDate(this.year, this.month, this.date - days);
    }

    /**
     * Creates a copy of this instance and sets the day to the given day.
     * Throws an error if no valid day was provided.
     *
     * @param day the day to set the date to
     * @returns an instance of the new date
     */
    public withDayOfMonth(day: number): LocalDate {
        const lastOfMonth = new LocalDate(this.year, this.month, 1)
            .plusMonths(1)
            .minusDays(1);

        if (day < 1 || day > lastOfMonth.date) {
            throw new Error('Invalid day');
        }

        return new LocalDate(this.year, this.month, day);
    }
}
