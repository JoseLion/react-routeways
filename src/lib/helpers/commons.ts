export function safeKeys<T extends Record<string, unknown>>(obj: T): Extract<keyof T, string>[] {
  const keys = Object.keys(obj).filter(key => key in obj);

  return keys as Extract<keyof T, string>[];
}
