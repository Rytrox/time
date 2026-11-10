import { JSMonth } from '../month';
import { YearMonth } from '../year-month';
import { yearMonth } from './year-month-schema';

describe('yup yearMonth', () => {
    it ('should keep YearMonth instances', () => {
        const value = new YearMonth(2023, JSMonth.MARCH);

        expect(yearMonth().validateSync(value)).toBe(value);
    });

    it ('should transform objects with a 1-based month', () => {
        const january = yearMonth().validateSync({ month: 1, year: 2023 });
        expect(january).toBeTruthy();
        expect(january?.toISOString()).toBe('2023-01');

        const december = yearMonth().validateSync({ month: 12, year: 2023 });
        expect(december).toBeTruthy();
        expect(december?.toISOString()).toBe('2023-12');
    });

    it ('should round-trip the YearMonth accessors', () => {
        const original = YearMonth.of(2024, 2);
        const result = yearMonth().validateSync({ month: original.month, year: original.year });

        expect(result).toBeTruthy();
        expect(result?.isEqual(original)).toBe(true);
    });

    it ('should reject objects with an invalid month or year', () => {
        for (const value of [
            { month: 0, year: 2023 },
            { month: 13, year: 2023 },
            { month: 1.5, year: 2023 },
            { month: Number.NaN, year: 2023 },
            { month: '1', year: 2023 },
            { month: 1, year: 0 },
            { month: 1, year: 2023.5 },
            { year: 2023 }
        ]) {
            expect(() => yearMonth().validateSync(value)).toThrow();
        }
    });

    it ('should apply min and max to transformed objects', () => {
        const schema = yearMonth()
            .min(YearMonth.of(2023, 3), 'too early')
            .max(YearMonth.of(2023, 6), 'too late');

        expect(() => schema.validateSync({ month: 2, year: 2023 })).toThrow('too early');
        expect(schema.validateSync({ month: 4, year: 2023 })?.toISOString()).toBe('2023-04');
        expect(() => schema.validateSync({ month: 7, year: 2023 })).toThrow('too late');
    });
});
