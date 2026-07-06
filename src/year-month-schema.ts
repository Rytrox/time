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
import { YearMonth } from './year-month';

export interface YearMonthSchema<T extends Maybe<YearMonth> = YearMonth | undefined, C extends AnyObject = AnyObject, D = undefined, F extends Flags = ''> extends Schema<T, C, D, F> {
    default<M extends Maybe<T>>(def: DefaultThunk<M, C>): YearMonthSchema<T, C, M, ToggleDefault<F, M>>;
    concat<O extends YearMonthSchema<never, never>>(schema: O): O;
    defined(msg?: Message): YearMonthSchema<Defined<T>, C, D, F>;
    optional(): YearMonthSchema<T | undefined, C, D, F>;
    required(msg?: Message): YearMonthSchema<NonNullable<T>, C, D, F>;
    notRequired(): YearMonthSchema<Maybe<T>, C, D, F>;
    nullable(msg?: Message): YearMonthSchema<T | null, C, D, F>;
    nonNullable(msg?: Message): YearMonthSchema<NotNull<T>, C, D, F>;
    strip(enabled: false): YearMonthSchema<T, C, D, UnsetFlag<F, 's'>>;
    strip(enabled?: true): YearMonthSchema<T, C, D, SetFlag<F, 's'>>;

    min(
        min: YearMonth | LocalDate | Date | Reference<YearMonth | LocalDate | Date> | null,
        message: string
    ): YearMonthSchema<T, C, D, F>;

    max(
        max: Reference<YearMonth | LocalDate | Date> | YearMonth | LocalDate | Date | null,
        message: string
    ): YearMonthSchema<T, C, D, F>;
}

export const YearMonthSchema: YearMonthSchemaConstructors = class <T extends Maybe<YearMonth>> extends Schema<T, AnyObject, undefined> implements YearMonthSchema<T> {
    public constructor() {
        super({
            check: (v: unknown): v is NonNullable<T> => v instanceof YearMonth,
            type: 'year-month'
        });

        this.withMutation(self => {
            self.transform((value: unknown) => {
                if (value instanceof YearMonth) {
                    return value;
                }

                if (typeof value === 'object' && value !== null) {
                    if ('year' in value && typeof value.year === 'number' &&
                        'month' in value && typeof value.month === 'number') {
                        return new YearMonth(value.year, value.month);
                    }
                }

                return value;
            });
        });
    }

    public min(
        min: YearMonth | LocalDate | Date | Reference<YearMonth | LocalDate | Date> | null,
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
        max: Reference<YearMonth | LocalDate | Date> | YearMonth | LocalDate | Date | null,
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

type YearMonthSchemaConstructors = new <T extends Maybe<YearMonth>>() => YearMonthSchema<T>;

export const yearMonth = (): YearMonthSchema<Maybe<YearMonth>> => new YearMonthSchema();
