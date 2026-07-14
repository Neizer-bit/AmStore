import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getServerClient,
  tags,
  type Category,
  type Product,
} from "@/lib/store-client";
import { ListingClient } from "./listing-client";
import { brand } from "@/lib/brand";

// See app/products/[slug]/page.tsx for the rationale on generateStaticParams.
export async function generateStaticParams() {
  const r = await getServerClient().catalogue.getCategories();
  if (!r.ok || r.value.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return r.value.map((c) => ({ slug: c.slug ?? c.id }));
}

export const revalidate = 3600;

interface CategoryData {
  category: Category;
  products: Product[];
}

type CategoryResult =
  | { ok: true; data: CategoryData }
  | { ok: false; code: string };

async function getCategory(slug: string): Promise<CategoryResult> {
  const client = getServerClient();
  const catRes = await client.catalogue.getCategoryBySlug(slug, {
    cacheOptions: { revalidate: 3600, tags: [tags.categories()] },
  });
  if (!catRes.ok) return { ok: false, code: catRes.error.code };

  const r = await client.catalogue.getCategoryProducts(catRes.value.id, undefined, {
    cacheOptions: {
      revalidate: 3600,
      tags: [
        tags.category(catRes.value.id),
        tags.categoryProducts(catRes.value.id),
      ],
    },
  });
  const products = r.ok
    ? ((r.value as { items?: Product[] }).items ?? (r.value as Product[]))
    : [];
  return { ok: true, data: { category: catRes.value, products } };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategory(slug);
  if (!result.ok) return {};
  const data = result.data;
  return {
    title: `${data.category.name} — ${brand.name}`,
    description: data.category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCategory(slug);
  if (!result.ok) {
    if (result.code === "NOT_FOUND") notFound();
    return <CategorySkeleton />;
  }
  const { category, products } = result.data;
  return (
    <>
      <section className="bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-14">
          <nav className="text-[12px] font-mono text-background/60 mb-3 hidden sm:flex items-center gap-2">
            <Link href="/" className="hover:text-background transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-background transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-background/90">{category.name}</span>
          </nav>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold m-0 -tracking-[0.025em]">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-base text-background/75">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.16em] text-background/60 tabular-nums">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
        <ListingClient products={products} />
        {products.length === 0 && (
          <p className="text-center mt-8">
            <Link href="/shop" className="text-primary font-semibold hover:underline">
              ← Browse all products
            </Link>
          </p>
        )}
      </section>
    </>
  );
}

function CategorySkeleton() {
  return (
    <>
      <section className="bg-foreground py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-3 w-32 bg-background/20 rounded mb-3 animate-pulse" />
          <div className="h-12 w-72 bg-background/20 rounded animate-pulse" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    </>
  );
}
