---
title: Your post title
date: 2026-10-29
summary: One or two sentences. This shows on the blog index, in search results, link previews and the RSS feed.
tags: [vulnerability-research, cve]
---

This file is a template, and it is never published: only `.md` files sitting
directly in `client/src/content/blog/` go live. Files in this `drafts/` folder
are skipped.

**This repository is public.** A draft is hidden from the website, but anyone
can read it on GitHub. Never put embargoed or unpublished findings here.

## Publishing a post

1. Copy this file to `client/src/content/blog/`, named for the URL you want —
   `my-first-post.md` becomes `mikeread.us/blog/my-first-post`. Lowercase
   words joined by hyphens.
2. Fill in the four fields at the top. `date` is `YYYY-MM-DD`; posts are listed
   newest first. `tags` is optional.
3. Write the post below the closing `---` in Markdown, then commit and push.
   The site rebuilds and the post appears on the blog, in the sitemap and in
   the RSS feed. The **Blog** link shows up in the navigation as soon as the
   first post is published.

If a post is malformed — a missing field, a bad date — the build fails with a
message naming the file, rather than the post silently disappearing.

## What you can use

Headings with `##` and `###`, **bold**, *italics*, [links](https://www.mikeread.us),
`inline code`, lists, quotes, tables and fenced code blocks:

```java
// Fenced code blocks keep their formatting and scroll sideways if long.
byte[] buf = new byte[declaredLength]; // the bug in one line
```

> Quotes render with a red rule on the left.

| Column | Another |
| ------ | ------- |
| Tables | work too |

Images go in `client/public/assets/blog/` and are referenced like this:
`![Describe the image](/assets/blog/my-diagram.png)`.

Raw HTML is never rendered: a tag such as `<script>` shows up as plain text, so
a post cannot inject scripts or styles into the page. Put payloads and HTML
examples in code blocks so they display cleanly.
