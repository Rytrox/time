import { type ComparableSchemaParams, type ZodComparable, defineComparableSchema } from './comparable-schema';
import { LocalTime } from '../local-time';

export type ZodLocalTime = ZodComparable<LocalTime, LocalTime | Date>;

export const localtime: (params?: ComparableSchemaParams) => ZodLocalTime =
    defineComparableSchema<LocalTime, LocalTime | Date>(
        'ZodLocalTime',
        (val): val is LocalTime => val instanceof LocalTime
    );
