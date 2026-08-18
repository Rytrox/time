# Changelog

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
