export interface EveryNthWeekDaySchedule {
  type: 'every-nth-weekday';
  every: number;
  weekDay:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'fridays'
    | 'saturday'
    | 'sunday';
}
