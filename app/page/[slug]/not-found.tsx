import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-base px-6 text-center">
      <div>
        <h1 className="text-3xl font-bold text-text-base">Page not published</h1>
        <p className="mt-2 text-text-muted">
          This page hasn&apos;t been published yet. Open the editor, add
          components, and click Publish.
        </p>
      </div>
      <Link
        href="/editor"
        className="inline-flex h-12 items-center justify-center rounded-button bg-cta-primary px-6 text-sm font-semibold text-on-primary shadow-button transition-all hover:bg-cta-primary-hover"
      >
        Open Editor
      </Link>
    </div>
  );
}
