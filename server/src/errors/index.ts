export class BaseError extends Error {
  constructor(message?: string) {
    super(message);
    this.stack = (<any>new Error()).stack;
    const proto = new.target.prototype;
    Object.setPrototypeOf(this, proto);
  }
}
