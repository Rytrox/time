import { JSMonth } from '../month';
import { LocalDate } from '../local-date';
import { localdate } from './local-date-schema';

describe('zod localdate', () => {
    const min = new LocalDate(2023, JSMonth.JANUARY, 10);
    const max = new LocalDate(2023, JSMonth.JANUARY, 20);

    it ('should only accept LocalDate instances', () => {
        expect(localdate().safeParse(new LocalDate(2023, JSMonth.JANUARY, 1)).success).toBe(true);
        expect(localdate().safeParse('2023-01-01').success).toBe(false);
        expect(localdate().safeParse(new Date()).success).toBe(false);
    });

    it ('should allow chaining min and max', () => {
        const schema = localdate().min(min).max(max);

        expect(schema.safeParse(new LocalDate(2023, JSMonth.JANUARY, 9)).success).toBe(false);
        expect(schema.safeParse(min).success).toBe(true);
        expect(schema.safeParse(new LocalDate(2023, JSMonth.JANUARY, 15)).success).toBe(true);
        expect(schema.safeParse(max).success).toBe(true);
        expect(schema.safeParse(new LocalDate(2023, JSMonth.JANUARY, 21)).success).toBe(false);
    });

    it ('should allow chaining max and min', () => {
        const schema = localdate().max(max).min(min);

        expect(schema.safeParse(new LocalDate(2023, JSMonth.JANUARY, 9)).success).toBe(false);
        expect(schema.safeParse(new LocalDate(2023, JSMonth.JANUARY, 21)).success).toBe(false);
    });

    it ('should keep min and max after other zod modifiers', () => {
        const schema = localdate().describe('date').refine(() => true).min(min);

        expect(schema.safeParse(new LocalDate(2023, JSMonth.JANUARY, 9)).success).toBe(false);
        expect(schema.safeParse(min).success).toBe(true);
    });

    it ('should not modify the original schema', () => {
        const base = localdate();
        base.min(min);

        expect(base.safeParse(new LocalDate(2000, JSMonth.JANUARY, 1)).success).toBe(true);
    });

    it ('should use the given error message', () => {
        const result = localdate().min(min, 'too early').safeParse(new LocalDate(2023, JSMonth.JANUARY, 1));

        expect(result.error?.issues[0]?.message).toBe('too early');
    });
});
