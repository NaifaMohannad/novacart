import { Suspense } from "react"


import { getProducts } from "@/data/products"
import ProductCard from "@/app/components/ProductCard"
type Props = {
  params: Promise<{ categoryName: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { categoryName } = await params
  const allProducts = await getProducts()
  const decoded = decodeURIComponent(categoryName)
  const products = allProducts.filter((p) => p.category === decoded)

  const formatCategory = (cat: string) =>
    cat.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return (
    <main className="min-h-screen bg-[#f1f3f6] pb-20 md:pb-6">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-400 mb-1">
            Home → Products → {formatCategory(decoded)}
          </p>
          <h1 className="text-2xl font-bold text-[#112663]">
            {formatCategory(decoded)}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {products.length} products found
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </main>
  )
}