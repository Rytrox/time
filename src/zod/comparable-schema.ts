import { type ZodCustom, core, z } from 'zod';

/**
 * A value that can be compared against values of type `B`.
 */
interface Comparable<B> {
    isBefore(other: B): boolean;
    isAfter(other: B): boolean;
}

type RefineParams = string | core.$ZodSuperRefineParams;

export type ComparableSchemaParams = string | core.$ZodCustomParams;

/**
 * A zod schema for a comparable value with chainable `min` and `max` constraints.
 */
export interface ZodComparable<T extends Comparable<B>, B> extends ZodCustom<T, T> {
    min(min: B, params?: RefineParams): this;
    max(max: B, params?: RefineParams): this;
}

/**
 * Defines a zod schema class for a comparable type.
 *
 * zod clones a schema on every modification (e.g. `refine`, `describe`) by calling the
 * constructor stored in `_zod.constr`. Therefore, `min` and `max` must be installed by the
 * constructor's initializer. Otherwise, they would be lost on the first clone.
 *
 * @param name the unique name of the schema class
 * @param isType a function to check if a value is of the comparable type
 * @returns a factory creating new instances of the schema
 */
export const defineComparableSchema = <T extends Comparable<B>, B>(
    name: string,
    isType: (val: unknown) => val is T
) => {
    const Schema = core.$constructor<ZodComparable<T, B>, core.$ZodCustomDef>(name, (inst, def) => {
        z.ZodCustom.init(inst, def);

        inst.min = (min: B, params?: RefineParams) => inst.refine(val => !val.isBefore(min), params);
        inst.max = (max: B, params?: RefineParams) => inst.refine(val => !val.isAfter(max), params);
    });

    const isSchema = (val: unknown): val is ZodComparable<T, B> => val instanceof Schema;

    return (params?: ComparableSchemaParams): ZodComparable<T, B> => {
        const schema = core._custom(Schema, isType, params);

        if (!isSchema(schema)) {
            throw new Error(`${name} could not be created`);
        }

        return schema;
    };
};
