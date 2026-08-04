"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Puck, Button } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import config from "@/lib/puck-components.jsx";

const pageSlugAliases = {
  "order-detail": "account-order-detail",
};

const staticPublishedRoutes = {
  home: "/page/home",
  auth: "/page/auth",
  products: "/page/products",
  categories: "/categories",
  collections: "/collections",
  search: "/search",
  cart: "/cart",
  checkout: "/page/checkout",
  "checkout-success": "/checkout/success",
  "checkout-subscription": "/checkout/subscription",
  account: "/account",
  "account-orders": "/page/account-orders",
  "account-addresses": "/account/addresses",
  "account-downloads": "/page/account-downloads",
  "account-payment-methods": "/account/payment-methods",
  "account-returns": "/account/returns",
  "account-settings": "/page/account-settings",
  "account-sessions": "/account/sessions",
  "account-subscriptions": "/account/subscriptions",
  "account-wishlist": "/account/wishlist",
};

const entityPublishedRoutes = {
  "category-detail": { prefix: "/categories/", defaultEntitySlug: "accessories" },
  "product-detail": { prefix: "/products/", defaultEntitySlug: "wool-scarf" },
  "collection-detail": { prefix: "/collections/", defaultEntitySlug: "curated-essentials" },
  downloads: { prefix: "/downloads/" },
  "shared-wishlist": { prefix: "/wishlist/shared/" },
  "account-order-detail": { prefix: "/account/orders/" },
  "account-order-downloads": { prefix: "/account/orders/", suffix: "/downloads" },
  "account-order-return": { prefix: "/account/orders/", suffix: "/return" },
  "account-return-detail": { prefix: "/account/returns/" },
  "account-subscription-detail": { prefix: "/account/subscriptions/" },
};

function getPublishedHref(slug, entitySlug) {
  const entityRoute = entityPublishedRoutes[slug];
  if (entityRoute) {
    const entity = entitySlug || entityRoute.defaultEntitySlug;
    return entity ? `${entityRoute.prefix}${encodeURIComponent(entity)}${entityRoute.suffix || ""}` : null;
  }

  return staticPublishedRoutes[slug] || `/page/${slug}`;
}

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
  const requestedSlug = searchParams.get("slug") || "home";
  const slug = pageSlugAliases[requestedSlug] || requestedSlug;
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const entitySlug = searchParams.get("entitySlug");
  const publishedHref = getPublishedHref(slug, entitySlug);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((res) => (res.ok ? res.json() : { data: { content: [] } }))
      .then((page) => setData(page.data || { content: [] }))
      .catch(() => setData({ content: [] }));
  }, [slug]);

  const handlePublish = async (newData) => {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      const response = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: newData }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || `Publish failed with status ${response.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save page:", err);
      setSaveError(err instanceof Error ? err.message : "Unable to publish this page.");
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
          {saveError && (
            <span style={{ fontSize: "13px", color: "#dc2626" }}>{saveError}</span>
          )}
          {publishedHref ? (
            <Button href={publishedHref} newTab size="medium">
              View Page
            </Button>
          ) : (
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Add `entitySlug` to open this dynamic published route
            </span>
          )}
          {children}
        </div>
      ),
      drawer: DrawerWithSearch,
    }),
    [publishedHref, saveError, saving, saved],
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
