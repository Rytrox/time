import { JSMonth, Month, toMonth } from './month';
import { LocalDate, isLocalDateString } from './local-date';
import { DayOfWeek } from './day';
import { LocalTime } from './local-time';

describe('LocalDate', () => {
    /**
     * CONSTRUCTOR
     */

    it ('should create an instance of today', () => {
        const today = new LocalDate();
        expect(today).toBeTruthy();

        expect(today.getFullYear()).toBe(new Date().getFullYear());
        expect(today.year).toBe(new Date().getFullYear());
        expect(today.getMonth()).toBe(new Date().getMonth());
        expect(today.month).toBe(new Date().getMonth() + 1);
        expect(today.getDate()).toBe(new Date().getDate());
        expect(today.dateOfMonth).toBe(new Date().getDate());
        expect(today.getDay()).toBe(new Date().getDay());
    });

    it ('should create an instance with a specific date', () => {
        const today = new LocalDate(2023, 11, 25);
        expect(today).toBeTruthy();

        expect(today.getFullYear()).toBe(2023);
        expect(today.getMonth()).toBe(JSMonth.DECEMBER);
        expect(today.month).toBe(Month.DECEMBER);
        expect(today.getDate()).toBe(25);
        expect(today.dateOfMonth).toBe(25);

        const save = LocalDate.of(2023, Month.DECEMBER, 25);
        expect(save.year).toBe(2023);
        expect(save.getFullYear()).toBe(2023);
        expect(save.month).toBe(Month.DECEMBER);
        expect(save.getMonth()).toBe(JSMonth.DECEMBER);
        expect(save.dateOfMonth).toBe(25);
        expect(save.getDate()).toBe(25);
    });

    it ('should create an instance from a date', () => {
        // A Date is read in the local timezone, so the input must be created in local time as well
        const today = new LocalDate(new Date(2023, 11, 25));
        expect(today).toBeTruthy();

        expect(today.getFullYear()).toBe(2023);
        expect(today.year).toBe(2023);
        expect(today.getMonth()).toBe(JSMonth.DECEMBER);
        expect(today.month).toBe(Month.DECEMBER);
        expect(today.getDate()).toBe(25);
        expect(today.dateOfMonth).toBe(25);
        expect(today.getDay()).toBe(DayOfWeek.MONDAY);
    });

    it ('should create an instance from an unix timestamp', () => {
        const today = new LocalDate(Date.now());
        expect(today).toBeTruthy();

        expect(today.getFullYear()).toBe(new Date().getFullYear());
        expect(today.year).toBe(new Date().getFullYear());
        expect(today.getMonth()).toBe(new Date().getMonth());
        expect(today.month).toBe(new Date().getMonth() + 1);
        expect(today.getDate()).toBe(new Date().getDate());
        expect(today.dateOfMonth).toBe(new Date().getDate());
        expect(today.getDay()).toBe(new Date().getDay());
    });

    it ('should create an invalid instance', () => {
        const date = new LocalDate(NaN);
        expect(date).toBeTruthy();

        expect(date.valid).toBe(false);
    });

    it ('should create an instance by a unix timestamp', () => {
        const date = new LocalDate(Date.now());
        expect(date).toBeTruthy();

        expect(date.valid).toBe(true);
        expect(date.getFullYear()).toBe(new Date().getFullYear());
        expect(date.year).toBe(new Date().getFullYear());
        expect(date.getMonth()).toBe(new Date().getMonth());
        expect(date.month).toBe(new Date().getMonth() + 1);
        expect(date.getDate()).toBe(new Date().getDate());
        expect(date.dateOfMonth).toBe(new Date().getDate());
        expect(date.getDay()).toBe(new Date().getDay());
    });

    it ('should create an instance by ISO-8601', () => {
        const date = new LocalDate('2023-11-25');
        expect(date).toBeTruthy();

        expect(date.valid).toBe(true);
        expect(date.getFullYear()).toBe(2023);
        expect(date.year).toBe(2023);
        expect(date.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(date.month).toBe(Month.NOVEMBER);
        expect(date.getDate()).toBe(25);
        expect(date.dateOfMonth).toBe(25);

        const date2 = new LocalDate('2023-11-25T12:00:00Z');
        expect(date2.valid).toBe(true);
        expect(date2.getFullYear()).toBe(2023);
        expect(date2.year).toBe(2023);
        expect(date2.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(date2.month).toBe(Month.NOVEMBER);
        expect(date2.getDate()).toBe(25);
        expect(date2.dateOfMonth).toBe(25);
    });

    it ('should create a copy', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const copy = new LocalDate(date);

        expect(copy).toBeTruthy();
        expect(copy.valid).toBe(true);
        expect(copy.getFullYear()).toBe(2023);
        expect(copy.year).toBe(2023);
        expect(copy.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(copy.month).toBe(Month.NOVEMBER);
        expect(copy.getDate()).toBe(25);
        expect(copy.dateOfMonth).toBe(25);
    });

    it ('should create invalid instance by ISO-8601', () => {
        const date = new LocalDate('2023-13-25');
        expect(date.valid).toBe(false);
    });

    it ('should create invalid instance for non-existing dates by ISO-8601', () => {
        for (const iso of ['2023-02-29', '2023-02-31', '2023-04-31', '2024-02-30']) {
            const date = new LocalDate(iso);

            expect(date.valid).toBe(false);
            expect(date.getFullYear()).toBeNaN();
            expect(date.getMonth()).toBeNaN();
            expect(date.getDate()).toBeNaN();
            expect(() => date.toISOString()).toThrow();
        }
    });

    it ('should accept leap days and month ends by ISO-8601', () => {
        expect(new LocalDate('2024-02-29').toISOString()).toBe('2024-02-29');
        expect(new LocalDate('2000-02-29').toISOString()).toBe('2000-02-29');
        expect(new LocalDate('2023-04-30').toISOString()).toBe('2023-04-30');
        expect(new LocalDate('2023-12-31').toISOString()).toBe('2023-12-31');
    });

    /**
     * PARSE
     */

    it ('should parse an iso-8601 string', () => {
        const date = LocalDate.parse('2023-11-25');
        expect(date.valid).toBe(true);
        expect(date.getFullYear()).toBe(2023);
        expect(date.year).toBe(2023);
        expect(date.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(date.month).toBe(Month.NOVEMBER);
        expect(date.getDate()).toBe(25);
        expect(date.dateOfMonth).toBe(25);

        const date1 = LocalDate.parse('2009-01-19');
        expect(date1.valid).toBe(true);
        expect(date1.getFullYear()).toBe(2009);
        expect(date1.year).toBe(2009);
        expect(date1.getMonth()).toBe(JSMonth.JANUARY);
        expect(date1.month).toBe(Month.JANUARY);
        expect(date1.getDate()).toBe(19);
        expect(date1.dateOfMonth).toBe(19);
    });

    it ('should throw an error while parsing with ISO-8601', () => {
        expect(() => LocalDate.parse('2023-13-25')).toThrow();
        expect(() => LocalDate.parse('1.085-11-31')).toThrow();
        expect(() => LocalDate.parse('1.085-13-31')).toThrow();
    });

    /**
     * OF
     */

    it ('should return a valid LocalDate', () => {
        const date = LocalDate.of(2023, Month.NOVEMBER, 25);
        expect(date.valid).toBe(true);

        expect(date.getFullYear()).toBe(2023);
        expect(date.year).toBe(2023);
        expect(date.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(date.month).toBe(Month.NOVEMBER);
        expect(date.getDate()).toBe(25);
        expect(date.dateOfMonth).toBe(25);
    });

    /**
     * NOW
     */

    it ('should return a valid LocalDate', () => {
        const date = LocalDate.now();
        expect(date.valid).toBe(true);

        expect(date.getFullYear()).toBe(new Date().getFullYear());
        expect(date.year).toBe(new Date().getFullYear());
        expect(date.getMonth()).toBe(new Date().getMonth());
        expect(date.month).toBe(toMonth(new Date().getMonth()));
        expect(date.getDate()).toBe(new Date().getDate());
        expect(date.dateOfMonth).toBe(new Date().getDate());
    });

    it ('should throw an error while parsing invalid dates', () => {
        expect(() => LocalDate.of(1.085, Month.NOVEMBER, 31)).toThrow();
        expect(() => LocalDate.of(2024, 16 as Month, 31)).toThrow();
        expect(() => LocalDate.of(2023, Month.JANUARY, 42)).toThrow();
    });

    it ('should return false on comparison with invalid Dates', () => {
        const invalid = new LocalDate(NaN);
        expect(invalid.valid).toBe(false);

        expect(invalid.isBefore(new LocalDate(2023, JSMonth.NOVEMBER, 25))).toBe(false);
        expect(invalid.isBefore(new LocalDate())).toBe(false);
        expect(invalid.isBefore(new LocalDate(NaN))).toBe(false);

        expect(invalid.isAfter(new LocalDate(2023, JSMonth.NOVEMBER, 25))).toBe(false);
        expect(invalid.isAfter(new LocalDate())).toBe(false);
        expect(invalid.isAfter(new LocalDate(NaN))).toBe(false);

        expect(invalid.isEqual(new LocalDate(2023, JSMonth.NOVEMBER, 25))).toBe(false);
        expect(invalid.isEqual(new LocalDate())).toBe(false);
        expect(invalid.isEqual(new LocalDate(NaN))).toBe(false);

        const valid = new LocalDate();
        expect(valid.isBefore(new LocalDate(NaN))).toBe(false);
        expect(valid.isEqual(new LocalDate(NaN))).toBe(false);
        expect(valid.isAfter(new LocalDate(NaN))).toBe(false);
    });

    it ('should be before a date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isBefore(new LocalDate(2023, JSMonth.NOVEMBER, 26))).toBe(true);
        expect(date.isBefore(new LocalDate(2024, JSMonth.NOVEMBER, 25))).toBe(true);
        expect(date.isBefore(new LocalDate(2023, JSMonth.DECEMBER, 25))).toBe(true);
    });

    it ('should not be before the same date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isBefore(new LocalDate(2023, JSMonth.NOVEMBER, 25))).toBe(false);
    });

    it ('should not be before a later date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isBefore(new LocalDate(2023, JSMonth.NOVEMBER, 24))).toBe(false);
    });

    it ('should not equal a different date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isEqual(new LocalDate(2024, JSMonth.NOVEMBER, 25))).toBe(false);
        expect(date.isEqual(new LocalDate(2023, JSMonth.DECEMBER, 25))).toBe(false);
        expect(date.isEqual(new LocalDate(2023, JSMonth.NOVEMBER, 26))).toBe(false);
    });

    it ('should be after a date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isAfter(new LocalDate(2023, JSMonth.NOVEMBER, 24))).toBe(true);
        expect(date.isAfter(new LocalDate(2022, JSMonth.NOVEMBER, 25))).toBe(true);
        expect(date.isAfter(new LocalDate(2023, JSMonth.OCTOBER, 25))).toBe(true);
    });

    it ('should not be after the same date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isAfter(new LocalDate(2023, JSMonth.NOVEMBER, 25))).toBe(false);
    });

    it ('should not be after a later date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.isAfter(new LocalDate(2023, JSMonth.NOVEMBER, 26))).toBe(false);
    });

    it ('should compare dates in January correctly', () => {
        const early = new LocalDate(2023, JSMonth.JANUARY, 1);
        const late = new LocalDate(2023, JSMonth.JANUARY, 5);

        expect(early.isBefore(late)).toBe(true);
        expect(late.isAfter(early)).toBe(true);
        expect(late.isBefore(early)).toBe(false);
        expect(early.isAfter(late)).toBe(false);

        expect(early.isBefore(new Date(2023, JSMonth.JANUARY, 5))).toBe(true);
        expect(late.isAfter(new Date(2023, JSMonth.JANUARY, 1))).toBe(true);
    });

    it ('should compare dates across January and February correctly', () => {
        const january = new LocalDate(2023, JSMonth.JANUARY, 31);
        const february = new LocalDate(2023, JSMonth.FEBRUARY, 1);

        expect(january.isBefore(february)).toBe(true);
        expect(february.isAfter(january)).toBe(true);
        expect(february.isBefore(january)).toBe(false);
        expect(january.isAfter(february)).toBe(false);
    });

    it ('should get valid ISO-String', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);

        expect(date.toISOString()).toBe('2023-11-25');
    });

    it ('should get invalid ISO-String', () => {
        const invalid = new LocalDate(NaN);

        expect(invalid.toISOString).toThrow();
    });

    it ('should return invalid date when invalid local date transforms to date', () => {
        const invalid = new LocalDate(NaN);
        expect(invalid.valid).toBe(false);

        expect(invalid.atStartOfDay().getTime()).toBeNaN();
        expect(invalid.atTime(23, 0).getTime()).toBeNaN();
    });

    it ('should return locale string', () => {
        const date = new LocalDate(2024, 11, 23);

        expect(date.toLocaleString('en-US')).toBe('12/23/2024');
        expect(date.toLocaleString('de-DE')).toBe('23.12.2024');

        expect(date.toLocaleString('en-US', { month: 'long', weekday: 'long' }))
            .toBe('December Monday');
        expect(date.toLocaleString('de-DE', { month: 'long', weekday: 'long' }))
            .toBe('Dezember Montag');
    });

    it ('should return locale invalid string', () => {
        const invalid = new LocalDate(NaN);

        expect(invalid.toLocaleString('de-DE')).toBe('Invalid Date');
        expect(invalid.toLocaleString('en-US')).toBe('Invalid Date');
    });

    it ('should return string', () => {
        const date = new LocalDate(2024, JSMonth.DECEMBER, 23);

        expect(date.toString()).toBe('Mon Dec 23');
    });

    it ('should return invalid date string', () => {
        const invalid = new LocalDate(NaN);

        expect(invalid.toString()).toBe('Invalid Date');
    });

    it ('should get datetime at midnight', () => {
        const date = new LocalDate(2024, JSMonth.DECEMBER, 23).atStartOfDay();

        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(11);
        expect(date.getDate()).toBe(23);
        expect(date.getHours()).toBe(0);
        expect(date.getMinutes()).toBe(0);
        expect(date.getSeconds()).toBe(0);
        expect(date.getMilliseconds()).toBe(0);
    });

    it ('should get datetime at certain time', () => {
        const date = new LocalDate(2024, JSMonth.DECEMBER, 23)
            .atTime(12, 30, 45);

        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(JSMonth.DECEMBER);
        expect(date.getDate()).toBe(23);
        expect(date.getHours()).toBe(12);
        expect(date.getMinutes()).toBe(30);
        expect(date.getSeconds()).toBe(45);
        expect(date.getMilliseconds()).toBe(0);
    });

    it ('should get datetime at certain LocalTime', () => {
        const date = new LocalDate(2024, JSMonth.DECEMBER, 23)
            .atTime(new LocalTime(12, 30, 45));

        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(JSMonth.DECEMBER);
        expect(date.getDate()).toBe(23);
        expect(date.getHours()).toBe(12);
        expect(date.getMinutes()).toBe(30);
        expect(date.getSeconds()).toBe(45);
        expect(date.getMilliseconds()).toBe(0);
    });

    it ('should add years to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.plusYears(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2028);
        expect(newDate.year).toBe(2028);
        expect(newDate.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(newDate.month).toBe(Month.NOVEMBER);
        expect(newDate.getDate()).toBe(25);
        expect(newDate.dateOfMonth).toBe(25);
        expect(newDate.getDay()).toBe(DayOfWeek.SATURDAY);

        expect(newDate.getFullYear()).not.toBe(date.getFullYear());
    });

    it ('should subtract years to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.minusYears(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2018);
        expect(newDate.year).toBe(2018);
        expect(newDate.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(newDate.month).toBe(Month.NOVEMBER);
        expect(newDate.getDate()).toBe(25);
        expect(newDate.dateOfMonth).toBe(25);
        expect(newDate.getDay()).toBe(DayOfWeek.SUNDAY);

        expect(newDate.getFullYear()).not.toBe(date.getFullYear());
    });

    it ('should set years to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.withYear(2020);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2020);
        expect(newDate.year).toBe(2020);
        expect(newDate.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(newDate.month).toBe(Month.NOVEMBER);
        expect(newDate.getDate()).toBe(25);
        expect(newDate.dateOfMonth).toBe(25);
        expect(newDate.getDay()).toBe(DayOfWeek.WEDNESDAY);

        expect(newDate.getFullYear()).not.toBe(date.getFullYear());
    });

    it ('should add months to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.plusMonths(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2024);
        expect(newDate.month).toBe(Month.APRIL);
        expect(newDate.getMonth()).toBe(JSMonth.APRIL);
        expect(newDate.dateOfMonth).toBe(25);
        expect(newDate.getDate()).toBe(25);
        expect(newDate.getDay()).toBe(DayOfWeek.THURSDAY);

        expect(newDate.getMonth()).not.toBe(date.getMonth());
    });

    it ('should subtract months to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.minusMonths(16);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2022);
        expect(newDate.year).toBe(2022);
        expect(newDate.month).toBe(Month.JULY);
        expect(newDate.getMonth()).toBe(JSMonth.JULY);
        expect(newDate.dateOfMonth).toBe(25);
        expect(newDate.getDate()).toBe(25);
        expect(newDate.getDay()).toBe(DayOfWeek.MONDAY);

        expect(newDate.getMonth()).not.toBe(date.getMonth());
    });

    it ('should set months to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.withMonth(Month.APRIL);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2023);
        expect(newDate.year).toBe(2023);
        expect(newDate.getMonth()).toBe(JSMonth.APRIL);
        expect(newDate.month).toBe(Month.APRIL);
        expect(newDate.getDate()).toBe(25);
        expect(newDate.dateOfMonth).toBe(25);
        expect(newDate.getDay()).toBe(DayOfWeek.TUESDAY);

        expect(newDate.getMonth()).not.toBe(date.getMonth());
    });

    it ('should throw error when using invalid month', () => {
        expect(() => new LocalDate(2023, JSMonth.NOVEMBER, 25).withMonth(13 as Month)).toThrow();
        expect(() => new LocalDate(2023, JSMonth.NOVEMBER, 25).withMonth(-1 as Month)).toThrow();
    });

    it ('should add days to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.plusDays(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2023);
        expect(newDate.year).toBe(2023);
        expect(newDate.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(newDate.month).toBe(Month.NOVEMBER);
        expect(newDate.getDate()).toBe(30);
        expect(newDate.dateOfMonth).toBe(30);
        expect(newDate.getDay()).toBe(DayOfWeek.THURSDAY);

        expect(newDate.getDate()).not.toBe(date.getDate());
    });

    it ('should increase month and year if necessary when adding days', () => {
        const date = new LocalDate(2023, JSMonth.DECEMBER, 30);
        const newDate = date.plusDays(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2024);
        expect(newDate.year).toBe(2024);
        expect(newDate.getMonth()).toBe(JSMonth.JANUARY);
        expect(newDate.month).toBe(Month.JANUARY);
        expect(newDate.getDate()).toBe(4);
        expect(newDate.dateOfMonth).toBe(4);
        expect(newDate.getDay()).toBe(DayOfWeek.THURSDAY);
    });

    it ('should subtract days to new date', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.minusDays(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2023);
        expect(newDate.year).toBe(2023);
        expect(newDate.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(newDate.month).toBe(Month.NOVEMBER);
        expect(newDate.getDate()).toBe(20);
        expect(newDate.dateOfMonth).toBe(20);
        expect(newDate.getDay()).toBe(DayOfWeek.MONDAY);

        expect(newDate.getDate()).not.toBe(date.getDate());
    });

    it ('should decrease month and year if necessary when adding days', () => {
        const date = new LocalDate(2023, JSMonth.JANUARY, 1);
        const newDate = date.minusDays(5);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2022);
        expect(newDate.year).toBe(2022);
        expect(newDate.getMonth()).toBe(JSMonth.DECEMBER);
        expect(newDate.month).toBe(Month.DECEMBER);
        expect(newDate.getDate()).toBe(27);
        expect(newDate.dateOfMonth).toBe(27);
    });

    it ('should set days to new day of month', () => {
        const date = new LocalDate(2023, JSMonth.NOVEMBER, 25);
        const newDate = date.withDayOfMonth(12);

        expect(newDate).toBeTruthy();
        expect(newDate.valid).toBe(true);
        expect(newDate.getFullYear()).toBe(2023);
        expect(newDate.year).toBe(2023);
        expect(newDate.getMonth()).toBe(JSMonth.NOVEMBER);
        expect(newDate.month).toBe(Month.NOVEMBER);
        expect(newDate.getDate()).toBe(12);
        expect(newDate.dateOfMonth).toBe(12);
        expect(newDate.getDay()).toBe(DayOfWeek.SUNDAY);

        expect(newDate.getDate()).not.toBe(date.getDate());
    });

    it ('should throw error when using invalid day of month', () => {
        expect(() => new LocalDate(2023, JSMonth.NOVEMBER, 31).withDayOfMonth(32)).toThrow();
        expect(() => new LocalDate(2023, JSMonth.NOVEMBER, 30).withDayOfMonth(0)).toThrow();
    });
    it ('should keep years between 0 and 99', () => {
        const date = LocalDate.of(50, Month.MARCH, 15);

        expect(date.getFullYear()).toBe(50);
        expect(date.toISOString()).toBe('0050-03-15');
        expect(date.atStartOfDay().getFullYear()).toBe(50);
        expect(date.atTime(12, 30).getFullYear()).toBe(50);
        expect(new LocalDate(50, JSMonth.MARCH, 15).getFullYear()).toBe(50);
        expect(new LocalDate('0050-03-15').toISOString()).toBe('0050-03-15');
        expect(LocalDate.parse('0050-03-15').getFullYear()).toBe(50);
    });

    it ('should accept ISO strings with years between 1 and 99', () => {
        expect(isLocalDateString('0001-01-01')).toBe(true);
        expect(isLocalDateString('0050-02-28')).toBe(true);
        expect(isLocalDateString('0050-02-29')).toBe(false);
    });

    it ('should not jump into the 20th century when calculating around year 100', () => {
        expect(new LocalDate(100, JSMonth.JANUARY, 1).minusDays(1).toISOString()).toBe('0099-12-31');
        expect(new LocalDate(99, JSMonth.DECEMBER, 31).plusDays(1).toISOString()).toBe('0100-01-01');
        expect(LocalDate.of(99, Month.JANUARY, 31).plusYears(1).getFullYear()).toBe(100);
    });

    it ('should resolve overflows in atTime', () => {
        const date = new LocalDate(2023, JSMonth.DECEMBER, 31).atTime(25, 0);

        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(JSMonth.JANUARY);
        expect(date.getDate()).toBe(1);
        expect(date.getHours()).toBe(1);
    });
    it ('should clamp the day to the end of the month when changing months', () => {
        const january31 = LocalDate.of(2023, Month.JANUARY, 31);

        expect(january31.plusMonths(1).toISOString()).toBe('2023-02-28');
        expect(january31.plusMonths(3).toISOString()).toBe('2023-04-30');
        expect(january31.withMonth(Month.FEBRUARY).toISOString()).toBe('2023-02-28');
        expect(LocalDate.of(2024, Month.JANUARY, 31).plusMonths(1).toISOString()).toBe('2024-02-29');
        expect(LocalDate.of(2023, Month.MARCH, 31).minusMonths(1).toISOString()).toBe('2023-02-28');
        expect(LocalDate.of(2023, Month.DECEMBER, 31).plusMonths(2).toISOString()).toBe('2024-02-29');
        expect(LocalDate.of(2023, Month.MAY, 31).minusMonths(15).toISOString()).toBe('2022-02-28');
    });

    it ('should keep the day of month if it exists in the target month', () => {
        expect(LocalDate.of(2023, Month.JANUARY, 28).plusMonths(1).toISOString()).toBe('2023-02-28');
        expect(LocalDate.of(2023, Month.JANUARY, 15).plusMonths(13).toISOString()).toBe('2024-02-15');
        expect(LocalDate.of(2023, Month.FEBRUARY, 28).plusMonths(1).toISOString()).toBe('2023-03-28');
    });

    it ('should clamp February 29th when changing years', () => {
        const leapDay = LocalDate.of(2024, Month.FEBRUARY, 29);

        expect(leapDay.plusYears(1).toISOString()).toBe('2025-02-28');
        expect(leapDay.minusYears(1).toISOString()).toBe('2023-02-28');
        expect(leapDay.withYear(2023).toISOString()).toBe('2023-02-28');
        expect(leapDay.plusYears(4).toISOString()).toBe('2028-02-29');
    });

    it ('should stay invalid when changing months or years of an invalid date', () => {
        const invalid = new LocalDate(NaN);

        expect(invalid.plusMonths(1).valid).toBe(false);
        expect(invalid.minusYears(1).valid).toBe(false);
        expect(invalid.withMonth(Month.MARCH).valid).toBe(false);
        expect(LocalDate.of(2023, Month.JANUARY, 1).plusMonths(NaN).valid).toBe(false);
    });
});
