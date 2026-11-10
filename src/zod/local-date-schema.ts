import { type ComparableSchemaParams, type ZodComparable, defineComparableSchema } from './comparable-schema';
import { LocalDate } from '../local-date';

export type ZodLocalDate = ZodComparable<LocalDate, LocalDate | Date>;

export const localdate: (params?: ComparableSchemaParams) => ZodLocalDate =
    defineComparableSchema<LocalDate, LocalDate | Date>(
        'ZodLocalDate',
        (val): val is LocalDate => val instanceof LocalDate
    );
