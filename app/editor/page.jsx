"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Puck, Button } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import config from "@/lib/puck-components.jsx";

function EditorContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "home";
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((res) => (res.ok ? res.json() : { data: { content: [] } }))
      .then((page) => setData(page.data || { content: [] }))
      .catch(() => setData({ content: [] }));
  }, [slug]);

  const handlePublish = async (newData) => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save page:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-text-muted">
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <>
      <Puck
        config={config}
        data={data}
        onPublish={handlePublish}
        headerTitle={`Editing: ${slug}`}
        headerPath={`/page/${slug}`}
        overrides={{
          headerActions: ({ children }) => (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {saving && (
                <span style={{ fontSize: "13px", color: "#888" }}>Saving...</span>
              )}
              {saved && (
                <span style={{ fontSize: "13px", color: "green" }}>Saved!</span>
              )}
              <Button href={`/page/${slug}`} newTab size="medium">
                View Page
              </Button>
              {children}
            </div>
          ),
        }}
      />
    </>
  );
}

export default function Editor() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-text-muted">
          <p>Loading editor...</p>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
