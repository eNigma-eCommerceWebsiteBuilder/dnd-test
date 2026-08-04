export function ProductDetailTrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-4 pt-6">
      <div className="flex items-center gap-3 text-xs font-semibold text-text-muted">
        <span className="material-symbols-outlined text-primary">local_shipping</span>
        Free Global Shipping
      </div>
      <div className="flex items-center gap-3 text-xs font-semibold text-text-muted">
        <span className="material-symbols-outlined text-primary">assignment_return</span>
        30-Day Easy Returns
      </div>
    </div>
  );
}
