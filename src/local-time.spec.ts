import { LocalTime, type LocalTimeString } from './local-time';
import { Month } from './month';

describe('LocalTime', () => {
    it ('should create a LocalTime base on ISO string', () => {
        const time = new LocalTime('12:34:56');
        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);

        const time2 = new LocalTime('12:34');
        expect(time.valid).toBe(true);
        expect(time2.getHours()).toBe(12);
        expect(time2.getMinutes()).toBe(34);

        const time3 = new LocalTime('12:34:56.123');
        expect(time.valid).toBe(true);
        expect(time3.getHours()).toBe(12);
        expect(time3.getMinutes()).toBe(34);
        expect(time3.getSeconds()).toBe(56);
        expect(time3.getMilliseconds()).toBe(123);
    });

    it ('should create a LocalTime based on parameters', () => {
        const time = new LocalTime(12, 34, 56, 123);
        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(123);

        const time2 = new LocalTime(12, 34);
        expect(time2.valid).toBe(true);
        expect(time2.getHours()).toBe(12);
        expect(time2.getMinutes()).toBe(34);
        expect(time2.getSeconds()).toBe(0);
        expect(time2.getMilliseconds()).toBe(0);

        const time3 = new LocalTime(12);
        expect(time3.valid).toBe(true);
        expect(time3.getHours()).toBe(12);
        expect(time3.getMinutes()).toBe(0);
        expect(time3.getSeconds()).toBe(0);
        expect(time3.getMilliseconds()).toBe(0);

        const time4 = new LocalTime(12, 34, 56);
        expect(time4.valid).toBe(true);
        expect(time4.getHours()).toBe(12);
        expect(time4.getMinutes()).toBe(34);
        expect(time4.getSeconds()).toBe(56);
        expect(time4.getMilliseconds()).toBe(0);
    });

    it ('should create a LocalTime instance of now', () => {
        const time = new LocalTime();
        const now = new Date();

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(now.getHours());
        expect(time.getMinutes()).toBe(now.getMinutes());
        expect(time.getSeconds()).toBe(now.getSeconds());
    });

    it ('should create a LocalTime instance of now', () => {
        const time = LocalTime.now();
        const now = new Date();

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(now.getHours());
        expect(time.getMinutes()).toBe(now.getMinutes());
        expect(time.getSeconds()).toBe(now.getSeconds());
    });

    it ('should create a LocalTime based on a date', () => {
        const time = new LocalTime(new Date(2022, 1, 1, 12, 34, 56));
        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);
    });

    it ('should create a copy of a LocalTime', () => {
        const time = new LocalTime(new LocalTime(12, 34, 56));
        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);
    });

    it ('should create an invalid LocalTime', () => {
        const time = new LocalTime(NaN);
        expect(time.valid).toBe(false);
    });

    it ('should parse a valid LocalTime', () => {
        const time = LocalTime.parse('12:34:56');
        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);
    });

    it ('should throw an error while parsing invalid LocalTime', () => {
        expect(() => LocalTime.parse('invalid' as LocalTimeString)).toThrow();
        expect(() => LocalTime.parse('25:99')).toThrow();
        expect(() => LocalTime.parse('12:34:56.1000')).toThrow();
    });

    it ('should create a LocalTime from hours, minutes, seconds and milliseconds', () => {
        const time = LocalTime.of(12, 34, 56, 100);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(100);
    });

    it ('should throw an error while creating invalid LocalTime', () => {
        expect(() => LocalTime.of(25, 0, 0, 0)).toThrow();
        expect(() => LocalTime.of(0, 60, 0, 0)).toThrow();
        expect(() => LocalTime.of(0, 0, 60, 0)).toThrow();
        expect(() => LocalTime.of(0, 0, 0, 1000)).toThrow();
    });

    it ('should return false on comparison with invalid times', () => {
        const invalid = new LocalTime(NaN);
        expect(invalid.valid).toBe(false);

        expect(invalid.isBefore(new LocalTime(12, 0, 0))).toBe(false);
        expect(invalid.isBefore(new LocalTime())).toBe(false);
        expect(invalid.isBefore(new LocalTime(NaN))).toBe(false);

        expect(invalid.isAfter(new LocalTime(12, 0, 0))).toBe(false);
        expect(invalid.isAfter(new LocalTime())).toBe(false);
        expect(invalid.isAfter(new LocalTime(NaN))).toBe(false);

        expect(invalid.isEqual(new LocalTime(2023, Month.NOVEMBER, 25))).toBe(false);
        expect(invalid.isEqual(new LocalTime())).toBe(false);
        expect(invalid.isEqual(new LocalTime(NaN))).toBe(false);

        const valid = new LocalTime();
        expect(valid.isBefore(new LocalTime(NaN))).toBe(false);
        expect(valid.isEqual(new LocalTime(NaN))).toBe(false);
        expect(valid.isAfter(new LocalTime(NaN))).toBe(false);
    });

    it ('should be before a time', () => {
        const time = new LocalTime(12, 0);

        expect(time.isBefore(new LocalTime(15))).toBe(true);
        expect(time.isBefore(new LocalTime(12, 10))).toBe(true);
        expect(time.isBefore(new LocalTime(12, 0, 15))).toBe(true);
        expect(time.isBefore(new LocalTime(12, 0, 0, 1))).toBe(true);
    });

    it ('should not be before the same time', () => {
        const time = new LocalTime(12, 0);

        expect(time.isBefore(new LocalTime(12, 0))).toBe(false);
    });

    it ('should not be before a later time', () => {
        const time = new LocalTime(12, 0);

        expect(time.isBefore(new LocalTime(11, 59))).toBe(false);
        expect(time.isBefore(new LocalTime(11, 59, 59))).toBe(false);
        expect(time.isBefore(new LocalTime(11, 59, 59, 999))).toBe(false);
    });

    it ('should not equal a different time', () => {
        const time = new LocalTime(12, 0);

        expect(time.isEqual(new LocalTime(11, 54, 25))).toBe(false);
        expect(time.isEqual(new LocalTime(12, 0, 25))).toBe(false);
        expect(time.isEqual(new LocalTime(14, 0, 26))).toBe(false);
    });

    it ('should be after a time', () => {
        const time = new LocalTime(12, 50, 12, 678);

        expect(time.isAfter(new LocalTime(10))).toBe(true);
        expect(time.isAfter(new LocalTime(12, 40))).toBe(true);
        expect(time.isAfter(new LocalTime(12, 50))).toBe(true);
        expect(time.isAfter(new LocalTime(12, 50, 12, 234))).toBe(true);
    });

    it ('should not be after the same time', () => {
        const time = new LocalTime(12, 0);

        expect(time.isAfter(new LocalTime(12, 0))).toBe(false);
    });

    it ('should not be after a later time', () => {
        const time = new LocalTime(12, 0);

        expect(time.isAfter(new LocalTime(12, 1))).toBe(false);
        expect(time.isAfter(new LocalTime(12, 0, 1))).toBe(false);
        expect(time.isAfter(new LocalTime(12, 0, 0, 1))).toBe(false);
    });

    it ('should create a new instance when setting hours', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.withHour(13);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(13);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should throw error when setting invalid hour', () => {
        const time = new LocalTime(12, 34, 56);
        expect(() => time.withHour(24)).toThrow();
        expect(() => time.withHour(-1)).toThrow();
    });

    it ('should create a new instance when adding hours', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.plusHours(20);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(8);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should create a new instance when subtracting hours', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.minusHours(20);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(16);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should create a new instance when setting minute', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.withMinute(50);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(50);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should throw error when setting invalid minute', () => {
        const time = new LocalTime(12, 34, 56);
        expect(() => time.withMinute(60)).toThrow();
        expect(() => time.withMinute(-1)).toThrow();
    });

    it ('should create a new instance when adding minutes', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.plusMinutes(50);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(13);
        expect(newTime.getMinutes()).toBe(24);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should create a new instance when subtracting minutes', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.minusMinutes(50);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(11);
        expect(newTime.getMinutes()).toBe(44);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should create a new instance when setting second', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.withSecond(50);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(50);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should throw error when setting invalid second', () => {
        const time = new LocalTime(12, 34, 56);
        expect(() => time.withSecond(60)).toThrow();
        expect(() => time.withSecond(-1)).toThrow();
    });

    it ('should create a new instance when adding seconds', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.plusSeconds(50);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(35);
        expect(newTime.getSeconds()).toBe(46);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should create a new instance when subtracting seconds', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.minusSeconds(70);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(33);
        expect(newTime.getSeconds()).toBe(46);
        expect(newTime.getMilliseconds()).toBe(0);
    });

    it ('should create a new instance when setting milliseconds', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.withMilli(150);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(56);
        expect(newTime.getMilliseconds()).toBe(150);
    });

    it ('should throw error when setting invalid milliseconds', () => {
        const time = new LocalTime(12, 34, 56);
        expect(() => time.withMilli(1000)).toThrow();
        expect(() => time.withMilli(-1)).toThrow();
    });

    it ('should create a new instance when adding seconds', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.plusMillis(1320);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(57);
        expect(newTime.getMilliseconds()).toBe(320);
    });

    it ('should create a new instance when subtracting milliseconds', () => {
        const time = new LocalTime(12, 34, 56);
        const newTime = time.minusMillis(70);

        expect(time.valid).toBe(true);
        expect(time.getHours()).toBe(12);
        expect(time.getMinutes()).toBe(34);
        expect(time.getSeconds()).toBe(56);
        expect(time.getMilliseconds()).toBe(0);

        expect(newTime.valid).toBe(true);
        expect(newTime.getHours()).toBe(12);
        expect(newTime.getMinutes()).toBe(34);
        expect(newTime.getSeconds()).toBe(55);
        expect(newTime.getMilliseconds()).toBe(930);
    });

    it ('should display ISO-format', () => {
        const time = new LocalTime(12, 34, 56);
        const isoString = time.toISOString();

        expect(isoString).toBe('12:34:56.000');
    });

    it ('should display locale string', () => {
        const time = new LocalTime(12, 34, 56);
        const localeString = time.toLocaleString();

        expect(localeString).toBe('12:34:56');
    });

    it ('should display string', () => {
        const time = new LocalTime(12, 34, 56);
        const toString = time.toString();

        expect(toString).toBe('12:34:56');
    });
});
