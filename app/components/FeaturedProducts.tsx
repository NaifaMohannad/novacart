import ProductCard from "./ProductCard"
import { getProducts } from "@/data/products"

export default async function FeaturedProducts(){

  const products = await getProducts()

  return(

    <section className="p-6">

      <h2 className="text-xl font-bold mb-4">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

        {products.slice(4,10).map((product)=>(
          <ProductCard key={product.id} product={product}/>
        ))}

      </div>

    </section>
  )
}