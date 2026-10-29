// Whether any post is published, without loading post text: the navbar uses
// this to show the Blog link only once there is something to read. Only the
// glob's keys are read; the loaders are never called.
const files = import.meta.glob("./*.md", { query: "?raw", import: "default" });

export const HAS_BLOG_POSTS = Object.keys(files).length > 0;
