export function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function slugToName(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
