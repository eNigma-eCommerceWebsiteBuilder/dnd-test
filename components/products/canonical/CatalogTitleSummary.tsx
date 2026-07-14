interface CatalogTitleSummaryProps {
  title?: string;
  totalItems?: number;
}

export function CatalogTitleSummary({ title = 'All Products', totalItems = 0 }: CatalogTitleSummaryProps) {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-base mb-2">
        {title}
      </h1>
      <p className="text-text-muted font-medium">
        {totalItems.toLocaleString()} items found in collection
      </p>
    </div>
  );
}
