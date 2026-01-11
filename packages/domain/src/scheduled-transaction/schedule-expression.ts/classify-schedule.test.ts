import { classifySchedule } from './classify-schedule.ts';
describe('classify schedule', () => {
  it('can correctly identify every week strings', () => {
    expect(classifySchedule('every monday')).toEqual({
      type: 'every-week',
      monday: true,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });

    expect(classifySchedule('every tuesday')).toEqual({
      type: 'every-week',
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });

    expect(classifySchedule('every wednesday')).toEqual({
      type: 'every-week',
      monday: false,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  });
});
