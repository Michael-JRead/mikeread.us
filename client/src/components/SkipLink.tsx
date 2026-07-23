// Keyboard/screen-reader affordance: the first focusable element on every page,
// visually hidden until focused, jumps past the sticky nav to the main content.
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-red-600 focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      Skip to main content
    </a>
  );
}
