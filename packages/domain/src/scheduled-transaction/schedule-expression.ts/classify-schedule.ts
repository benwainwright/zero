import { CachingClassifier } from './caching-classifier.ts';
import { WeeklyScheduleClassifier } from './classifiiers/weekly-schedule-classifier.ts';
import { EveryNDaysClassifer } from './classifiiers/every-n-days-classifier.ts';

const classifier = new CachingClassifier([
  new WeeklyScheduleClassifier(),
  new EveryNDaysClassifer(),
]);

export const classifySchedule = (text: string) => {
  return classifier.classify(text);
};
