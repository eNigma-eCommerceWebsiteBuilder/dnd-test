"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Puck, Button } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import config from "@/lib/puck-components.jsx";

function DrawerWithSearch({ children }) {
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef("");

  const applyFilter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const q = searchRef.current.trim().toLowerCase();
    const isSearching = q.length > 0;

    // Filter individual items
    const items = container.querySelectorAll("[data-puck-drawer-item]");
    items.forEach((item) => {
      const testid = item.getAttribute("data-testid") || "";
      const name = testid.replace("drawer-item:", "");
      if (!isSearching) {
        item.style.display = "";
        item.style.padding = "";
        return;
      }
      const conf = name ? config.components[name] : null;
      const label = (conf?.label || name || "").toLowerCase();
      const category = (conf?.category || "").toLowerCase();
      const text = (item.textContent || "").toLowerCase();
      const matches =
        name.toLowerCase().includes(q) ||
        label.includes(q) ||
        category.includes(q) ||
        text.includes(q);
      item.style.display = matches ? "" : "none";
    });

    // Process each category section
    const contentDivs = container.querySelectorAll(
      '[id^="puck-drawer-category-"]',
    );
    contentDivs.forEach((content) => {
      const parent = content.parentElement;
      if (!parent) return;

      // The title button is the previous sibling of the content div
      const titleBtn = parent.querySelector(
        `[aria-controls="${content.id}"]`,
      );

      const visibleItems = Array.from(
        content.querySelectorAll("[data-puck-drawer-item]"),
      ).filter((item) => item.style.display !== "none");

      if (isSearching) {
        if (visibleItems.length > 0) {
          // Show this category
          parent.style.display = "";
          parent.style.marginTop = "0px";
          parent.style.paddingTop = "0px";

          // Force-expand the content
          content.style.display = "block";

          // Tighten the title
          if (titleBtn) {
            titleBtn.style.display = "";
            titleBtn.style.padding = "4px 8px";
            titleBtn.style.marginBottom = "0px";
          }

          // Tighten the inner Drawer gap
          const innerDrawer = content.querySelector('[data-puck-drawer="true"]');
          if (innerDrawer) {
            innerDrawer.style.gap = "4px";
          }

          // Tighten each visible item's draggable padding
          visibleItems.forEach((item) => {
            const draggable = item.querySelector("[class*='DrawerItem-draggable']") || item.firstElementChild;
            if (draggable) {
              draggable.style.padding = "6px 10px";
            }
            item.style.marginTop = "0px";
            item.style.marginBottom = "0px";
          });
        } else {
          // Hide entire category
          parent.style.display = "none";
        }
      } else {
        // Restore everything
        parent.style.display = "";
        parent.style.marginTop = "";
        parent.style.paddingTop = "";
        content.style.display = "";
        if (titleBtn) {
          titleBtn.style.display = "";
          titleBtn.style.padding = "";
          titleBtn.style.marginBottom = "";
        }
        const innerDrawer = content.querySelector('[data-puck-drawer="true"]');
        if (innerDrawer) {
          innerDrawer.style.gap = "";
        }
        visibleItems.forEach((item) => {
          const draggable = item.querySelector("[class*='DrawerItem-draggable']") || item.firstElementChild;
          if (draggable) {
            draggable.style.padding = "";
          }
          item.style.marginTop = "";
          item.style.marginBottom = "";
        });
      }
    });
  }, []);

  useEffect(() => {
    searchRef.current = search;
    applyFilter();
  }, [search, applyFilter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        applyFilter();
        pending = false;
      });
    });
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "aria-expanded"],
    });
    return () => observer.disconnect();
  }, [applyFilter]);

  return (
    <div ref={containerRef}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            padding: "4px 8px",
            background: "#f9fafb",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "13px",
              width: "100%",
              color: "#374151",
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Clear search"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "home";
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const publishedHref = slug === "category-detail"
    ? "/page/category-detail/accessories"
    : `/page/${slug}`;

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

  const overrides = useMemo(
    () => ({
      headerActions: ({ children }) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {saving && (
            <span style={{ fontSize: "13px", color: "#888" }}>Saving...</span>
          )}
          {saved && (
            <span style={{ fontSize: "13px", color: "green" }}>Saved!</span>
          )}
          <Button href={publishedHref} newTab size="medium">
            View Page
          </Button>
          {children}
        </div>
      ),
      drawer: DrawerWithSearch,
    }),
    [publishedHref, saving, saved],
  );

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
        headerPath={publishedHref}
        overrides={overrides}
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
