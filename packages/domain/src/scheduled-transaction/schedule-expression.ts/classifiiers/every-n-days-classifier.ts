import { Classifier } from './classifier.ts';

export interface EveryNDaysSchedule {
  type: 'every-n-days';
  days: number;
}

export class EveryNDaysClassifer extends Classifier<EveryNDaysSchedule> {
  protected override readonly regex = /every\s(?<days>.*)\s(days)/;

  protected override hydrateClassification(match: RegExpMatchArray) {
    const days = match?.groups?.['days'] ?? '';

    return {
      type: 'every-n-days' as const,
      days: Number(days),
    };
  }
}
