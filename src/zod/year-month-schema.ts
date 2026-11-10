import { type ComparableSchemaParams, type ZodComparable, defineComparableSchema } from './comparable-schema';
import type { LocalDate } from '../local-date';
import { YearMonth } from '../year-month';

type Temporal = YearMonth | LocalDate | Date;

export type ZodYearMonth = ZodComparable<YearMonth, Temporal>;

export const yearmonth: (params?: ComparableSchemaParams) => ZodYearMonth =
    defineComparableSchema<YearMonth, Temporal>(
        'ZodYearMonth',
        (val): val is YearMonth => val instanceof YearMonth
    );
