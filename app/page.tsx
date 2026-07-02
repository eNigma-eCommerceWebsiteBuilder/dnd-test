import Link from "next/link";
import { getAllPages } from "@/lib/page-data";

export default async function Home() {
  const pages = await getAllPages();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-bg-base font-sans min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-12 py-24 px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text-base">
            Puck Visual Editor
          </h1>
          <p className="max-w-md text-lg text-text-muted">
            Build pages visually with drag-and-drop components, then publish
            and view them instantly.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/editor"
            className="inline-flex h-12 items-center justify-center rounded-button bg-cta-primary px-6 text-sm font-semibold text-on-primary shadow-button transition-all hover:bg-cta-primary-hover hover:shadow-button-hover"
          >
            Open Editor
          </Link>
        </div>

        {pages.length > 0 && (
          <div className="w-full">
            <h2 className="text-xl font-semibold text-text-base mb-4">
              Saved Pages
            </h2>
            <ul className="flex flex-col gap-2">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/page/${page.slug}`}
                    className="flex items-center justify-between rounded-card border border-border bg-bg-surface px-5 py-4 shadow-card transition-colors hover:border-text-lighter"
                  >
                    <span className="font-medium text-text-base">
                      /page/{page.slug}
                    </span>
                    <span className="text-sm text-text-muted">
                      {page.data?.content?.length || 0} components &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pages.length === 0 && (
          <p className="text-sm text-text-muted">
            No pages yet. Open the editor to create one.
          </p>
        )}
      </main>
    </div>
  );
}
