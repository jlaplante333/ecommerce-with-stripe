import Product from "@/components/Product";
import { products } from "@/data/products";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">E-commerce Store</h1>
            <Link 
              href="/test-runner" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Runner
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 justify-center mx-auto gap-4 place-center flex-wrap w-100 md:max-w-[900px]">
        {products.map((product) => (
          <Product product={product} key={product.product_id} />
        ))}
      </div>
    </div>
  );
}
