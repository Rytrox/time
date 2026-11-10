import { LocalTime } from '../local-time';
import { localtime } from './local-time-schema';

describe('zod localtime', () => {
    it ('should allow chaining min and max', () => {
        const schema = localtime().min(new LocalTime(8, 0)).max(new LocalTime(17, 0));

        expect(schema.safeParse(new LocalTime(7, 59)).success).toBe(false);
        expect(schema.safeParse(new LocalTime(12, 0)).success).toBe(true);
        expect(schema.safeParse(new LocalTime(17, 1)).success).toBe(false);
        expect(schema.safeParse('12:00').success).toBe(false);
    });
});
