import { Month, isMonth } from './month';
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

export class YearMonth {
    private readonly year: number;
    private readonly month: number;

    public constructor(year?: number | Date | LocalDate | YearMonth | string, month?: Month) {
        if (typeof year === 'number') {
            if (isMonth(month)) {
                this.year = year;
                this.month = month;
            } else {
                const date = new Date(year);

                this.year = date.getFullYear();
                this.month = date.getMonth();
            }
        } else if (typeof year === 'string') {
            const [yyyy, mm] = year.split('-').map(Number);

            this.year = yyyy ?? Number.NaN;
            this.month = typeof mm === 'number' && isMonth(mm - 1) ? mm - 1 : Number.NaN;
        } else if (year) {
            this.year = year.getFullYear();
            this.month = year.getMonth();
        } else {
            const now = new Date();

            this.year = now.getFullYear();
            this.month = now.getMonth();
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
        const y = new YearMonth(year, month);

        if (!y.valid || y.getMonth() !== month || y.getFullYear() !== year) {
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
        return this.year > 0 && isMonth(this.month);
    }

    public isBefore(other: YearMonth | LocalDate | Date): boolean {
        const otherMonth = other.getMonth();
        if (!isMonth(otherMonth)) {
            return false;
        }

        return this.year < other.getFullYear() || (this.year === other.getFullYear() && this.month < otherMonth);
    }

    public isAfter(other: YearMonth | LocalDate | Date): boolean {
        const otherMonth = other.getMonth();
        if (!isMonth(otherMonth)) {
            return false;
        }

        return this.year > other.getFullYear() || (this.year === other.getFullYear() && this.month > otherMonth);
    }

    public isEqual(other: YearMonth | LocalDate | Date): boolean {
        const otherMonth = other.getMonth();
        if (!isMonth(otherMonth)) {
            return false;
        }

        return this.year === other.getFullYear() && this.month === otherMonth;
    }

    public getFullYear(): number {
        return this.year;
    }

    public getMonth(): Month {
        return this.month;
    }

    public atEndOfMonth(): LocalDate {
        return new LocalDate(this.year, this.month, 1)
            .plusMonths(1)
            .minusDays(1);
    }

    public atDay(day: number): LocalDate {
        if (day <= 0 || day > this.lengthOfMonth()) {
            throw new Error('Invalid day');
        }

        return new LocalDate(this.year, this.month, day);
    }

    public lengthOfMonth(): number {
        return this.atEndOfMonth().getDate();
    }

    public toString(): string {
        if (!this.valid) {
            return 'Invalid year-month';
        }

        const date = new Date(this.year, this.month, 1);

        return `${date.toString().slice(4, 7)} ${date.toString().slice(11, 15)}`;
    }

    public toLocaleString(lang?: Intl.LocalesArgument, options?: YearMonthOptions): string {
        const formatter = new Intl.DateTimeFormat(lang, {
            month: options?.month ?? '2-digit',
            year: options?.year ?? 'numeric'
        });

        return formatter.format(new Date(this.year, this.month, 1));
    }

    public toISOString(): YearMonthString {
        const month = this.month + 1;
        const iso = `${this.year.toString()}-${month.toFixed().padStart(2, '0')}`;

        if (!isYearMonthString(iso)) {
            throw new Error('Invalid year-month');
        }

        return iso;
    }
}
