"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Product,
  SortOption,
  SortDirection,
  FilterOptions,
} from "@/types/product";
import ProductCard from "./ProductCard";
import {
  filterProducts,
  getCategories,
  getPriceRange,
  searchProducts,
} from "@/api/products";

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>(null);
  const categories = getCategories();
  const priceRange = getPriceRange();

  // 处理排序
  const handleSort = (option: SortOption) => {
    if (option === sortOption) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("desc");
    }
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const suggestions = searchProducts(query);
      setSearchSuggestions(suggestions);
      setProducts(suggestions);
    } else {
      setSearchSuggestions([]);
      loadProducts(1);
    }
  };

  // 加载产品
  const loadProducts = useCallback(
    (pageNum: number) => {
      setLoading(true);
      const filteredProducts = filterProducts({
        ...filters,
        page: pageNum,
        limit: 12,
      });

      if (pageNum === 1) {
        setProducts(filteredProducts);
      } else {
        setProducts((prev) => [...prev, ...filteredProducts]);
      }

      setHasMore(filteredProducts.length === 12);
      setLoading(false);
    },
    [filters]
  );

  // 无限滚动
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            loadProducts(nextPage);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadProducts]
  );

  // 应用过滤和排序
  useEffect(() => {
    setPage(1);
    loadProducts(1);
  }, [filters, loadProducts]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索产品..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
          {searchQuery && searchSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-auto">
              {searchSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion.name);
                    setProducts([suggestion]);
                    setSearchSuggestions([]);
                  }}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* 排序选项 */}
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value as SortOption)}
            >
              <option value="popularity">热门程度</option>
              <option value="price">价格</option>
              <option value="createdAt">最新上架</option>
            </select>
            <button
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* 过滤选项 */}
          <div className="flex flex-wrap gap-4">
            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              value={filters.category || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value || undefined,
                }))
              }
            >
              <option value="">所有类别</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="最低价格"
                className="w-24 px-2 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.minPrice || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
              <span>-</span>
              <input
                type="number"
                placeholder="最高价格"
                className="w-24 px-2 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>

            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              value={filters.minRating || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
            >
              <option value="">所有评分</option>
              {[3, 3.5, 4, 4.5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}星及以上
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            ref={index === products.length - 1 ? lastProductRef : undefined}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
}
