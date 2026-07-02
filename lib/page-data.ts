import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "pages.json");

export interface PageEntry {
  slug: string;
  data: {
    content?: unknown[];
    root?: Record<string, unknown>;
  };
}

export async function getAllPages(): Promise<PageEntry[]> {
  try {
    const content = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<PageEntry | undefined> {
  const pages = await getAllPages();
  return pages.find((p) => p.slug === slug);
}

export async function savePage(slug: string, data: PageEntry["data"]): Promise<PageEntry> {
  const pages = await getAllPages();
  const existingIndex = pages.findIndex((p) => p.slug === slug);

  if (existingIndex >= 0) {
    pages[existingIndex].data = data;
  } else {
    pages.push({ slug, data });
  }

  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(pages, null, 2), "utf-8");

  return { slug, data };
}

export async function deletePage(slug: string): Promise<boolean> {
  const pages = await getAllPages();
  const index = pages.findIndex((p) => p.slug === slug);

  if (index === -1) return false;

  pages.splice(index, 1);
  await fs.writeFile(dataFilePath, JSON.stringify(pages, null, 2), "utf-8");
  return true;
}
