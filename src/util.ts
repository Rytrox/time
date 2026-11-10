/**
 * Creates a JS Date in the local timezone, like `new Date(year, month, day, ...)`,
 * but without the legacy mapping of years 0-99 to 1900-1999. Overflows are resolved the same way.
 *
 * @returns the created date, or an invalid date if any component is NaN
 */
export const createLocalDate = (year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0, ms = 0): Date => {
    // Start at noon, so setting the date can never land in a daylight-saving gap
    const date = new Date(2000, 0, 1, 12);
    date.setFullYear(year, month, day);
    date.setHours(hours, minutes, seconds, ms);

    return date;
};

/**
 * Creates a JS Date at midnight UTC, like `new Date(Date.UTC(year, month, day))`,
 * but without the legacy mapping of years 0-99 to 1900-1999. Overflows are resolved the same way.
 *
 * @returns the created date, or an invalid date if any component is NaN
 */
export const createUTCDate = (year: number, month: number, day: number): Date => {
    const date = new Date(0);
    date.setUTCFullYear(year, month, day);

    return date;
};

/**
 * Returns the number of days in the given month, taking leap years into account.
 *
 * @param year the year
 * @param month the month as JSMonth (0 = January)
 * @returns the number of days in the month, or NaN if any component is NaN
 */
export const lengthOfMonth = (year: number, month: number): number => createUTCDate(year, month + 1, 0).getUTCDate();
