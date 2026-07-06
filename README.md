# @rytrox/time

A TypeScript library providing Java-inspired date and time types — `LocalDate`, `LocalTime`, and `YearMonth` — with
optional [yup](https://github.com/jquense/yup) schema support for form validation.

## Features

- 📅 **`LocalDate`** — A date without a time component (`YYYY-MM-DD`)
- 🕐 **`LocalTime`** — A time without a date component (`hh:mm`, `hh:mm:ss`, `hh:mm:ss.SSS`)
- 📆 **`YearMonth`** — A year and month combination (`YYYY-MM`)
- 🗓️ **`Month`** enum & **`DayOfWeek`** enum
- ✅ **Yup schema support** via `LocalDateSchema`, `LocalTimeSchema`, and `YearMonthSchema` *(optional)*
- 🔒 **Immutable** — all manipulation methods return new instances
- 💡 **Fully typed** — includes TypeScript string literal types like `LocalDateString`, `LocalTimeString`, and
  `YearMonthString`

---

## Installation

```bash
npm install @rytrox/time
```

# Usage

## `LocalDate`

```ts
import {LocalDate, Month} from '@rytrox/time';

// Create from ISO string
const date = new LocalDate('2024-03-15');

// Create from year, month, day (month is zero-based, or use the Month enum)
const date2 = new LocalDate(2024, Month.MARCH, 15);

// Factory methods
const today = LocalDate.now();
const parsed = LocalDate.parse('2024-03-15');
const specific = LocalDate.of(2024, Month.MARCH, 15);

// Arithmetic (immutable)
const nextWeek = date.plusDays(7);
const lastMonth = date.minusMonths(1);
const nextYear = date.plusYears(1);

// Comparison
date.isBefore(nextWeek);  // true
date.isAfter(nextWeek);   // false
date.isEqual(parsed);     // true

// Convert to native Date at midnight
const jsDate = date.atStartOfDay();

// Combine with a LocalTime
const jsDateTime = date.atTime(9, 30); // 09:30 on 2024-03-15

// Format
date.toISOString();                     // "2024-03-15"
date.toLocaleString('de-DE');           // "15.3.2024"
```

## `LocalTime`

```ts
import {LocalTime} from '@rytrox/time';

// Create from ISO string
const time = new LocalTime('09:30:00.000');

// Create from individual components
const time2 = new LocalTime(9, 30, 0, 0);

// Current time
const now = LocalTime.now();

// Arithmetic (immutable)
const later = time.plusHours(2);
const earlier = time.minusMinutes(15);

// Comparison
time.isBefore(later);   // true
time.isAfter(earlier);  // false
time.isEqual(time2);    // true

// Format
time.toISOString();                     // "09:30:00.000"
time.toLocaleString('de-DE');           // "09:30:00"
```

## `YearMonth`

```ts
import {YearMonth, Month} from '@rytrox/time';

// Create from year and month
const ym = new YearMonth(2024, Month.MARCH);

// Factory methods
const current = YearMonth.now();
const parsed = YearMonth.parse('2024-03');
const specific = YearMonth.of(2024, Month.MARCH);

// Navigation
const next = new YearMonth(2024, Month.APRIL);
ym.isBefore(next);   // true
ym.isAfter(next);    // false
ym.isEqual(parsed);  // true

// Get dates within the month
const lastDay = ym.atEndOfMonth();   // LocalDate: 2024-03-31
const firstDay = ym.atDay(1);        // LocalDate: 2024-03-01
const days = ym.lengthOfMonth();     // 31

// Format
ym.toISOString();           // "2024-03"
ym.toLocaleString('de-DE'); // "03/2024"
```

## `Month` & `DayOfWeek`

```ts
import {Month, DayOfWeek} from '@rytrox/time';

Month.JANUARY   // 0 (zero-based, compatible with JS Date)
Month.DECEMBER  // 11

DayOfWeek.SUNDAY    // 0
DayOfWeek.SATURDAY  // 6
```

## Type Guards

```ts
import {isLocalDateString, isLocalTimeString, isYearMonthString} from '@rytrox/time';

isLocalDateString('2024-03-15');    // true
isLocalTimeString('09:30:00');      // true
isYearMonthString('2024-03');       // true
```

## Yup Schema Integration (optional)

Requires `yup` to be installed.

```ts
import {localDate, localTime, yearMonth} from '@rytrox/time';
import * as yup from 'yup';

const schema = yup.object({
    startDate: localDate().required('Start date is required'),
    endDate: localDate()
        .required('End date is required')
        .min(yup.ref('startDate'), 'End date must be after start date'),
    meetingTime: localTime().required(),
    billingMonth: yearMonth().required(),
});
```

# API Overview

## `LocalDate`

| Method                                                                                | Description                    |
|---------------------------------------------------------------------------------------|--------------------------------|
| `LocalDate.now()`                                                                     | Returns today's date           |
| `LocalDate.parse(str)`                                                                | Parses an ISO date string      |
| `LocalDate.of(year, month, dayOfMonth)`                                               | Creates a date from components |
|                                                                                       |                                |
| `LocalDate#plusDays(n)` / `LocalDate#minusDays(n)`                                    | Add / subtract days            |
| `LocalDate#plusMonths(n)` / `LocalDate#minusMonths(n)`                                | Add / subtract months          |
| `LocalDate#plusYears(n)` / `LocalDate#minusYears(n)`                                  | Add / subtract years           |
| `LocalDate#withDayOfMonth(d)`                                                         | New instance with day of month |
| `LocalDate#withMonth(m)`                                                              | New instance with month        |
| `LocalDate#withYear(y)`                                                               | New instance with year         |
| `LocalDate#isBefore(other)` / `LocalDate#isEqual(other)` / `LocalDate#isAfter(other)` | Compare Date                   |
| `LocalDate#atStartOfDay()`                                                            | Convert to JS Date at midnight |
| `LocalDate#atTime(h, m, s?, ms?)`                                                     | Convert to JS Date at time     |
| `LocalDate#toISOString()`                                                             | Convert to ISO string          |
| `LocalDate#toLocaleString(locale?, options?)`                                         | Convert to locale string       |

## `LocalTime`

| Method                                                                                | Description                    |
|---------------------------------------------------------------------------------------|--------------------------------|
| `LocalTime.now()`                                                                     | Returns current time           |
| `LocalTime.parse(str)`                                                                | Parses an ISO time string      |
| `LocalTime.of(h, m, s?, ms?)`                                                         | Creates a time from components |
|                                                                                       |                                |
| `LocalTime#plusHours(n)` / `LocalTime#minusHours(n)`                                  | Add / subtract hours           |
| `LocalTime#withHour(h)`                                                               | New instance with hour         |
| `LocalTime#withMinute(m)`                                                             | New instance with minute       |
| `LocalTime#withSecond(s)`                                                             | New instance with second       |
| `LocalTime#withMilli(ms)`                                                             | New instance with millisecond  |
| `LocalTime#isBefore(other)` / `LocalTime#isEqual(other)` / `LocalTime#isAfter(other)` | Compare Time                   |
| `LocalTime#toISOString()`                                                             | Convert to ISO string          |
| `LocalTime#toLocaleString(locale?, options?)`                                         | Convert to locale string       |

## `YearMonth`

| Method                                                                                | Description                          |
|---------------------------------------------------------------------------------------|--------------------------------------|
| `YearMonth.of(y, m)`                                                                  | Creates a year-month from components |
| `YearMonth.now()`                                                                     | Returns current year-month           |
| `YearMonth.parse(str)`                                                                | Parses an ISO year-month string      |
|                                                                                       |                                      | 
| `YearMonth#plusYears(n)` / `YearMonth#minusYears(n)`                                  | Add / subtract years                 |
| `YearMonth#plusMonths(n)` / `YearMonth#minusMonths(n)`                                | Add / subtract months                |
| `YearMonth#withYear(y)`                                                               | New instance with year               |
| `YearMonth#withMonth(m)`                                                              | New instance with month              |
| `YearMonth#isBefore(other)` / `YearMonth#isEqual(other)` / `YearMonth#isAfter(other)` | Compare YearMonth                    |
| `YearMonth#toISOString()`                                                             | Convert to ISO string                |
| `YearMonth#toLocaleString(locale?, options?)`                                         | Convert to locale string             |

License
ISC — © The Rytrox Group