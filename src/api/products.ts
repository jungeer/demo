import { Product } from "@/types/product";

// 使用固定的种子数据生成产品
const brands = ["Apple", "Samsung", "Huawei", "Xiaomi", "Sony"];
const categories = ["智能手机", "笔记本电脑", "智能手表", "平板电脑"];
const descriptions = [
  "这是一款高品质的电子产品，具有出色的性能和优雅的设计。",
  "采用顶级工艺制造，为用户带来极致体验。",
  "创新科技与人性化设计的完美结合。",
  "引领潮流的外观设计，卓越的性能表现。",
];

export const mockProducts: Product[] = Array.from({ length: 100 }, (_, i) => {
  const brandIndex = i % brands.length;
  const categoryIndex = Math.floor(i / 25) % categories.length;
  const descriptionIndex = i % descriptions.length;
  const basePrice = 1000 + (i * 100);
  const baseRating = 3 + (i % 20) / 10;
  const basePopularity = i % 100;
  const baseDate = new Date(2024, 0, 1);
  baseDate.setDate(baseDate.getDate() - i);

  return {
    id: `product-${i + 1}`,
    name: `${brands[brandIndex]} ${categories[categoryIndex]} ${i + 1}`,
    description: descriptions[descriptionIndex],
    price: basePrice,
    category: categories[categoryIndex],
    rating: Number(baseRating.toFixed(1)),
    image: `https://picsum.photos/seed/${i + 1}/400/300`,
    createdAt: baseDate.toISOString(),
    popularity: basePopularity,
  };
});

// 获取所有产品
export const getAllProducts = (
  page: number = 1,
  limit: number = 12
): Product[] => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return mockProducts.slice(start, end);
};

// 根据ID获取产品
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

// 搜索产品并返回建议
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
  );
};

// 获取所有可用类别
export const getCategories = (): string[] => {
  return Array.from(new Set(mockProducts.map((product) => product.category)));
};

// 获取价格范围
export const getPriceRange = () => {
  const prices = mockProducts.map((product) => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

// 过滤产品
export const filterProducts = (filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}): Product[] => {
  let filtered = [...mockProducts];

  if (filters.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating!);
  }

  // 分页
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  return filtered.slice(start, end);
};
