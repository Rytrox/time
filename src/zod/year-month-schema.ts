import { type ZodType, core, z } from 'zod';
import type { LocalDate } from '../local-date';
import { YearMonth } from '../year-month';

type Temporal = YearMonth | LocalDate | Date;

export interface ZodYearMonth extends ZodType<YearMonth, YearMonth> {
    min(min: Temporal, params?: string | core.$ZodSuperRefineParams): this;
    max(max: Temporal, params?: string | core.$ZodSuperRefineParams): this;
}

const schema = z.custom<YearMonth>(
    val => val instanceof YearMonth
);

Object.assign(schema, {
    max(max: Temporal, params?: string | core.$ZodSuperRefineParams) {
        return schema.refine(val => !val.isAfter(max), params);
    },
    min(min: Temporal, params?: string | core.$ZodSuperRefineParams) {
        return schema.refine(val => !val.isBefore(min), params);
    }
});

const typeCheck = (val: ZodType<YearMonth, YearMonth>): val is ZodYearMonth =>
    'max' in val && typeof val.max === 'function' &&
    'min' in val && typeof val.min === 'function';

export const yearmonth = (): ZodYearMonth => {
    if (!typeCheck(schema)) {
        throw new Error('yearmonth schema is not a ZodYearMonth');
    }

    return schema;
};
