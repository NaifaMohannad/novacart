import { Product } from "../types/product"

export async function getProducts(): Promise<Product[]> {

  const res = await fetch("https://fakestoreapi.com/products")

  const data: Product[] = await res.json()

  return data
}