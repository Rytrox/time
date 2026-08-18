/**
 * Enum representing the months of the year.
 * Values are zero-based, following the JavaScript standard (0 = January, 11 = December),
 * making them directly compatible with `Date.getMonth()` and the {@link LocalDate} class.
 */
export enum JSMonth {
    JANUARY,
    FEBRUARY,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULY,
    AUGUST,
    SEPTEMBER,
    OCTOBER,
    NOVEMBER,
    DECEMBER
}

/**
 * Type guard that checks whether the given value is a valid {@link JSMonth}.
 * A valid month is an integer between 0 (January) and 11 (December) inclusive.
 *
 * @param value the value to check
 * @returns true if the value is a valid {@link Month}, otherwise false
 */
export const isJSMonth = (value: unknown): value is JSMonth => typeof value === 'number' && value >= 0 && value <= 11;

export enum Month {
    JANUARY = 1,
    FEBRUARY = 2,
    MARCH = 3,
    APRIL = 4,
    MAY = 5,
    JUNE = 6,
    JULY = 7,
    AUGUST = 8,
    SEPTEMBER = 9,
    OCTOBER = 10,
    NOVEMBER = 11,
    DECEMBER = 12
}

/**
 * Type guard that checks whether the given value is a valid {@link Month}.
 * A valid month is an integer between 0 (January) and 11 (December) inclusive.
 *
 * @param value the value to check
 * @returns true if the value is a valid {@link Month}, otherwise false
 */
export const isMonth = (value: unknown): value is Month => typeof value === 'number' && value > 0 && value <= 12;

/**
 * A readonly array containing all js-months of the year in order, from {@link JSMonth.JANUARY} to {@link JSMonth.DECEMBER}.
 * Useful for iteration, rendering month pickers, or mapping over all months.
 *
 * @example
 * ```ts
 * MONTHS.forEach(month => console.log(Month[month]));
 * ```
 */
export const JS_MONTHS = [
    JSMonth.JANUARY,
    JSMonth.FEBRUARY,
    JSMonth.MARCH,
    JSMonth.APRIL,
    JSMonth.MAY,
    JSMonth.JUNE,
    JSMonth.JULY,
    JSMonth.AUGUST,
    JSMonth.SEPTEMBER,
    JSMonth.OCTOBER,
    JSMonth.NOVEMBER,
    JSMonth.DECEMBER
] satisfies readonly JSMonth[];

/**
 * Converts a js-month to a month.
 * @param jsMonth the js-month to convert
 */
export const toMonth = (jsMonth: JSMonth): Month => jsMonth + 1;

/**
 * Converts a month to a js-month.
 * @param month the month to convert
 */
export const toJSMonth = (month: Month): JSMonth => month - 1;

/**
 * A readonly array containing all months of the year in order, from {@link Month.JANUARY} to {@link Month.DECEMBER}.
 * Useful for iteration, rendering month pickers, or mapping over all months.
 *
 * @example
 * ```ts
 * MONTHS.forEach(month => console.log(Month[month]));
 * ```
 */
export const MONTHS = [
    Month.JANUARY,
    Month.FEBRUARY,
    Month.MARCH,
    Month.APRIL,
    Month.MAY,
    Month.JUNE,
    Month.JULY,
    Month.AUGUST,
    Month.SEPTEMBER,
    Month.OCTOBER,
    Month.NOVEMBER,
    Month.DECEMBER
] satisfies readonly Month[];
