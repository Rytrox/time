import {
    type AnyObject,
    type DefaultThunk,
    type Defined,
    type Flags,
    type Maybe,
    type Message,
    type NotNull,
    Reference,
    Schema,
    type SetFlag,
    type ToggleDefault,
    type UnsetFlag
} from 'yup';
import { LocalDate } from './local-date';

export interface LocalDateSchema<T extends Maybe<LocalDate>, C = AnyObject, D = undefined, F extends Flags = ''> extends Schema<T, AnyObject, D, F> {
    default<M extends Maybe<T>>(def: DefaultThunk<M, C>): LocalDateSchema<T, C, M, ToggleDefault<F, M>>;
    concat<O extends LocalDateSchema<never, never>>(schema: O): O;
    defined(msg?: Message): LocalDateSchema<Defined<T>, C, D, F>;
    optional(): LocalDateSchema<T | undefined, C, D, F>;
    required(msg?: Message): LocalDateSchema<NonNullable<T>, C, D, F>;
    notRequired(): LocalDateSchema<Maybe<T>, C, D, F>;
    nullable(msg?: Message): LocalDateSchema<T | null, C, D, F>;
    nonNullable(msg?: Message): LocalDateSchema<NotNull<T>, C, D, F>;
    strip(enabled: false): LocalDateSchema<T, C, D, UnsetFlag<F, 's'>>;
    strip(enabled?: true): LocalDateSchema<T, C, D, SetFlag<F, 's'>>;

    min(
        min: LocalDate | Date | Reference<LocalDate | Date> | null,
        message: string
    ): LocalDateSchema<T, C, D, F>;
    max(
        max: LocalDate | Date | Reference<LocalDate | Date> | null,
        message: string
    ): LocalDateSchema<T, C, D, F>;
}

type ILocalDateSchema<T extends Maybe<LocalDate>> = LocalDateSchema<T>;

export const LocalDateSchema: LocalDateSchemaConstructors = class LocalDateSchema<T extends Maybe<LocalDate>> extends Schema<T, AnyObject, undefined> implements ILocalDateSchema<T> {
    public constructor() {
        super({
            check: (v: unknown): v is NonNullable<T> => v instanceof LocalDate,
            type: 'local-date'
        });

        this.withMutation(self => {
            self.transform((value: unknown) => {
                if (value instanceof LocalDate) {
                    return value;
                }

                if (typeof value === 'object' && value !== null) {
                    if ('date' in value && value.date instanceof Date) {
                        return new LocalDate(value.date);
                    }
                }

                return value;
            });
        });
    }

    public min(
        min: LocalDate | Date | Reference<LocalDate | Date> | null,
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
        max: Reference<LocalDate | Date> | LocalDate | Date | null,
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

type LocalDateSchemaConstructors = new <T extends Maybe<LocalDate>>() => LocalDateSchema<T>;

export const localDate = (): LocalDateSchema<Maybe<LocalDate>> => new LocalDateSchema();
