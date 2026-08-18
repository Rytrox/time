import { JSMonth, Month, isJSMonth, isMonth, toJSMonth, toMonth } from './month';
import { LocalDate } from './local-date';

export type YearMonthString = `${number}-${0 | 1}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

export const isYearMonthString = (val: unknown): val is YearMonthString => {
    if (typeof val === 'string') {
        const [year, month] = val.split('-').map(Number);

        return typeof year === 'number' && year > 0 && typeof month === 'number' && month > 0 && month <= 12;
    }

    return false;
};

type YearMonthOptions = Pick<Intl.DateTimeFormatOptions, 'month' | 'year'>;
type Temporal = LocalDate | YearMonth | Date;

export class YearMonth {
    private readonly _year: number;
    private readonly _month: number;

    public constructor(year?: number | Date | LocalDate | YearMonth | string, month?: JSMonth) {
        if (typeof year === 'number') {
            if (isJSMonth(month)) {
                this._year = year;
                this._month = month;
            } else {
                const date = new Date(year);

                this._year = date.getFullYear();
                this._month = date.getMonth();
            }
        } else if (typeof year === 'string') {
            const [yyyy, mm] = year.split('-').map(Number);

            this._year = yyyy ?? Number.NaN;
            this._month = typeof mm === 'number' && isMonth(mm) ? toJSMonth(mm) : Number.NaN;
        } else if (year) {
            this._year = year.getFullYear();
            this._month = year.getMonth();
        } else {
            const now = new Date();

            this._year = now.getFullYear();
            this._month = now.getMonth();
        }
    }

    /**
     * Parses an ISO-8601 string into a YearMonth object.
     * This function is an alternative to the constructor call.
     *
     * @param value the ISO-8601 string to parse
     */
    public static parse(value: YearMonthString): YearMonth {
        const y = new YearMonth(value);

        if (!y.valid) {
            throw new Error('Invalid YearMonth');
        }

        return y;
    }

    /**
     * Returns a YearMonth based on the provided year and month.
     *
     * @param year the Year
     * @param month the Month
     *
     * @returns a YearMonth based on the provided year and month
     */
    public static of(year: number, month: Month): YearMonth {
        const y = new YearMonth(year, toJSMonth(month));

        if (!y.valid || y.getMonth() !== toJSMonth(month) || y.getFullYear() !== year) {
            throw new Error('Invalid YearMonth');
        }

        return y;
    }

    /**
     * Returns the current YearMonth.
     *
     * @returns the current YearMonth
     */
    public static now(): YearMonth {
        return new YearMonth();
    }

    /**
     * Returns true if the YearMonth is valid.
     *
     * @returns true if the YearMonth is valid, false otherwise
     */
    public get valid(): boolean {
        return this._year > 0 && isJSMonth(this._month);
    }

    public isBefore(other: Temporal): boolean {
        const otherMonth = other.getMonth();
        if (!isJSMonth(otherMonth)) {
            return false;
        }

        return this._year < other.getFullYear() || (this._year === other.getFullYear() && this._month < otherMonth);
    }

    public isAfter(other: Temporal): boolean {
        const otherMonth = other.getMonth();
        if (!isJSMonth(otherMonth)) {
            return false;
        }

        return this._year > other.getFullYear() || (this._year === other.getFullYear() && this._month > otherMonth);
    }

    public isEqual(other: Temporal): boolean {
        const otherMonth = other.getMonth();
        if (!isJSMonth(otherMonth)) {
            return false;
        }

        return this._year === other.getFullYear() && this._month === otherMonth;
    }

    /**
     * Returns the year.
     * Returns Number.NaN if the date is invalid.
     *
     * @returns The year
     */
    public getFullYear(): number {
        return this._year;
    }

    /**
     * Save accessor to return the year.
     * Returns Number.NaN if the date is invalid.
     *
     * It uses the old JS date. For more precise results, use the {@link year} accessor.
     *
     * @returns The year
     */
    public get year(): number {
        return this._year;
    }

    /**
     * Returns the month. January is encoded as 0 and December as 11.
     * Returns Number.NaN if the date is invalid.
     *
     * It uses the old JS date. For more precise results, use the {@link month} accessor.
     *
     * @returns The month
     */
    public getMonth(): JSMonth {
        return this._month;
    }

    /**
     * Save accessor to return the month. January is encoded as 1 and December as 12.
     * Returns Number.NaN if the date is invalid.
     **
     * @returns The month
     */
    public get month(): Month {
        return toMonth(this._month);
    }

    /**
     * Creates a LocalDate at the end of the month in this year-month.
     * If it's february of a leap year, it will return the last day of the month, e.g., February 29th.
     *
     * @returns The LocalDate at the end of the month
     */
    public atEndOfMonth(): LocalDate {
        return new LocalDate(this._year, this._month, 1)
            .plusMonths(1)
            .minusDays(1);
    }

    /**
     * Creates a LocalDate at the given day in this year-month.
     * If the day is invalid, it will throw an error.
     *
     * @param day the day of the month
     */
    public atDay(day: number): LocalDate {
        if (day <= 0 || day > this.lengthOfMonth()) {
            throw new Error('Invalid day');
        }

        return new LocalDate(this._year, this._month, day);
    }

    /**
     * Returns the number of days in the month.
     *
     * @returns The number of days in the month
     */
    public lengthOfMonth(): number {
        return this.atEndOfMonth().getDate();
    }

    /**
     * Returns a string representation of the year-month.
     *
     * @returns The string representation of the year-month
     */
    public toString(): string {
        if (!this.valid) {
            return 'Invalid year-month';
        }

        const date = new Date(this._year, this._month, 1);

        return `${date.toString().slice(4, 7)} ${date.toString().slice(11, 15)}`;
    }

    /**
     * Returns a localized string representation of the year-month.
     *
     * @param lang The language to use for formatting
     * @param options Options for formatting the year-month
     * @returns The localized string representation of the year-month
     */
    public toLocaleString(lang?: Intl.LocalesArgument, options?: YearMonthOptions): string {
        const formatter = new Intl.DateTimeFormat(lang, {
            month: options?.month ?? '2-digit',
            year: options?.year ?? 'numeric'
        });

        return formatter.format(new Date(this._year, this._month, 1));
    }

    /**
     * Returns a string representation of the year-month in ISO format.
     *
     * @returns The ISO string representation of the year-month
     */
    public toISOString(): YearMonthString {
        const month = toMonth(this._month);
        const iso = `${this._year.toString()}-${month.toFixed().padStart(2, '0')}`;

        if (!isYearMonthString(iso)) {
            throw new Error('Invalid year-month');
        }

        return iso;
    }
}
