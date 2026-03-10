import HeroBanner from "./components/HeroBanner"
import CategorySection from "./components/CategorySection"
import BrandBanner from "./components/BrandBanner"
import BestSellers from "./components/BestSellers"
import PromoBanner from "./components/PromoBanner"
import FeaturedProducts from "./components/FeaturedProducts"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] flex flex-col pb-16 md:pb-0">
      <HeroBanner />
      <CategorySection />
      <BrandBanner />
      <BestSellers />
      <PromoBanner />
      <FeaturedProducts />
    </main>
  )
}