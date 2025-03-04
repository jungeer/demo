import ProductList from '@/components/ProductList';
import { getAllProducts } from '@/api/products';

const mockProducts = getAllProducts();

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        高端电子产品展示
      </h1>
      <ProductList initialProducts={mockProducts} />
    </main>
  );
}
