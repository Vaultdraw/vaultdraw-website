// Docs pages in reading order (group, then `order`), and grouped for the sidebar.
import { getCollection, type CollectionEntry } from "astro:content";
import { DOC_GROUPS } from "../content.config";

export type DocPage = CollectionEntry<"docs">;

export async function docsInOrder(): Promise<DocPage[]> {
  const rank = (p: DocPage) => DOC_GROUPS.indexOf(p.data.group);
  return (await getCollection("docs")).sort((a, b) => rank(a) - rank(b) || a.data.order - b.data.order);
}

export function byGroup(pages: DocPage[]): { group: string; pages: DocPage[] }[] {
  return DOC_GROUPS.map((group) => ({ group, pages: pages.filter((p) => p.data.group === group) })).filter(
    (g) => g.pages.length > 0,
  );
}
