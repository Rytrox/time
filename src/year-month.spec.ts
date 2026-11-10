import { JSMonth, Month, toMonth } from './month';
import { YearMonth, isYearMonthString } from './year-month';

describe('YearMonth', () => {
    it ('should be a valid YearMonthString', () => {
        expect(isYearMonthString('2023-01')).toBe(true);
        expect(isYearMonthString('2023-12')).toBe(true);
        expect(isYearMonthString('0999-01')).toBe(true);
    });

    it ('should not be a valid YearMonthString', () => {
        for (const value of [
            '2023-01-15',
            '2023-01-01T12:00:00',
            '2023-1',
            '23-01',
            '2023-1.5',
            '1.5-1.5',
            '2023-00',
            '2023-13',
            '0000-01',
            '+2023-01',
            ' 2023-01',
            '2023-01 ',
            '',
            202301,
            null
        ]) {
            expect(isYearMonthString(value)).toBe(false);
        }
    });

    it ('should only parse strict YearMonthStrings', () => {
        for (const value of ['2023-01-15', '2023-1.5', '1.5-1.5', '2023-1', '2023-13']) {
            // Cast simulates untyped input (e.g. from JSON)
            expect(() => YearMonth.parse(value as `${number}-${0 | 1}${0}`)).toThrow();
        }
    });

    it ('should be invalid for non-integer year or month', () => {
        expect(new YearMonth('2023-1.5').valid).toBe(false);
        expect(new YearMonth('2023.5-01').valid).toBe(false);
        expect(() => new YearMonth('2023-1.5').toISOString()).toThrow();
    });

    it ('should pad the year to four digits in ISO-String', () => {
        expect(new YearMonth(999, JSMonth.MARCH).toISOString()).toBe('0999-03');
        expect(YearMonth.parse('0999-03').getFullYear()).toBe(999);
    });

    it ('should create YearMonth from valid year and month', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(YearMonth.of(2023, Month.JANUARY));
    });

    it ('should create YearMonth from valid ISO-Date string', () => {
        const yearMonth = new YearMonth('2023-01');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(YearMonth.parse('2023-01'));
    });

    it ('should create YearMonth from valid ISO-Date string with leading zeros', () => {
        const yearMonth = new YearMonth('2023-01-01');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should create YearMonth from valid ISO-Date string with leading zeros and time', () => {
        const yearMonth = new YearMonth('2023-01-01T12:00:00');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should create YearMonth now', () => {
        const yearMonth = YearMonth.now();
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(new Date().getFullYear());
        expect(yearMonth.getMonth()).toBe(new Date().getMonth());
        expect(yearMonth.year).toBe(new Date().getFullYear());
        expect(yearMonth.month).toBe(toMonth(new Date().getMonth()));
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(new YearMonth());
    });

    it ('should create YearMonth from params', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);

        expect(yearMonth).toEqual(YearMonth.of(2023, Month.JANUARY));
    });

    it ('should create YearMonth from Date', () => {
        // A Date is read in the local timezone, so the input must be created in local time as well
        const yearMonth = new YearMonth(new Date(2023, 0, 1));
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should create YearMonth from UNIX timestamp', () => {
        // Timestamp of January 1st, 2023 at local midnight, so the test works in every timezone
        const yearMonth = new YearMonth(new Date(2023, 0, 1).getTime());
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should create invalid YearMonth', () => {
        const yearMonth = new YearMonth(NaN);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.valid).toBe(false);
    });

    it ('should parse valid ISO-Date string', () => {
        const yearMonth = YearMonth.parse('2023-01');
        expect(yearMonth).toBeDefined();
        expect(yearMonth.getFullYear()).toBe(2023);
        expect(yearMonth.year).toBe(2023);
        expect(yearMonth.getMonth()).toBe(JSMonth.JANUARY);
        expect(yearMonth.month).toBe(Month.JANUARY);
        expect(yearMonth.valid).toBe(true);
    });

    it ('should throw error if invalid ISO-Date string is provided', () => {
        expect(() => YearMonth.parse('2023-13')).toThrow();
    });

    it ('should create and validate YearMonth', () => {
        const yearMonth = YearMonth.of(2023, Month.JANUARY);
        expect(yearMonth).toBeDefined();
        expect(yearMonth.valid).toBe(true);
    });

    it ('should throw error if invalid YearMonth params is provided', () => {
        expect(() => YearMonth.of(2023, 13 as Month)).toThrow();
    });

    it ('should be before a valid YearMonth', () => {
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
        const yearMonth2 = new YearMonth(2023, JSMonth.FEBRUARY);

        expect(yearMonth1.isBefore(yearMonth2)).toBe(true);
        expect(yearMonth2.isBefore(yearMonth1)).toBe(false);
    });

    it ('should not be before if one of the YearMonths are invalid', () => {
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
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
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
        const yearMonth2 = new YearMonth(2023, JSMonth.FEBRUARY);

        expect(yearMonth2.isAfter(yearMonth1)).toBe(true);
        expect(yearMonth1.isAfter(yearMonth2)).toBe(false);
    });

    it ('should not be after if one YearMonth is invalid', () => {
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
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
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
        const yearMonth2 = new YearMonth(2023, JSMonth.JANUARY);

        expect(yearMonth1.isEqual(yearMonth2)).toBe(true);
        expect(yearMonth2.isEqual(yearMonth1)).toBe(true);
    });

    it ('should not be equal if one YearMonth is invalid', () => {
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
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
        const yearMonth1 = new YearMonth(2023, JSMonth.JANUARY);
        const yearMonth2 = new YearMonth(2023, JSMonth.APRIL);

        expect(yearMonth1.isEqual(yearMonth2)).toBe(false);
        expect(yearMonth2.isEqual(yearMonth1)).toBe(false);
    });

    it ('should return the last day of the month', () => {
        const yearMonth = new YearMonth(2023, JSMonth.DECEMBER);
        const lastDayOfMonth = yearMonth.atEndOfMonth();

        expect(lastDayOfMonth.getDate()).toBe(31);
        expect(lastDayOfMonth.dateOfMonth).toBe(31);
        expect(lastDayOfMonth.getMonth()).toBe(JSMonth.DECEMBER);
        expect(lastDayOfMonth.month).toBe(Month.DECEMBER);
        expect(lastDayOfMonth.getFullYear()).toBe(2023);
        expect(lastDayOfMonth.year).toBe(2023);
    });

    it ('should return the last day of the month in leap year', () => {
        const yearMonth = new YearMonth(2024, JSMonth.FEBRUARY);
        const lastDayOfMonth = yearMonth.atEndOfMonth();

        expect(lastDayOfMonth.getDate()).toBe(29);
        expect(lastDayOfMonth.dateOfMonth).toBe(29);
        expect(lastDayOfMonth.getMonth()).toBe(JSMonth.FEBRUARY);
        expect(lastDayOfMonth.month).toBe(Month.FEBRUARY);
        expect(lastDayOfMonth.getFullYear()).toBe(2024);
        expect(lastDayOfMonth.year).toBe(2024);
    });

    it ('should return the date at a certain day of the month', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);
        const date = yearMonth.atDay(10);

        expect(date.getDate()).toBe(10);
        expect(date.dateOfMonth).toBe(10);
        expect(date.getMonth()).toBe(JSMonth.JANUARY);
        expect(date.month).toBe(Month.JANUARY);
        expect(date.getFullYear()).toBe(2023);
        expect(date.year).toBe(2023);
    });

    it ('should throw an error if the date at a certain day of month does not exist', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);

        expect(() => yearMonth.atDay(32)).toThrow();
        expect(() => yearMonth.atDay(0)).toThrow();
    });

    it ('should return the length of month', () => {
        let yearMonth = new YearMonth(2023, JSMonth.JANUARY);
        expect(yearMonth.lengthOfMonth()).toBe(31);

        yearMonth = new YearMonth(2023, JSMonth.APRIL);
        expect(yearMonth.lengthOfMonth()).toBe(30);
    });

    it ('should return the length of February', () => {
        const yearMonth = new YearMonth(2023, JSMonth.FEBRUARY);
        expect(yearMonth.lengthOfMonth()).toBe(28);
    });

    it ('should return the length of February in leap year', () => {
        const yearMonth = new YearMonth(2024, JSMonth.FEBRUARY);
        expect(yearMonth.lengthOfMonth()).toBe(29);
    });

    it ('should return a string on toString', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);
        const toString = yearMonth.toString();

        expect(toString).toBe('Jan 2023');
    });

    it ('should return invalid year-month on toString', () => {
        const yearMonth = new YearMonth(NaN);
        const toString = yearMonth.toString();

        expect(toString).toBe('Invalid year-month');
    });

    it ('should return locale string', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);

        expect(yearMonth.toLocaleString()).toBe('01/2023');
        // Siehe https://github.com/nodejs/node/issues/61861
        expect(yearMonth.toLocaleString('de-DE')).toBe('01/2023');

        expect(yearMonth.toLocaleString('de-DE', { month: 'long', year: 'numeric' })).toBe('Januar 2023');
    });

    it ('should return an ISO-Date string', () => {
        const yearMonth = new YearMonth(2023, JSMonth.JANUARY);
        expect(yearMonth.toISOString()).toBe('2023-01');
    });

    it ('should throw an error on getting iso string with invalid year', () => {
        expect(() => new YearMonth(NaN).toISOString()).toThrow();
    });
    it ('should keep years between 0 and 99', () => {
        const yearMonth = YearMonth.of(50, Month.FEBRUARY);

        expect(yearMonth.atEndOfMonth().toISOString()).toBe('0050-02-28');
        expect(yearMonth.lengthOfMonth()).toBe(28);
        expect(yearMonth.atDay(1).getFullYear()).toBe(50);
        expect(yearMonth.toString()).toBe('Feb 0050');
        expect(YearMonth.of(48, Month.FEBRUARY).lengthOfMonth()).toBe(29);
    });
    it ('should display invalid year-months as Invalid Date in locale string', () => {
        expect(new YearMonth(NaN).toLocaleString()).toBe('Invalid Date');
        expect(new YearMonth('foo').toLocaleString('de-DE')).toBe('Invalid Date');
    });

    it ('should be invalid beyond the range of JS dates', () => {
        expect(new YearMonth(275760, JSMonth.SEPTEMBER).valid).toBe(true);
        expect(new YearMonth(275760, JSMonth.OCTOBER).valid).toBe(false);
        expect(new YearMonth(300000, JSMonth.JANUARY).valid).toBe(false);
    });
});
