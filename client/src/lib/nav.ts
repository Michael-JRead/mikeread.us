import { NAV_ITEMS } from "@/data/siteContent";
import { HAS_BLOG_POSTS } from "@/content/blog/count";

// The site's navigation, shared by the navbar and the footer. The Blog link
// appears once a post is published, so no link points at an empty page.
export const SITE_NAV = NAV_ITEMS.filter((item) => item.href !== "/blog" || HAS_BLOG_POSTS);

// Anchor items (#foo) are sections of the home page; route items (/foo) are pages.
export const isAnchor = (href: string) => href.startsWith("#");
export const isRoute = (href: string) => href.startsWith("/");

/** Where a nav item points from the current page: anchors jump home first when
 * viewed from another route; routes are used verbatim. */
export const navHref = (href: string, onHome: boolean) =>
  isRoute(href) || onHome ? href : `/${href}`;
