import { LocalTime } from '../local-time';
import { localTime } from './local-time-schema';

describe('yup localTime', () => {
    it ('should accept LocalTime instances', () => {
        const value = new LocalTime(12, 30);

        expect(localTime().validateSync(value)).toBe(value);
    });

    it ('should report the local-time type on type errors', () => {
        expect(() => localTime().validateSync('12:30')).toThrow('local-time');
        expect(localTime().describe().type).toBe('local-time');
    });
});
