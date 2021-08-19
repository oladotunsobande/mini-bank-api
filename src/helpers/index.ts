import { randomBytes } from 'crypto';

export function throwIfUndefined<T>(x: T | undefined, name?: string): T {
  if (x === undefined) {
    throw new Error(`${name} must not be undefined`);
  }
  return x;
}

export function randomizeMongoURL(url: string): string {
  return url.replace(
    /([^/]\/)([^/][a-zA-Z-_0-9]+)/,
    `$1${randomBytes(4).toString('hex')}`,
  );
}

export function setRetryAfterTimeText(retrySeconds: number): string {
  if (retrySeconds < 60) {
    return `${retrySeconds} second(s)`;
  }
  
  return `${Math.ceil(retrySeconds)} minute(s)`;
}