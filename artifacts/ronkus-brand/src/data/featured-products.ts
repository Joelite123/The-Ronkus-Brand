import { products, type Product } from './catalog.ts';

export interface FeaturedProductsDataSource {
  listFeaturedProducts(): Product[];
}

const localFeaturedProductsDataSource: FeaturedProductsDataSource = {
  listFeaturedProducts: () => products,
};

// Keep the homepage independent of where featured product records are stored.
// A future Supabase-backed source can replace this local implementation.
export const featuredProductsDataSource = localFeaturedProductsDataSource;
