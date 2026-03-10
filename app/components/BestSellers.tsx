import ProductCard from "./ProductCard"
import { getProducts } from "@/data/products"

export default async function BestSellers() {

  const products = await getProducts()

  return (

    <section className="w-full px-6 py-10 bg-white">

      <h2 className="text-xl font-bold mb-4">
        Best Sellers
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {products.slice(0,4).map((product)=>(
          <ProductCard key={product.id} product={product}/>
        ))}

      </div>

    </section>
  )
}