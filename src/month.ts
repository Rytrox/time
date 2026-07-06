/**
 * Enum representing the months of the year.
 * Values are zero-based, following the JavaScript standard (0 = January, 11 = December),
 * making them directly compatible with `Date.getMonth()` and the {@link LocalDate} class.
 */
export enum Month {
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
 * Type guard that checks whether the given value is a valid {@link Month}.
 * A valid month is an integer between 0 (January) and 11 (December) inclusive.
 *
 * @param value the value to check
 * @returns true if the value is a valid {@link Month}, otherwise false
 */
export const isMonth = (value: unknown): value is Month => typeof value === 'number' && value >= 0 && value <= 11;

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
