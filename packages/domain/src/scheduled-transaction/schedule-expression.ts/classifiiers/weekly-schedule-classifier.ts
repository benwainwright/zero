import { Classifier } from './classifier.ts';

export interface WeeklySchedule {
  type: 'every-week';
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export class WeeklyScheduleClassifier extends Classifier<WeeklySchedule> {
  protected override readonly regex = /every\s(?<day>[\d]*)\s?\w*$/;

  protected override hydrateClassification(
    match: RegExpMatchArray
  ): WeeklySchedule {
    const day = match?.groups?.['day'] ?? '';

    const days = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };

    days[day as keyof typeof days] = true;

    return {
      type: 'every-week',
      ...days,
    };
  }
}
