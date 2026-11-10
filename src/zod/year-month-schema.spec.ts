import { JSMonth } from '../month';
import { YearMonth } from '../year-month';
import { yearmonth } from './year-month-schema';

describe('zod yearmonth', () => {
    it ('should allow chaining min and max', () => {
        const schema = yearmonth().min(new YearMonth(2023, JSMonth.MARCH)).max(new YearMonth(2023, JSMonth.JUNE));

        expect(schema.safeParse(new YearMonth(2023, JSMonth.FEBRUARY)).success).toBe(false);
        expect(schema.safeParse(new YearMonth(2023, JSMonth.APRIL)).success).toBe(true);
        expect(schema.safeParse(new YearMonth(2023, JSMonth.JULY)).success).toBe(false);
        expect(schema.safeParse('2023-04').success).toBe(false);
    });
});
