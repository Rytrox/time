# Changelog

## [3.0.0] – 2026-11-10

### Fixed
- `LocalDate#isBefore` and `LocalDate#isAfter` always returned `false` when both dates were in January of the same year. This also affected `min()` and `max()` in the yup and zod schemas.
- `new LocalDate(string)` with a date that does not exist (e.g. `'2023-02-31'`) is now invalid, the same as an out-of-range month (`'2023-13-01'`). Previously it was considered valid but held day 31 in February, while `toISOString()` returned `'2023-03-03'`.
- Years 0–99 were mapped to 1900–1999, so `LocalDate.of(50, Month.JANUARY, 1)` threw an error and `new LocalDate(100, JSMonth.JANUARY, 1).minusDays(1)` resulted in `1999-12-31`. Years 0–99 are now kept in the `LocalDate` constructor with numbers, `LocalDate.of`, `LocalDate.parse`, `isLocalDateString`, `toISOString`, `atStartOfDay`, `atTime` and the `YearMonth` methods based on them.
- zod: `min()` and `max()` of `localdate()`, `localtime()` and `yearmonth()` can now be chained (e.g. `localdate().min(a).max(b)`) and are kept after other modifiers like `describe()` or `refine()`. Previously this threw `TypeError: ... is not a function`.
- yup: `YearMonthSchema` no longer converts `{ year, month }` objects with an out-of-range month into January 1970. Objects with an invalid year or month now fail validation.
- `isYearMonthString` and `YearMonth.parse` now check the format `YYYY-MM`, as described by `YearMonthString`. Previously values like `'2023-01-15'` or `'2023-1.5'` were accepted, the latter resulting in a non-integer month. The `YearMonth` constructor still accepts `'2023-01-01'` and `'2023-01-01T12:00:00'`.
- `LocalTime` no longer depends on the current date or on daylight-saving time. Previously, on the day clocks jump forward, `new LocalTime(2, 30)` became `03:30` and `LocalTime.of(2, 30)` threw an error. Constructor, `plus…`/`minus…`/`with…`, `toString()`, `toISOString()` and `toLocaleString()` are affected. `new LocalTime(date)` and `LocalTime.now()` still read the local time, as documented.
- `LocalTime#withSecond` and `withMilli` now throw for `NaN`, like `withHour` and `withMinute`. All four methods also throw for non-integer values (e.g. `1.5`), which were silently truncated before.
- `LocalTime#toString()` returns `'Invalid Date'` for invalid times, as documented, instead of an empty string.
- `YearMonth#toLocaleString()` returns `'Invalid Date'` for invalid year-months instead of throwing a `RangeError`.
- `YearMonth#toISOString()` pads the year to four digits (e.g. `0999-03`) and no longer rounds non-integer months.
- `YearMonth#valid` is `false` for non-integer years or months and for year-months beyond the range of JS dates (after September 275760).
- yup: The type of `LocalTimeSchema` is now `local-time` instead of `local-date`, so type errors show the correct type.
- Documentation of `LocalTime#minusHours`: overflows wrap around the day; the result is never invalid.

### Changed
- **BREAKING:** `LocalDate#plusMonths`, `minusMonths`, `withMonth`, `plusYears`, `minusYears` and `withYear` clamp the day of month to the last day of the target month, like `java.time.LocalDate` (e.g. January 31st + 1 month => February 28th, February 29th, 2024 + 1 year => February 28th, 2025). Previously the day overflowed into the next month (March 3rd / March 1st). `plusDays`, `minusDays` and the constructor still resolve overflows.
- **BREAKING:** yup: `YearMonthSchema` reads `{ year, month }` objects with a **1-based** month (1 = January), the same as `YearMonth#month` and `YearMonth.of`. Previously the month was read as a 0-based `JSMonth`, so `{ year: 2023, month: 1 }` became February 2023. If you pass a 0-based month (e.g. from `Date#getMonth()`), add 1.
- zod: `ZodLocalDate`, `ZodLocalTime` and `ZodYearMonth` are now type aliases of the new generic `ZodComparable` type, which extends `ZodCustom`.

## [2.0.0] - 2026-08-18

### Added
- Support for optional `zod` validators in '@rytrox/time/zod' (`localdate`, `yearmonth`, `localtime`)
- Accessor `dateOfMonth`, `month` and `year` in `LocalDate`
- Accessor `month` and `year` in `YearMonth` that returns the correct month and year.
- Added new enum `Month` that represents the Months from JANUARY (1) to DECEMBER (12), instead from 0 to 11
- Added converter functions `toMonth(JSMonth)` and `toJSMonth(Month)`.

### Changed 
- **BREAKING:** The old `Month` enum is now called `JSMonth`.
- **BREAKING:** `LocalDate.of` and `YearMonth.of` now accept `Month` as input. The constructor will be left as `JSMonth`. For more safety, use the factory methods instead.
