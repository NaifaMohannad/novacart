import { Product } from "../types/product"

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://fakestoreapi.com/products", {
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status)
      return []
    }

    const data: Product[] = await res.json()
    return data

  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}