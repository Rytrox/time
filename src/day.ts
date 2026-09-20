/**
 * An enum representing the days of the week.
 */
export enum DayOfWeek {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}

/**
 * Checks if the given value is a valid day of the week.
 * @param val the value to check
 */
export const isDayOfWeek = (val: unknown): val is DayOfWeek => typeof val === 'number' && val >= DayOfWeek.SUNDAY && val <= DayOfWeek.SATURDAY;

export const DAYS = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY
];
