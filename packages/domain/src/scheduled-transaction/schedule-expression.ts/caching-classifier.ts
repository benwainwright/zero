import type { Classifier } from './classifiiers/classifier.ts';
import type { Schedule } from './match-types/schedule.ts';

export class CachingClassifier {
  private cache = new Map<string, Schedule>();

  public constructor(private readonly classifier: Classifier<Schedule>[]) {}

  private doClassify(text: string) {
    const result = this.classifier.reduce<false | Schedule>(
      (last, item) => last || item.tryClassify(text),
      false
    );

    if (!result) {
      return {
        type: 'no_match',
      } as const;
    }

    return result;
  }

  public classify(text: string) {
    const cachedResult = this.cache.get(text);
    if (cachedResult) {
      return cachedResult;
    }

    const result = this.doClassify(text);
    this.cache.set(text, result);
    return result;
  }
}
