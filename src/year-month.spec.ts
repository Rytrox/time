import { Month } from './month';
import { YearMonth } from './year-month';

describe('YearMonth', () => {
    it ('should create YearMonth from valid year and month', () => {
        const yearMonth = new YearMonth(2023, Month.JANUARY);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth(2023, Month.JANUARY));
    });

    it ('should create YearMonth from valid ISO-Date string', () => {
        const yearMonth = YearMonth.parse('2023-01');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth('2023-01'));
    });

    it ('should create YearMonth from valid ISO-Date string with leading zeros', () => {
        const yearMonth = YearMonth.parse('2023-01-01');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth('2023-01-01'));
    });

    it ('should create YearMonth from valid ISO-Date string with leading zeros and time', () => {
        const yearMonth = YearMonth.parse('2023-01-01T12:00:00');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth('2023-01-01T12:00:00'));
    });

    it ('should create YearMonth now', () => {
        const yearMonth = YearMonth.now();
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(new Date().getFullYear());
        expect(yearMonth.getMonth()).toBe(new Date().getMonth());
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth());
    });

    it ('should create YearMonth from params', () => {
        const yearMonth = YearMonth.of(2023, Month.JANUARY);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth(2023, Month.JANUARY));
    });

    it ('should create YearMonth from Date', () => {
        const yearMonth = new YearMonth(new Date('2023-01-01'));
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should create YearMonth from UNIX timestamp', () => {
        const yearMonth = new YearMonth(1672531200000);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.getMonth()).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should create invalid YearMonth', () => {
        const yearMonth = new YearMonth(NaN);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.valid).toBe(false);
    });

    it ('should be before a valid YearMonth', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(2023, Month.FEBRUARY);

        expect(yearMonth1.isBefore(yearMonth2)).toBe(true);
        expect(yearMonth2.isBefore(yearMonth1)).toBe(false);
    });

    it ('should not be before if one of the YearMonths are invalid', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(NaN);

        expect(yearMonth1.isBefore(yearMonth2)).toBe(false);
        expect(yearMonth2.isBefore(yearMonth1)).toBe(false);
    });

    it ('should not be before if both YearMonths are invalid', () => {
        const yearMonth1 = new YearMonth(NaN);
        const yearMonth2 = new YearMonth(NaN);

        expect(yearMonth1.isBefore(yearMonth2)).toBe(false);
        expect(yearMonth2.isBefore(yearMonth1)).toBe(false);
    });

    it ('should be after a valid YearMonth', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(2023, Month.FEBRUARY);

        expect(yearMonth2.isAfter(yearMonth1)).toBe(true);
        expect(yearMonth1.isAfter(yearMonth2)).toBe(false);
    });

    it ('should not be after if one YearMonth is invalid', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(NaN);

        expect(yearMonth1.isAfter(yearMonth2)).toBe(false);
        expect(yearMonth2.isAfter(yearMonth1)).toBe(false);
    });

    it ('should not be after if both YearMonths are invalid', () => {
        const yearMonth1 = new YearMonth(NaN);
        const yearMonth2 = new YearMonth(NaN);

        expect(yearMonth1.isAfter(yearMonth2)).toBe(false);
        expect(yearMonth2.isAfter(yearMonth1)).toBe(false);
    });

    it ('should be equal if both YearMonths are valid', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(2023, Month.JANUARY);

        expect(yearMonth1.isEqual(yearMonth2)).toBe(true);
        expect(yearMonth2.isEqual(yearMonth1)).toBe(true);
    });

    it ('should not be equal if one YearMonth is invalid', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(NaN);

        expect(yearMonth1.isEqual(yearMonth2)).toBe(false);
        expect(yearMonth2.isEqual(yearMonth1)).toBe(false);
    });

    it ('should not be equal if both YearMonths are invalid', () => {
        const yearMonth1 = new YearMonth(NaN);
        const yearMonth2 = new YearMonth(NaN);

        expect(yearMonth1.isEqual(yearMonth2)).toBe(false);
        expect(yearMonth2.isEqual(yearMonth1)).toBe(false);
    });

    it ('should not be equal if both YearMonths are valid', () => {
        const yearMonth1 = new YearMonth(2023, Month.JANUARY);
        const yearMonth2 = new YearMonth(2023, Month.APRIL);

        expect(yearMonth1.isEqual(yearMonth2)).toBe(false);
        expect(yearMonth2.isEqual(yearMonth1)).toBe(false);
    });

    it ('should return the last day of the month', () => {
        const yearMonth = new YearMonth(2023, Month.DECEMBER);
        const lastDayOfMonth = yearMonth.atEndOfMonth();

        expect(lastDayOfMonth.getDate()).toBe(31);
        expect(lastDayOfMonth.getMonth()).toBe(Month.DECEMBER);
        expect(lastDayOfMonth.getFullYear()).toBe(2023);
    });

    it ('should return the last day of the month in leap year', () => {
        const yearMonth = new YearMonth(2024, Month.FEBRUARY);
        const lastDayOfMonth = yearMonth.atEndOfMonth();

        expect(lastDayOfMonth.getDate()).toBe(29);
        expect(lastDayOfMonth.getMonth()).toBe(Month.FEBRUARY);
        expect(lastDayOfMonth.getFullYear()).toBe(2024);
    });

    it ('should return the date at a certain day of the month', () => {
        const yearMonth = new YearMonth(2023, Month.JANUARY);
        const date = yearMonth.atDay(10);

        expect(date.getDate()).toBe(10);
        expect(date.getMonth()).toBe(Month.JANUARY);
        expect(date.getFullYear()).toBe(2023);
    });

    it ('should throw an error if the date at a certain day of month does not exist', () => {
        const yearMonth = new YearMonth(2023, Month.JANUARY);

        expect(() => yearMonth.atDay(32)).toThrow();
        expect(() => yearMonth.atDay(0)).toThrow();
    });

    it ('should return the length of month', () => {
        let yearMonth = new YearMonth(2023, Month.JANUARY);
        expect(yearMonth.lengthOfMonth()).toBe(31);

        yearMonth = new YearMonth(2023, Month.APRIL);
        expect(yearMonth.lengthOfMonth()).toBe(30);
    });

    it ('should return the length of February', () => {
        const yearMonth = new YearMonth(2023, Month.FEBRUARY);
        expect(yearMonth.lengthOfMonth()).toBe(28);
    });

    it ('should return the length of February in leap year', () => {
        const yearMonth = new YearMonth(2024, Month.FEBRUARY);
        expect(yearMonth.lengthOfMonth()).toBe(29);
    });

    it ('should return a string on toString', () => {
        const yearMonth = new YearMonth(2023, Month.JANUARY);
        const toString = yearMonth.toString();

        expect(toString).toBe('Jan 2023');
    });

    it ('should return invalid year-month on toString', () => {
        const yearMonth = new YearMonth(NaN);
        const toString = yearMonth.toString();

        expect(toString).toBe('Invalid year-month');
    });

    it ('should return locale string', () => {
        const yearMonth = new YearMonth(2023, Month.JANUARY);

        expect(yearMonth.toLocaleString()).toBe('01/2023');
        // Siehe https://github.com/nodejs/node/issues/61861
        expect(yearMonth.toLocaleString('de-DE')).toBe('01/2023');

        expect(yearMonth.toLocaleString('de-DE', { month: 'long', year: 'numeric' })).toBe('Januar 2023');
    });

    it ('should return an ISO-Date string', () => {
        const yearMonth = new YearMonth(2023, Month.JANUARY);
        expect(yearMonth.toISOString()).toBe('2023-01');
    });

    it ('should throw an error on getting iso string with invalid year', () => {
        expect(() => new YearMonth(NaN).toISOString()).toThrow();
    });
});
