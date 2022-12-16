export type Optional<T> = T | undefined;

export type NonOptional<T> = Exclude<T, undefined>;

export function safeKeys<T extends Record<keyof unknown, unknown>>(obj: T): Extract<keyof T, string>[] {
  const keys = Object.keys(obj)
    .filter(key => typeof key === "string" && key in obj);

  return keys as Extract<keyof T, string>[];
}
