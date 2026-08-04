import type { ReactNode } from 'react';

interface DepartmentCategoriesSectionProps {
  grid: ReactNode;
}

// Extracted from app/categories/page.tsx.
export function DepartmentCategoriesSection({ grid }: DepartmentCategoriesSectionProps) {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-text-base">
          Browse by Department
        </h2>
        <div className="h-[2px] flex-1 bg-divider" />
      </div>
      {grid}
    </section>
  );
}
