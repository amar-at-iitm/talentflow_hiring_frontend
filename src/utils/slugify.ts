// src/utils/slugify.ts
export function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}
