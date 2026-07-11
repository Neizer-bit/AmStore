import type { Metadata } from "next";
import { Suspense } from "react";
import { getServerClient, tags } from "@/lib/store-client";
import { ShopClient } from "./shop-client";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Shop — ${brand.name}`,
  description: brand.description,
};

export const revalidate = 3600;

async function getShopData() {
  const client = getServerClient();
  const [p, c] = await Promise.all([
    client.catalogue.getProducts(
      { limit: 50 },
      { cacheOptions: { revalidate: 3600, tags: [tags.products()] } },
    ),
    client.catalogue.getCategories({
      cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
    }),
  ]);
  return {
    products: p.ok ? p.value.items : [],
    categories: c.ok ? c.value : [],
  };
}

export default async function ShopPage() {
  const { products, categories } = await getShopData();
  return (
    <>
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-14">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-background/60">
            {brand.shopPage.eyebrow}
          </p>
          <h1 className="m-0 [font-family:var(--font-display)] text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1]">
            {brand.shopPage.title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-background/75">{brand.shopPage.body}</p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <ShopClient products={products} categories={categories} />
      </Suspense>
    </>
  );
}
