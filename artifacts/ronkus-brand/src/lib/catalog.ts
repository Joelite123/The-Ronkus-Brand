import { categories, type Category } from '../data/catalog.ts';

export function slugifyLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function findCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => slugifyLabel(category.name) === slug);
}

export function findSubcategoryBySlug(category: Category, slug: string): string | undefined {
  return category.subcategories.find((subcategory) => slugifyLabel(subcategory) === slug);
}

export function getCategoryPath(category: Category): string {
  return `/shop/${slugifyLabel(category.name)}`;
}

export function getSubcategoryPath(category: Category, subcategory: string): string {
  return `${getCategoryPath(category)}/${slugifyLabel(subcategory)}`;
}
