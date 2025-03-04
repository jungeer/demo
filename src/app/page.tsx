import ProductList from '@/components/ProductList';
import { getAllProducts } from '@/api/products';

const mockProducts = getAllProducts();

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white text-center mb-2">
          高端电子产品展示
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto">
          探索精选的顶级电子产品，体验科技带来的优质生活
        </p>
      </div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ProductList initialProducts={mockProducts} />
      </div>
    </main>
  );
}
