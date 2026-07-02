import { notFound } from "next/navigation";
import { Render } from "@puckeditor/core/rsc";
import type { Config, Data } from "@puckeditor/core";
import { getPageBySlug } from "@/lib/page-data";
import config from "@/lib/puck-components.jsx";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

export default async function PagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <Render
      config={config as unknown as Config}
      data={page.data as unknown as Data}
    />
  );
}
