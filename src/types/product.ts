export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  createdAt: string;
  popularity: number;
}

export type SortOption = 'price' | 'popularity' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}