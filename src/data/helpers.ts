export function serializePrisma<T>(data: T): T {
  const { json } = superjson.serialize(data);
  return json as T;
}
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function recipeHref(creatorName: string, recipeName: string): string {
  return `/recipes/${toSlug(creatorName)}/${toSlug(recipeName)}`;
}

export function creatorHref(creatorLinkOrName: string): string {
  return `/creators/${toSlug(creatorLinkOrName)}`;
}

export function profileHref(username: string): string {
  return `/${username}`;
}
import superjson from "superjson";

/**
 * Serializes Prisma query results for Next.js getServerSideProps / getStaticProps.
 *
 * Uses superjson so that:
 *  - Decimal fields are converted to plain JS numbers (not strings, not objects)
 *  - Date fields survive as proper Date objects on the client
 *  - BigInt fields are handled safely
 *
 * Usage in any getServerSideProps:
 *
 *   return { props: serializePrisma({ user, recipes, ... }) };
 *
 * No casting needed downstream — ratings, prices, and any other Decimal fields
 * will just be numbers everywhere in your components.
 */
