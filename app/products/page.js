
export const dynamic = "force-dynamic";

import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/data';
import Link from 'next/link';
import ProductsPageClient from '../../components/ProductsPageClient';

export default async function ProductsPage() {
  // Hata yönetimi ile ürünleri getir
  let products = [];
  let error = null;
  
  try {
    products = await getProducts(100); // Tüm ürünleri göster (maksimum 100)
  } catch (err) {
    console.error("Ürünleri getirirken hata:", err);
    error = "Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }

  return <ProductsPageClient products={products} error={error} />;
}
