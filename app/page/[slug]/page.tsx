import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Render } from "@puckeditor/core/rsc";
import type { Config, Data } from "@puckeditor/core";
import { getPageBySlug } from "@/lib/page-data";
import { fetchProducts } from "@/lib/api/services/products";
import config from "@/lib/puck-components.server.jsx";

export const dynamic = "force-dynamic";

type PageRouteProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type PublishedPageProps = {
  slug: string;
  routeParams: Record<string, string | string[] | undefined>;
  searchParams: Record<string, string | string[] | undefined>;
};

type PuckContentItem = {
  type?: string;
  props?: {
    searchQuery?: string;
    thenBranch?: PuckContentItem[];
  };
};

export async function generateMetadata({
  params,
}: PageRouteProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: `${slug} — Puck Editor`,
  };
}

export async function generateStaticParams() {
  return [];
}

function extractSearchQuery(data: { content?: unknown[] }): string {
  const conditional = (data.content ?? []).find(
    (item): item is PuckContentItem =>
      isPuckContentItem(item) && item.type === 'ConditionalSection',
  );
  const thenBranch = conditional?.props?.thenBranch ?? [];
  const productGrid = thenBranch.find((item) => item.type === 'ProductGrid');
  return productGrid?.props?.searchQuery ?? '';
}

function isPuckContentItem(item: unknown): item is PuckContentItem {
  return typeof item === 'object' && item !== null && 'type' in item;
}

async function fetchPageConditions(slug: string, data: { content?: unknown[] }): Promise<Record<string, boolean>> {
  const conditions: Record<string, boolean> = {};

  if (slug === 'products') {
    const searchQuery = extractSearchQuery(data);
    const productsData = await fetchProducts({ q: searchQuery, pageSize: 1 });
    conditions.hasProducts = (productsData.totalItems ?? 0) > 0;
  }

  return conditions;
}

export async function PublishedPage({ slug, routeParams, searchParams }: PublishedPageProps) {
  const cookieStore = await cookies();
  const requestCookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const conditions = await fetchPageConditions(slug, page.data);

  return (
    <Render
      config={config as unknown as Config}
      data={page.data as unknown as Data}
      metadata={{
        pageSlug: slug,
        routeParams,
        searchParams,
        requestCookies,
        conditions,
      }}
    />
  );
}

export default async function PagePage({ params, searchParams }: PageRouteProps) {
  const { slug } = await params;
  // Canonical detail pages require a real entity identity and must use the nested route.
  if (slug === 'category-detail' || slug === 'product-detail') notFound();
  return <PublishedPage slug={slug} routeParams={{ slug }} searchParams={await searchParams} />;
}
