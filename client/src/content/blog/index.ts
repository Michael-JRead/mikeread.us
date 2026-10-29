// Published posts. Every .md file directly in this folder is a post; files in
// drafts/ are not picked up. The blog pages load this module lazily, so post
// text never ships in the homepage bundle.
import { parsePost, sortPosts, type BlogPost } from "@/lib/blog";

const files = import.meta.glob("./*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const POSTS: BlogPost[] = sortPosts(
  Object.entries(files).map(([path, raw]) =>
    parsePost(path.replace(/^\.\//, "").replace(/\.md$/, ""), raw),
  ),
);

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
