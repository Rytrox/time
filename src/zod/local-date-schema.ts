import { type ZodType, core, z } from 'zod';
import { LocalDate } from '../local-date';

export interface ZodLocalDate extends ZodType<LocalDate, LocalDate> {
    min(min: LocalDate | Date, params?: string | core.$ZodSuperRefineParams): this;
    max(max: LocalDate | Date, params?: string | core.$ZodSuperRefineParams): this;
}

const schema = z.custom<LocalDate>(
    val => val instanceof LocalDate
);

Object.assign(schema, {
    max(max: LocalDate | Date, params?: string | core.$ZodSuperRefineParams) {
        return schema.refine(val => !val.isAfter(max), params);
    },
    min(min: LocalDate | Date, params?: string | core.$ZodSuperRefineParams) {
        return schema.refine(val => !val.isBefore(min), params);
    }
});

const typeCheck = (val: ZodType<LocalDate, LocalDate>): val is ZodLocalDate =>
    'max' in val && typeof val.max === 'function' &&
    'min' in val && typeof val.min === 'function';

export const localdate = (): ZodLocalDate => {
    if (!typeCheck(schema)) {
        throw new Error('localdate schema is not a ZodLocalDate');
    }

    return schema;
};
