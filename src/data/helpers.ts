export function creatorSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "");
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function recipeHref(creatorName: string, recipeName: string): string {
  return `/recipes/${creatorSlug(creatorName)}/${toSlug(recipeName)}`;
}

export function creatorHref(creatorLinkOrName: string): string {
  return `/creators/${creatorSlug(creatorLinkOrName)}`;
}

export function profileHref(username: string): string {
  return `/${username}`;
}
