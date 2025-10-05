export const dynamic = "force-dynamic";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../lib/data";
import { initializeApp } from "../lib/initialize";

export default async function Home() {
  // Initialize the app on first load
  await initializeApp();
  
  const products = await getProducts(1000);

  // Featured ve diğer ürünleri ayır
  const featuredProducts = products.filter(p => p.featured);
  const otherProducts = products.filter(p => !p.featured).slice(0, 8);

  return (
    <div>
      <main className="max-w-screen-2xl mx-auto px-1 sm:px-2 lg:px-4 py-8 bg-dark">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4 animate-bounce">Yaz İndirimi Başladı!</h1>
          <p className="text-lg text-yellow-400 font-semibold mb-2 animate-pulse">Tüm Oto Tuning Malzemelerinde %40'a Varan İndirim</p>
          <p className="text-md text-metallic max-w-2xl mx-auto mb-2">Hızlı Teslimat, Güvenli Alışveriş, Sadece Mega Oto Tuning'de!</p>
          <p className="text-md text-blue-500 font-medium animate-bounce">Şimdi Al, Fırsatları Kaçırma!</p>
        </section>

        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-extrabold text-yellow-400 mb-6 animate-bounce">Öne Çıkanlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map(product => (
                <div key={product._id} className="border-2 sm:border-4 border-yellow-400 rounded-xl shadow-xl scale-100 sm:scale-105 bg-white p-1 sm:p-2 animate-pulse">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-White-800 mb-6">Son Eklenenler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {otherProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
