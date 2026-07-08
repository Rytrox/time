import {
    type AnyObject,
    type DefaultThunk,
    type Defined,
    type Flags,
    type Maybe,
    type Message,
    type NotNull,
    type Reference,
    Schema,
    type SetFlag,
    type ToggleDefault,
    type UnsetFlag
} from 'yup';
import { LocalTime } from '../local-time';

export interface LocalTimeSchema<T extends Maybe<LocalTime>, C = AnyObject, D = undefined, F extends Flags = ''> extends Schema<T, AnyObject, D, F> {
    default<M extends Maybe<T>>(def: DefaultThunk<M, C>): LocalTimeSchema<T, C, M, ToggleDefault<F, M>>;
    concat<O extends LocalTimeSchema<never, never>>(schema: O): O;
    defined(msg?: Message): LocalTimeSchema<Defined<T>, C, D, F>;
    optional(): LocalTimeSchema<T | undefined, C, D, F>;
    required(msg?: Message): LocalTimeSchema<NonNullable<T>, C, D, F>;
    notRequired(): LocalTimeSchema<Maybe<T>, C, D, F>;
    nullable(msg?: Message): LocalTimeSchema<T | null, C, D, F>;
    nonNullable(msg?: Message): LocalTimeSchema<NotNull<T>, C, D, F>;
    strip(enabled: false): LocalTimeSchema<T, C, D, UnsetFlag<F, 's'>>;
    strip(enabled?: true): LocalTimeSchema<T, C, D, SetFlag<F, 's'>>;

    min(
        min: LocalTime | Date | Reference<LocalTime | Date> | null,
        message: string
    ): LocalTimeSchema<T, C, D, F>;
    max(
        max: LocalTime | Date | Reference<LocalTime | Date> | null,
        message: string
    ): LocalTimeSchema<T, C, D, F>;
}

type ILocalTimeSchema<T extends Maybe<LocalTime>> = LocalTimeSchema<T>;

export const LocalTimeSchema: LocalTimeSchemaConstructors = class LocalTimeSchema<T extends Maybe<LocalTime>> extends Schema<T, AnyObject, undefined> implements ILocalTimeSchema<T> {
    public constructor() {
        super({
            check: (v: unknown): v is NonNullable<T> => v instanceof LocalTime,
            type: 'local-date'
        });

        this.withMutation(self => {
            self.transform((value: unknown) => {
                if (value instanceof LocalTime) {
                    return value;
                }

                if (typeof value === 'object' && value !== null) {
                    if ('date' in value && value.date instanceof Date) {
                        return new LocalTime(value.date);
                    }
                }

                return value;
            });
        });
    }

    public min(
        min: LocalTime | Date | Reference<LocalTime | Date> | null,
        message: string
    ) {
        return this.test({
            exclusive: true,
            message,
            name: 'min',
            params: {
                min
            },
            test: (value, context) => {
                const val = context.resolve(min);

                return !value || !val || !value.isBefore(val);
            }
        });
    }

    public max(
        max: Reference<LocalTime | Date> | LocalTime | Date | null,
        message: string
    ) {
        return this.test({
            exclusive: true,
            message,
            name: 'max',
            params: {
                max
            },
            test: (value, context) => {
                const val = context.resolve(max);

                return !value || !val || !value.isAfter(val);
            }
        });
    }
};

type LocalTimeSchemaConstructors = new <T extends Maybe<LocalTime>>() => LocalTimeSchema<T>;

export const localTime = (): LocalTimeSchema<Maybe<LocalTime>> => new LocalTimeSchema();
