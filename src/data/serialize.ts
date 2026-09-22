import { Prisma } from "@/generated/prisma/client";

export type Serialized<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;

/**
 * Converts Prisma results into plain JSON-safe page props:
 * Decimal -> number, Date -> ISO string, undefined keys dropped.
 */
export function serialize<T>(value: T): Serialized<T> {
  if (value === null || value === undefined) return value as Serialized<T>;
  if (Prisma.Decimal.isDecimal(value)) return (value as Prisma.Decimal).toNumber() as Serialized<T>;
  if (value instanceof Date) return value.toISOString() as Serialized<T>;
  if (Array.isArray(value)) return value.map(serialize) as Serialized<T>;
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) out[key] = serialize(val);
    }
    return out as Serialized<T>;
  }
  return value as Serialized<T>;
}
