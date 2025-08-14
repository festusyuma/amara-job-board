export class Env<T extends object> {
  constructor(private secrets: T) {}

  get<TK extends keyof T>(key: TK) {
    return this.secrets[key];
  }
}
