import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation, useParams } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Route-level code splitting: the sub-pages and each walkthrough load on demand,
// so the landing page never carries their (content-heavy) bundles.
const OffensiveSecurity = lazy(() => import("./pages/OffensiveSecurity"));
const HackTheBox = lazy(() => import("./pages/HackTheBox"));
const WalkthroughPage = lazy(() => import("./pages/WalkthroughPage"));

// Old walkthrough URLs used to live under /offensive-security/walkthroughs/:slug.
// Walkthroughs moved under /hackthebox/walkthroughs/:slug when the HTB page split
// out; keep the old URL alive by redirecting so anything indexed still lands somewhere.
function LegacyWalkthroughRedirect() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (slug) setLocation(`/hackthebox/walkthroughs/${slug}`, { replace: true });
  }, [slug, setLocation]);
  return <div className="page-gradient min-h-screen" aria-hidden="true" />;
}

function Router() {
  return (
    <Suspense fallback={<div className="page-gradient min-h-screen" aria-hidden="true" />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/offensive-security" component={OffensiveSecurity} />
        <Route path="/hackthebox" component={HackTheBox} />
        <Route path="/hackthebox/walkthroughs/:slug" component={WalkthroughPage} />
        <Route path="/offensive-security/walkthroughs/:slug" component={LegacyWalkthroughRedirect} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function useAnalytics() {
  useEffect(() => {
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
    const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

    if (!endpoint || !websiteId) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = `${endpoint.replace(/\/$/, "")}/umami`;
    script.dataset.websiteId = websiteId;

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);
}

function App() {
  useAnalytics();

  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;