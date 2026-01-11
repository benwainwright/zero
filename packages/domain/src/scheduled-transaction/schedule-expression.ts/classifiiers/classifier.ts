export abstract class Classifier<T> {
  protected abstract readonly regex: RegExp;

  public tryClassify(text: string) {
    const match = this.regex.exec(text);
    if (!match) {
      return false;
    }
    return this.hydrateClassification(match);
  }

  protected abstract hydrateClassification(match: RegExpMatchArray): T;
}
