import { type ZodType, core, z } from 'zod';
import { LocalTime } from '../local-time';

export interface ZodLocalTime extends ZodType<LocalTime, LocalTime> {
    min(min: LocalTime | Date, params?: string | core.$ZodSuperRefineParams): this;
    max(max: LocalTime | Date, params?: string | core.$ZodSuperRefineParams): this;
}

const typeCheck = (val: ZodType<LocalTime, LocalTime>): val is ZodLocalTime =>
    'max' in val && typeof val.max === 'function' &&
    'min' in val && typeof val.min === 'function';

export const localtime = (params?: string | core.$ZodCustomParams): ZodLocalTime => {
    const schema = z.custom<LocalTime>(
        val => val instanceof LocalTime,
        params
    );

    Object.assign(schema, {
        max(max: LocalTime | Date, params?: string | core.$ZodSuperRefineParams) {
            return schema.refine(val => !val.isAfter(max), params);
        },
        min(min: LocalTime | Date, params?: string | core.$ZodSuperRefineParams) {
            return schema.refine(val => !val.isBefore(min), params);
        }
    });

    if (!typeCheck(schema)) {
        throw new Error('localtime schema is not a ZodLocalTime');
    }

    return schema;
};
