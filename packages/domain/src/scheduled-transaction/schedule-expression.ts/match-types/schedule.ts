import type { EveryNDaysSchedule } from '../classifiiers/every-n-days-classifier.ts';
import type { EveryNthWeekDaySchedule } from '../classifiiers/every-n-weekdays-schedule.ts';
import type { NoMatch } from './no-match.ts';
import type { WeeklySchedule } from '../classifiiers/weekly-schedule-classifier.ts';

export type Schedule =
  | EveryNDaysSchedule
  | EveryNthWeekDaySchedule
  | WeeklySchedule
  | NoMatch;
