import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getServerClient,
  tags,
  type Product,
  type ProductWithDetails,
} from "@/lib/store-client";
import { ProductDetail } from "./product-detail";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";
import { buildProductOffer } from "@/lib/product-offer";

// Pre-enumerate every product slug at build time so Next can emit cacheable
// responses (s-maxage instead of no-store) for the route. Without this, every
// PDP is treated as fully runtime-dynamic and CF edge skips it. Placeholder
// fallback keeps the build alive if the catalogue API isn't reachable at
// build time; the page handler already calls notFound() on unknown slugs.
export async function generateStaticParams() {
  const r = await getServerClient().catalogue.getProducts({ limit: 10_000 });
  if (!r.ok || r.value.items.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return r.value.items.map((p) => ({ slug: p.slug ?? p.id }));
}

export const revalidate = 3600;

function productLd(product: ProductWithDetails, SITE_URL: string) {
  const image = product.image_url ?? product.images?.[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: image ? [image] : undefined,
    sku: product.id,
    brand: { "@type": "Brand", name: brand.name },
    offers: buildProductOffer(product, {
      url: `${SITE_URL}/products/${product.slug ?? product.id}`,
      currency: brand.currency,
    }),
  };
}

interface ProductData {
  product: ProductWithDetails;
  related: Product[];
}

type ProductResult =
  | { ok: true; data: ProductData }
  | { ok: false; code: string };

async function getProduct(slug: string): Promise<ProductResult> {
  const client = getServerClient();
  const r = await client.catalogue.getProductBySlug(slug, {
    cacheOptions: {
      revalidate: 3600,
      tags: [tags.product(slug), tags.products()],
    },
  });
  if (!r.ok) return { ok: false, code: r.error.code };

  const product = r.value;
  // Tag with the resolved ID — Cimplify dispatches tags.product(id), not slug.
  // See https://cimplify.dev/docs/sdk/revalidation#dynamic-routes--tag-by-id-never-by-slug
  const related = product.category_id
    ? await client.catalogue
        .getCategoryProducts(product.category_id, undefined, {
          cacheOptions: {
            revalidate: 3600,
            tags: [
              tags.product(product.id),
              tags.categoryProducts(product.category_id),
            ],
          },
        })
        .then((res) =>
          res.ok
            ? (
                ((res.value as { items?: Product[] }).items ??
                  (res.value as Product[])) as Product[]
              ).filter((p) => p.id !== product.id).slice(0, 4)
            : [],
        )
    : [];

  return { ok: true, data: { product, related } };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = await getSiteUrl();
  const result = await getProduct(slug);
  if (!result.ok) return {};
  const { product } = result.data;
  const image = product.image_url ?? product.images?.[0];
  return {
    title: `${product.name} — ${brand.name}`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteUrl = await getSiteUrl();
  const result = await getProduct(slug);
  if (!result.ok) {
    if (result.code === "NOT_FOUND") notFound();
    // Transient SDK error — render the soft skeleton; ISR will retry on next request.
    return <ProductSkeleton />;
  }
  const data = result.data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd(data.product, siteUrl)) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-6 sm:px-8 pt-6 text-[12px] font-mono text-muted-foreground hidden sm:flex items-center gap-2"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        {data.product.category?.slug && (
          <>
            <span>/</span>
            <Link
              href={`/categories/${data.product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {data.product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground/90 truncate">{data.product.name}</span>
      </nav>
      <ProductDetail product={data.product} related={data.related} />
    </>
  );
}

function ProductSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
        <div className="aspect-square bg-muted rounded-3xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-7 w-32 bg-muted rounded animate-pulse" />
          <div className="h-20 w-full bg-muted rounded animate-pulse mt-6" />
          <div className="h-12 w-full bg-muted rounded animate-pulse mt-4" />
        </div>
      </div>
    </section>
  );
}
